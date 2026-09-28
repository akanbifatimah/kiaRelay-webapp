import { cn } from "../../../lib/cn";
import { PAYOUT_OPTIONS, type PayoutFrequency } from "../../settings/payoutOptions";

export type { PayoutFrequency } from "../../settings/payoutOptions";

interface PayoutFrequencyOptionProps {
  value: PayoutFrequency;
  onChange: (value: PayoutFrequency) => void;
  /** Options Finance Settings offers to drivers (TC-08); others are hidden. */
  available: PayoutFrequency[];
}

// Radio-card selector — same visual family as DriverSelectList's selectable
// rows (dispatch). Choices come from the shared payout catalog, filtered to
// what Finance Settings currently offers.
export function PayoutFrequencyOption({ value, onChange, available }: PayoutFrequencyOptionProps) {
  const choices = PAYOUT_OPTIONS.filter((option) => available.includes(option.value));
  return (
    <div className="flex flex-col gap-2">
      <span className="text-label text-text-muted">Payout Frequency</span>
      {choices.map((choice) => (
        <label
          key={choice.value}
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-lg border border-l-4 p-3 transition-colors",
            value === choice.value ? "border-border border-l-primary bg-primary/5" : "border-border border-l-border hover:bg-bg",
          )}
        >
          <input
            type="radio"
            name="payout-frequency"
            checked={value === choice.value}
            onChange={() => onChange(choice.value)}
            className="mt-0.5 h-4 w-4 accent-primary"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text">{choice.label}</span>
              {choice.popular && <span className="text-badge rounded-full bg-tag-express-bg px-2 py-0.5 text-tag-express-fg">Popular</span>}
            </div>
            <p className="text-xs text-text-muted">{choice.description}</p>
          </div>
        </label>
      ))}
      <p className="text-xs text-text-muted">Options are set in Finance Settings → Driver Payout Settings.</p>
    </div>
  );
}
