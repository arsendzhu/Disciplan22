import Link from "next/link";

import { NPCCharacter } from "@/components/npc/NPCCharacter";
import { BodyText } from "@/components/ui/BodyText";
import { Card } from "@/components/ui/Card";
import { GhostButton } from "@/components/ui/GhostButton";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getCanvasAuthorizationUrl } from "@/lib/canvas";

export default function ConnectCanvasPage() {
  const authUrl = getCanvasAuthorizationUrl();

  return (
    <Card className="w-full p-xxl">
      <div className="mb-xl">
        <SectionTitle>Connect your classes</SectionTitle>
        <BodyText>
          Pulse reads your Canvas workload, parses your syllabi, and turns hidden deadlines into something you can actually plan around.
        </BodyText>
      </div>

      <div className="mb-xl flex flex-col items-center gap-lg rounded-xl border border-border bg-background-tertiary/80 p-xl text-center">
        <NPCCharacter state="focused" />
        <SectionTitle className="mb-0">California State University East Bay</SectionTitle>
        <BodyText>Canvas sync, syllabus parsing, and live workload mapping all start here.</BodyText>
      </div>

      <div className="flex flex-wrap gap-md">
        {authUrl ? (
          <a
            className="inline-flex items-center justify-center rounded-lg bg-accent-primary px-xl py-md text-sm font-bold text-background-primary transition duration-200 hover:-translate-y-0.5"
            href={authUrl}
          >
            Connect Canvas
          </a>
        ) : (
          <PrimaryButton disabled title="Connect Canvas" />
        )}
        <Link
          className="inline-flex items-center justify-center rounded-lg border border-accent-primary/65 bg-transparent px-xl py-md text-sm font-bold text-accent-primary transition duration-200 hover:border-accent-primary hover:bg-accent-primary/8"
          href="/setup-profile"
        >
          Skip for now
        </Link>
      </div>
    </Card>
  );
}
