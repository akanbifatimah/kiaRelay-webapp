import { useState } from "react";
import { Calendar } from "lucide-react";
import { cn } from "../../../lib/cn";
import { CustomDateRangePicker } from "./CustomDateRangePicker";
import type { CustomRange, DateRangeKey } from "../data";

const presets: { key: Exclude<DateRangeKey, "custom">; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7D" },
  { key: "30d", label: "30D" },
];

interface DateRangeTabsProps {
  value: DateRangeKey;
  customRange: CustomRange;
  onSelectPreset: (key: Exclude<DateRangeKey, "custom">) => void;
  onApplyCustom: (range: CustomRange) => void;
}

export function DateRangeTabs({ value, customRange, onSelectPreset, onApplyCustom }: DateRangeTabsProps) {
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
        Custom
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
