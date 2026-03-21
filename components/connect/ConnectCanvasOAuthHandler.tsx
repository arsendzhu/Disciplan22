"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { CANVAS_OAUTH_CALLBACK_PATH } from "@/lib/canvas";
import { useCanvasStore } from "@/store/canvasStore";
import { useUserStore } from "@/store/userStore";

/**
 * Completes Canvas OAuth when `?code=` is present on `/connect-canvas`, then redirects to `/canvas`.
 */
export function ConnectCanvasOAuthHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setAccessToken = useCanvasStore((s) => s.setAccessToken);
  const markCanvasConnected = useUserStore((s) => s.markCanvasConnected);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const code = searchParams.get("code");
    const err = searchParams.get("error");
    if (err) {
      setOauthError(
        err === "access_denied" ? "Canvas access was denied." : "Canvas authorization failed.",
      );
      return;
    }
    if (!code) return;

    let cancelled = false;
    setBusy(true);
    (async () => {
      try {
        const res = await fetch("/api/auth/canvas/exchange", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            redirect_uri: `${window.location.origin}${CANVAS_OAUTH_CALLBACK_PATH}`,
          }),
        });
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          detail?: string;
          access_token?: string;
        };
        if (!res.ok) {
          const msg =
            typeof data.error === "string"
              ? [data.error, typeof data.detail === "string" ? data.detail : ""].filter(Boolean).join(" — ")
              : "Could not connect Canvas.";
          setOauthError(msg);
          return;
        }
        if (cancelled) return;
        if (typeof data.access_token !== "string") {
          setOauthError("Invalid response from server.");
          return;
        }
        setAccessToken(data.access_token);
        markCanvasConnected(true);
        router.replace("/canvas");
      } catch {
        if (!cancelled) setOauthError("Network error while connecting Canvas.");
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, setAccessToken, markCanvasConnected, router]);

  if (oauthError) {
    return <p className="mt-md text-sm text-red-400">{oauthError}</p>;
  }
  if (busy && searchParams.get("code")) {
    return <p className="mt-md text-sm text-text-secondary">Connecting to Canvas…</p>;
  }
  return null;
}
