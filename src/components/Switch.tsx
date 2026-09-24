import { cn } from "../lib/cn";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Accessible name — required since the switch itself has no text. */
  label: string;
  disabled?: boolean;
  /** "dark" = the navy "on" state used by Operations Settings' design. */
  tone?: "primary" | "dark";
}

// Presentational toggle, split out of SwitchField (2026-09-23) once the Team
// Members table and Settings rows needed the same control outside a
// label-right layout. Form usage still goes through a Controller (rule 7).
export function Switch({ checked, onChange, label, disabled, tone = "primary" }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation();
        onChange(!checked);
      }}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        checked ? (tone === "dark" ? "bg-sidebar" : "bg-primary") : "bg-border",
      )}
    >
      <span className={cn("inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform", checked ? "translate-x-4" : "translate-x-1")} />
    </button>
  );
}
