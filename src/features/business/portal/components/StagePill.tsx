import { cn } from "../../../../lib/cn";
import { STAGE_LABELS, stageTone, type StageTone } from "../../deliveries/display";
import type { DeliveryStage } from "../../deliveries/trackingTypes";

const TONES: Record<StageTone, string> = {
  info: "bg-info/10 text-info",
  warning: "bg-warning/10 text-warning",
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
};

const DOTS: Record<StageTone, string> = { info: "bg-info", warning: "bg-warning", success: "bg-success", danger: "bg-danger" };

/** "● In transit" pill, same stages and tones as the customer app. */
export function StagePill({ stage, className }: { stage: DeliveryStage; className?: string }) {
  const tone = stageTone(stage);
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold", TONES[tone], className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", DOTS[tone])} />
      {STAGE_LABELS[stage]}
    </span>
  );
}
