"use client";

import Link from "next/link";

import { CanvasAssignmentRow } from "@/components/canvas/CanvasAssignmentRow";
import { BodyText } from "@/components/ui/BodyText";
import { Card } from "@/components/ui/Card";
import { GhostButton } from "@/components/ui/GhostButton";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useCanvasData } from "@/hooks/useCanvasData";
import { useCanvasStore } from "@/store/canvasStore";
import { useUserStore } from "@/store/userStore";

export default function CanvasPage() {
  const { assignments, courses, accessToken, syncStatus, syncError, sync, hydrated } = useCanvasData();
  const clearCanvas = useCanvasStore((s) => s.clearCanvas);
  const markCanvasConnected = useUserStore((s) => s.markCanvasConnected);

  const nameFor = (courseId: string) => courses.find((c) => c.id === courseId)?.name ?? "Course";

  if (!hydrated) {
    return (
      <div className="space-y-xl pb-[88px] lg:pb-0">
        <BodyText>Loading…</BodyText>
      </div>
    );
  }

  return (
    <div className="space-y-xl pb-[88px] lg:pb-0">
      <div className="flex flex-wrap items-end justify-between gap-lg">
        <div>
          <SectionTitle>Canvas</SectionTitle>
          <BodyText>
            Upcoming assignments, add to Google Calendar, and a Perplexity study plan. Synced deadlines also appear in the Today calendar.
          </BodyText>
        </div>
        <div className="flex flex-wrap items-center gap-sm">
          <GhostButton
            title={syncStatus === "loading" ? "Syncing…" : "Sync"}
            disabled={syncStatus === "loading"}
            onClick={() => void sync()}
          />
          {accessToken ? (
            <button
              type="button"
              className="text-xs font-semibold text-text-secondary underline-offset-2 hover:underline"
              onClick={() => {
                clearCanvas();
                markCanvasConnected(false);
              }}
            >
              Disconnect OAuth
            </button>
          ) : (
            <Link
              href="/connect-canvas"
              className="text-xs font-semibold text-accent-primary underline-offset-2 hover:underline"
            >
              OAuth (optional)
            </Link>
          )}
        </div>
      </div>

      <Card>
        <BodyText className="text-sm text-text-secondary">
          Server auth: set <code className="text-text-primary">CANVAS_COOKIE</code> and{" "}
          <code className="text-text-primary">CANVAS_CSRF</code> in <code className="text-text-primary">.env</code>, or
          use OAuth. Set <code className="text-text-primary">PERPLEXITY_API_KEY</code> for study plans.
        </BodyText>
      </Card>

      {syncError ? (
        <Card>
          <BodyText className="text-red-400">{syncError}</BodyText>
          <GhostButton className="mt-md" title="Retry" onClick={() => void sync()} />
        </Card>
      ) : null}

      <Card>
        <SectionTitle>Upcoming assignments</SectionTitle>
        {syncStatus === "loading" && assignments.length === 0 ? (
          <BodyText className="mt-md text-sm text-text-secondary">Fetching from Canvas…</BodyText>
        ) : assignments.length === 0 ? (
          <BodyText className="mt-md text-sm text-text-secondary">
            No upcoming dated assignments. Sync again after fixing auth in .env.
          </BodyText>
        ) : (
          <div className="mt-md space-y-sm">
            {assignments.map((a) => (
              <CanvasAssignmentRow key={a.id} assignment={a} courseName={nameFor(a.courseId)} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
