import { cn } from "../../../lib/cn";

export type SuspensionDuration = "temporary" | "permanent";

const OPTIONS: SuspensionDuration[] = ["temporary", "permanent"];

interface SuspensionDurationToggleProps {
  value: SuspensionDuration;
  onChange: (value: SuspensionDuration) => void;
}

export function SuspensionDurationToggle({ value, onChange }: SuspensionDurationToggleProps) {
  return (
    <div className="flex flex-col gap-1.5 text-sm">
      <span className="text-text-muted">Duration</span>
      <div className="flex gap-2">
        {OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize",
              value === option
                ? "border-sidebar bg-sidebar text-white"
                : "border-border bg-surface text-text hover:bg-bg",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
