import { useState } from "react";
import { Calendar } from "lucide-react";
import { cn } from "../../../lib/cn";
import { CustomDateRangePicker } from "../../../components/CustomDateRangePicker";
import type { CustomRange, FinanceRangeKey } from "../data";

const presets: { key: FinanceRangeKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "quarter", label: "This Quarter" },
];

interface FinanceDateRangeTabsProps {
  value: FinanceRangeKey | "custom";
  customRange: CustomRange;
  onSelectPreset: (key: FinanceRangeKey) => void;
  onApplyCustom: (range: CustomRange) => void;
}

// Same pill-segmented-control visual language as dashboard's DateRangeTabs,
// but its own component — this screen's 5 presets (Today/This Week/This
// Month/This Quarter/Custom Range) don't match Dashboard's (Today/7D/30D).
export function FinanceDateRangeTabs({ value, customRange, onSelectPreset, onApplyCustom }: FinanceDateRangeTabsProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <div className="relative flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
      {presets.map((preset) => (
        <button
          key={preset.key}
          type="button"
          onClick={() => onSelectPreset(preset.key)}
          className={cn(
            "rounded-md px-3 py-1 text-xs font-medium transition-colors",
            value === preset.key ? "bg-primary text-primary-foreground" : "text-text-muted hover:text-text",
          )}
        >
          {preset.label}
        </button>
      ))}
      <button
        type="button"
        onClick={() => setIsPickerOpen((open) => !open)}
        className={cn(
          "flex items-center gap-1 rounded-md px-3 py-1 text-xs font-medium transition-colors",
          value === "custom" ? "bg-primary text-primary-foreground" : "text-text-muted hover:text-text",
        )}
      >
        <Calendar className="h-3.5 w-3.5" />
        Custom Range
      </button>
      {isPickerOpen && (
        <CustomDateRangePicker
          initial={customRange}
          onApply={(range) => {
            onApplyCustom(range);
            setIsPickerOpen(false);
          }}
          onCancel={() => setIsPickerOpen(false)}
        />
      )}
    </div>
  );
}
