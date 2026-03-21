import { NextResponse } from "next/server";

import { CANVAS_OAUTH_CALLBACK_PATH, getCanvasWebOrigin } from "@/lib/canvas";

export const dynamic = "force-dynamic";

type CanvasTokenResponse = {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
};

function isAllowedRedirectUri(uri: string): boolean {
  try {
    const u = new URL(uri);
    if (u.pathname !== CANVAS_OAUTH_CALLBACK_PATH) return false;
    const h = u.hostname;
    if (h === "localhost" || h === "127.0.0.1") return true;
    const ref = process.env.NEXT_PUBLIC_CANVAS_REDIRECT_URI?.trim();
    if (ref) {
      return u.origin === new URL(ref).origin;
    }
    return false;
  } catch {
    return false;
  }
}

function resolveRedirectUri(body: { redirect_uri?: unknown }): string | null {
  const raw = typeof body.redirect_uri === "string" ? body.redirect_uri.trim() : "";
  if (raw && isAllowedRedirectUri(raw)) return raw;
  const env = process.env.NEXT_PUBLIC_CANVAS_REDIRECT_URI?.trim();
  if (env && isAllowedRedirectUri(env)) return env;
  return null;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const obj = typeof body === "object" && body ? (body as Record<string, unknown>) : {};
  const code = typeof obj.code === "string" ? obj.code : "";

  const clientId = process.env.CANVAS_CLIENT_ID;
  const clientSecret = process.env.CANVAS_CLIENT_SECRET;
  const redirectUri = resolveRedirectUri(obj);

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Canvas OAuth is not configured (CANVAS_CLIENT_ID and CANVAS_CLIENT_SECRET required)." },
      { status: 500 },
    );
  }

  if (!redirectUri) {
    return NextResponse.json(
      {
        error:
          "Missing or invalid redirect_uri. It must match /connect-canvas on localhost or NEXT_PUBLIC_CANVAS_REDIRECT_URI.",
      },
      { status: 400 },
    );
  }

  if (!code) {
    return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
  }

  const form = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code,
  });

  const tokenUrl = `${getCanvasWebOrigin()}/login/oauth2/token`;
  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  const text = await res.text();
  if (!res.ok) {
    let detail = text.slice(0, 800);
    try {
      const j = JSON.parse(text) as { error?: string; error_description?: string };
      if (typeof j.error_description === "string") detail = j.error_description;
      else if (typeof j.error === "string") detail = j.error;
    } catch {
      // keep raw
    }
    return NextResponse.json({ error: "Canvas token exchange failed", detail }, { status: 401 });
  }

  let data: CanvasTokenResponse;
  try {
    data = JSON.parse(text) as CanvasTokenResponse;
  } catch {
    return NextResponse.json({ error: "Invalid token response from Canvas" }, { status: 502 });
  }

  if (!data.access_token) {
    return NextResponse.json({ error: "No access_token in Canvas response" }, { status: 502 });
  }

  return NextResponse.json({
    access_token: data.access_token,
    expires_in: data.expires_in ?? null,
  });
}
