import { Check, X } from "lucide-react";
import { cn } from "../lib/cn";
import { PASSWORD_CHECKS } from "../lib/passwordRules";

/** Live pass/fail list of the password strength rules for `value`. */
export function PasswordChecklist({ value }: { value: string }) {
  return (
    <ul className="grid gap-1 text-xs sm:grid-cols-2">
      {PASSWORD_CHECKS.map((check) => {
        const passed = check.test(value);
        return (
          <li key={check.label} className={cn("flex items-center gap-1.5", passed ? "text-success" : "text-text-muted")}>
            {passed ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
            {check.label}
          </li>
        );
      })}
    </ul>
  );
}
