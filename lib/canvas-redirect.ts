import { headers } from "next/headers";

import { CANVAS_OAUTH_CALLBACK_PATH } from "@/lib/canvas";

/**
 * Builds the redirect_uri Canvas expects for this request (protocol + host + path).
 * Use this so dev on :3001 matches the token exchange (env often hardcodes :3000).
 */
export function connectCanvasRedirectUriFromHeaders(): string | null {
  const h = headers();
  const host = h.get("host");
  if (!host) return null;
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}${CANVAS_OAUTH_CALLBACK_PATH}`;
}
