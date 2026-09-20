import { cn } from "../../../lib/cn";
import type { PayoutStep } from "../payoutDetail";

// Horizontal stepper — no existing precedent in this app (Timeline in
// src/components is vertical-only, used elsewhere as-is). Same done/active/
// pending color language as Timeline (success/primary/muted) for visual
// consistency even though the layout is new; kept local to finance/ until a
// second feature needs a horizontal stepper (same promotion-on-second-use
// discipline as CurrentPositionMarker/CustomDateRangePicker).
export function PayoutTimelineStepper({ steps }: { steps: PayoutStep[] }) {
  return (
    <ol className="flex items-start">
      {steps.map((step, index) => (
        <li key={step.key} className="flex flex-1 flex-col items-center text-center last:flex-none">
          <div className="flex w-full items-center">
            {index > 0 && (
              <span
                className={cn("h-0.5 flex-1", steps[index - 1].state === "done" ? "bg-success" : "bg-border")}
              />
            )}
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                step.state === "done" && "bg-success",
                step.state === "active" && "border-[3px] border-primary bg-surface",
                step.state === "pending" && "border-2 border-border bg-surface",
                index === 0 && "ml-0",
              )}
            >
              {step.state === "done" && <span className="h-2 w-2 rounded-full bg-white" />}
              {step.state === "active" && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
            </span>
            {index < steps.length - 1 && (
              <span className={cn("h-0.5 flex-1", step.state === "done" ? "bg-success" : "bg-border")} />
            )}
          </div>
          <p className={cn("mt-2 max-w-[6.5rem] text-xs font-medium", step.state === "pending" ? "text-text-muted" : "text-text")}>
            {step.label}
          </p>
        </li>
      ))}
    </ol>
  );
}
