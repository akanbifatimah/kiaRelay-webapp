import { useState } from "react";
import { Calendar } from "lucide-react";
import { cn } from "../../../lib/cn";
import { CustomDateRangePicker } from "../../../components/CustomDateRangePicker";
import { REPORT_RANGE_PRESETS, type ReportRange } from "../reportRange";

interface ReportRangeTabsProps {
  value: ReportRange;
  onChange: (range: ReportRange) => void;
}

// Today/7D/30D/90D/YTD/Custom, shared by every report screen. Active state is
// solid navy per the report designs (Finance/Dashboard tabs use orange — a
// deliberately different control, same reason FinanceDateRangeTabs exists).
export function ReportRangeTabs({ value, onChange }: ReportRangeTabsProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const tabClasses = (active: boolean) =>
    cn(
      "flex items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
      active ? "bg-sidebar text-white" : "text-text-muted hover:text-text",
    );

  return (
    <div className="relative flex w-fit flex-wrap items-center gap-0.5 rounded-lg border border-border bg-bg p-1">
      {REPORT_RANGE_PRESETS.map((preset) => (
        <button key={preset.key} type="button" onClick={() => onChange({ ...value, key: preset.key })} className={tabClasses(value.key === preset.key)}>
          {preset.label}
        </button>
      ))}
      <button type="button" onClick={() => setIsPickerOpen((open) => !open)} className={tabClasses(value.key === "custom")}>
        <Calendar className="h-3.5 w-3.5" />
        Custom
      </button>
      {isPickerOpen && (
        <CustomDateRangePicker
          initial={value.custom}
          onApply={(custom) => {
            onChange({ key: "custom", custom });
            setIsPickerOpen(false);
          }}
          onCancel={() => setIsPickerOpen(false)}
        />
      )}
    </div>
  );
}
