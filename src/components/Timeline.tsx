import { cn } from "../lib/cn";

export type TimelineStepStatus = "done" | "active" | "pending";

export interface TimelineStep {
  label: string;
  timestamp?: string;
  status: TimelineStepStatus;
}

const dotClasses: Record<TimelineStepStatus, string> = {
  done: "bg-success",
  active: "bg-primary",
  pending: "bg-border",
};

export function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="flex flex-col gap-4">
      {steps.map((step, index) => (
        <li key={step.label} className="relative flex gap-3 pl-0.5">
          {index < steps.length - 1 && (
            <span className="absolute left-[6px] top-4 h-full w-px bg-border" />
          )}
          <span className={cn("mt-1 h-3 w-3 shrink-0 rounded-full", dotClasses[step.status])} />
          <div>
            <p className={cn("text-sm font-medium", step.status === "pending" ? "text-text-muted" : "text-text")}>
              {step.label}
            </p>
            {step.timestamp && <p className="text-xs text-text-muted">{step.timestamp}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
