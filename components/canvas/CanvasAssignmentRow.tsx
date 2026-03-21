"use client";

import { useState } from "react";

import { buildGoogleCalendarUrlForAssignment } from "@/lib/calendar";
import type { Assignment } from "@/store/canvasStore";
import { formatDateLabel } from "@/lib/utils";

import { BodyText } from "../ui/BodyText";
import { Card } from "../ui/Card";
import { GhostButton } from "../ui/GhostButton";
import { SectionTitle } from "../ui/SectionTitle";

type PlanPayload = { plan: string; notes: string };

export function CanvasAssignmentRow({
  assignment,
  courseName,
  compact,
}: {
  assignment: Assignment;
  courseName: string;
  compact?: boolean;
}) {
  const [planOpen, setPlanOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PlanPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calUrl = buildGoogleCalendarUrlForAssignment({
    title: assignment.title,
    dueIso: assignment.dueDate,
    courseName,
  });

  async function loadPlan() {
    setPlanOpen(true);
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      const res = await fetch("/api/study-plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: assignment.title,
          dueDate: assignment.dueDate,
          courseName,
        }),
      });
      const data = (await res.json()) as { plan?: string; notes?: string; error?: string };
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Could not load plan");
        return;
      }
      setPlan({ plan: data.plan ?? "", notes: data.notes ?? "" });
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div
        className={`flex flex-wrap items-center justify-between gap-md rounded-lg border border-border/60 bg-background-tertiary/70 px-lg ${compact ? "py-sm" : "py-md"}`}
      >
        <div className="min-w-0 flex-1">
          <h4 className="font-body text-sm font-bold text-text-primary">{assignment.title}</h4>
          <BodyText className="text-xs text-text-secondary">
            {courseName} · {formatDateLabel(assignment.dueDate)}
          </BodyText>
        </div>
        <div className="flex flex-wrap gap-sm">
          <a
            href={calUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-accent-primary/65 px-md py-sm text-xs font-bold text-accent-primary transition hover:bg-accent-primary/8"
          >
            Add to Google Calendar
          </a>
          <GhostButton
            className="!px-md !py-sm !text-xs"
            title="Study plan"
            type="button"
            onClick={() => void loadPlan()}
          />
        </div>
      </div>

      {planOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-background-primary/80 p-lg sm:items-center"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPlanOpen(false);
          }}
        >
          <Card className="max-h-[85vh] w-full max-w-lg overflow-y-auto p-0">
            <div className="border-b border-border px-lg py-md">
              <SectionTitle className="mb-0 text-base">{assignment.title}</SectionTitle>
              <BodyText className="text-xs text-text-secondary">Perplexity study plan</BodyText>
            </div>
            <div className="space-y-md px-lg py-md">
              {loading ? <BodyText>Loading…</BodyText> : null}
              {error ? <BodyText className="text-red-400">{error}</BodyText> : null}
              {plan ? (
                <>
                  <div>
                    <p className="mb-sm text-xs font-semibold uppercase tracking-wide text-text-tertiary">Steps</p>
                    <pre className="whitespace-pre-wrap font-body text-sm text-text-primary">{plan.plan}</pre>
                  </div>
                  <div>
                    <p className="mb-sm text-xs font-semibold uppercase tracking-wide text-text-tertiary">Notes</p>
                    <BodyText>{plan.notes}</BodyText>
                  </div>
                </>
              ) : null}
            </div>
            <div className="border-t border-border px-lg py-md">
              <GhostButton title="Close" type="button" onClick={() => setPlanOpen(false)} />
            </div>
          </Card>
        </div>
      ) : null}
    </>
  );
}
