import { cn } from "../../../lib/cn";
import { stageLabels, type TicketStage } from "../types";

const classes: Record<TicketStage, string> = {
  new: "bg-tag-freight-bg text-tag-freight-fg",
  "in-progress": "bg-tag-warning-bg text-tag-warning-fg",
  resolved: "bg-tag-healthcare-bg text-tag-healthcare-fg",
  closed: "bg-tag-standard-bg text-tag-standard-fg",
};

/** Support Department workflow stage (TC-16): New / In Progress / Resolved / Closed. */
export function StageBadge({ stage = "new" }: { stage?: TicketStage }) {
  return <span className={cn("text-badge-base whitespace-nowrap rounded-full px-2 py-0.5", classes[stage])}>{stageLabels[stage]}</span>;
}
