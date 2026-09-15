import { cn } from "../../../lib/cn";

export type PayoutFrequency = "weekly" | "bi-weekly" | "on-demand";

interface FrequencyChoice {
  value: PayoutFrequency;
  label: string;
  description: string;
  popular?: boolean;
}

const choices: FrequencyChoice[] = [
  { value: "weekly", label: "Weekly", description: "Payouts processed every Monday", popular: true },
  { value: "bi-weekly", label: "Bi-Weekly", description: "Payouts processed every 1st and 15th of month" },
  { value: "on-demand", label: "On-Demand", description: "Payouts triggered manually by the driver or admin. Fees may apply" },
];

interface PayoutFrequencyOptionProps {
  value: PayoutFrequency;
  onChange: (value: PayoutFrequency) => void;
}

// Radio-card selector — same visual family as DriverSelectList's selectable
// rows (dispatch), adapted for this modal's 3 named frequency options.
export function PayoutFrequencyOption({ value, onChange }: PayoutFrequencyOptionProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-label text-text-muted">Payout Frequency</span>
      {choices.map((choice) => (
        <label
          key={choice.value}
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-lg border border-l-4 p-3 transition-colors",
            value === choice.value
              ? "border-border border-l-primary bg-primary/5"
              : "border-border border-l-border hover:bg-bg",
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
              {choice.popular && (
                <span className="text-badge rounded-full bg-tag-express-bg px-2 py-0.5 text-tag-express-fg">
                  Popular
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted">{choice.description}</p>
          </div>
        </label>
      ))}
    </div>
  );
}
