import { Card } from "../../../components/Card";
import { revenueFilterOptions } from "../revenueDetail";

interface RevenueFilterBarProps {
  dateRange: string;
  onDateRangeChange: (value: string) => void;
  segment: string;
  onSegmentChange: (value: string) => void;
  deliveryType: string;
  onDeliveryTypeChange: (value: string) => void;
  region: string;
  onRegionChange: (value: string) => void;
  vertical: string;
  onVerticalChange: (value: string) => void;
}

const selectClass = "rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text";

// TODO: visual-only for now (mirrors CustomersFilterBar's Date Range/Sort
// precedent) — Revenue Details table below isn't wired to these yet.
export function RevenueFilterBar({
  dateRange,
  onDateRangeChange,
  segment,
  onSegmentChange,
  deliveryType,
  onDeliveryTypeChange,
  region,
  onRegionChange,
  vertical,
  onVerticalChange,
}: RevenueFilterBarProps) {
  return (
    <Card className="flex flex-wrap items-center gap-2">
      <select value={dateRange} onChange={(e) => onDateRangeChange(e.target.value)} className={selectClass}>
        {revenueFilterOptions.dateRanges.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <select value={segment} onChange={(e) => onSegmentChange(e.target.value)} className={selectClass}>
        {revenueFilterOptions.segments.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <select value={deliveryType} onChange={(e) => onDeliveryTypeChange(e.target.value)} className={selectClass}>
        {revenueFilterOptions.deliveryTypes.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <select value={region} onChange={(e) => onRegionChange(e.target.value)} className={selectClass}>
        {revenueFilterOptions.regions.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <select value={vertical} onChange={(e) => onVerticalChange(e.target.value)} className={selectClass}>
        {revenueFilterOptions.verticals.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </Card>
  );
}
