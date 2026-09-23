import { cn } from "../../../lib/cn";

interface OptionToggleGroupProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}

// Segmented single-select from the Resolve Claim ("No Adjustment / Refund /
// Credit") and Escalate Claim ("Low / Medium / High / Critical") modals —
// equal-width bordered buttons, the picked one tinted primary. Meant to sit
// inside a react-hook-form Controller (rule 7), not hold state itself.
export function OptionToggleGroup<T extends string>({ options, value, onChange, ariaLabel }: OptionToggleGroupProps<T>) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
              selected ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface text-text hover:bg-bg",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
