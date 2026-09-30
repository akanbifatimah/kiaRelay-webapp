import { Fragment } from "react";
import { Check } from "lucide-react";
import { cn } from "../../../lib/cn";
import { REGISTER_STEPS } from "../registerForm";

/** Account → Details → Documents: done steps show a check, the current one is orange. */
export function RegisterStepper({ step }: { step: number }) {
  return (
    <ol className="flex items-center" aria-label="Registration steps">
      {REGISTER_STEPS.map((label, i) => (
        <Fragment key={label}>
          {i > 0 && <li aria-hidden className={cn("mx-2 mb-5 h-0.5 flex-1", i <= step ? "bg-primary" : "bg-white/30")} />}
          <li className="flex flex-col items-center gap-1.5" aria-current={i === step ? "step" : undefined}>
            <span className={cn("flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold", i < step ? "bg-white text-navy-brand" : i === step ? "bg-primary text-white" : "bg-white/20 text-white")}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <span className={cn("text-[10px] font-semibold tracking-wide", i === step ? "text-primary" : "text-white")}>{label.toUpperCase()}</span>
          </li>
        </Fragment>
      ))}
    </ol>
  );
}
