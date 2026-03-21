import { npcStateCopy, NPCState } from "@/lib/npcState";

import { BodyText } from "../ui/BodyText";
import { Chip } from "../ui/Chip";

export function NPCMoodBadge({ state }: { state: NPCState }) {
  return (
    <div className="flex flex-wrap items-center gap-md">
      <Chip label={npcStateCopy[state].label} />
      <BodyText className="max-w-2xl text-text-primary">{npcStateCopy[state].description}</BodyText>
    </div>
  );
}
