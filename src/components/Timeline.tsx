import { Camera } from "lucide-react";
import { cn } from "../lib/cn";

export type TimelineStepStatus = "done" | "active" | "pending";

export interface TimelineStep {
  label: string;
  timestamp?: string;
  status: TimelineStepStatus;
  /** e.g. "Photo" — rendered as a bracketed, camera-iconed note (proof-of-
   * delivery/pickup evidence is the only timeline badge case so far). */
  badge?: string;
}

export function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="flex flex-col gap-4">
      {steps.map((step, index) => (
        <li key={step.label} className="relative flex gap-3 pl-0.5">
          {index < steps.length - 1 && (
            <span className="absolute left-[9px] top-5 h-full w-px bg-border" />
          )}
          <div className="flex h-5 w-5 shrink-0 items-center justify-center">
            {step.status === "done" && <span className="h-3 w-3 rounded-full bg-success" />}
            {step.status === "active" && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full border-[3px] border-primary bg-surface">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
            )}
            {step.status === "pending" && <span className="h-3 w-3 rounded-full border-2 border-border bg-surface" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className={cn("text-sm font-semibold", step.status === "pending" ? "text-text-muted" : "text-text")}>
                {step.label}
              </p>
              {step.badge && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                  <Camera className="h-3 w-3" />[{step.badge}]
                </span>
              )}
            </div>
            {step.timestamp && <p className="text-xs text-text-muted">{step.timestamp}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
