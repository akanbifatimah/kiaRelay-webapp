import { ExportMenuButton } from "../../../components/ExportMenuButton";
import type { TableExport } from "../../../lib/exportTable";

export interface ChartFilter {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

interface ChartToolbarProps<T> {
  filters?: ChartFilter[];
  /** Built on click from the chart's *currently filtered* data points. */
  getExport: () => TableExport<T>;
  exportLabel: string;
}

const selectClasses = "rounded-md border border-border bg-surface px-2 py-1 text-xs text-text";

// Per-chart controls (TC-10, 2026-09-28): every chart on Reports gets its
// own filters and a CSV/PDF export of exactly the points it's showing, not
// just the page-level range. The page range still sets the outer window
// where a page has one.
export function ChartToolbar<T>({ filters = [], getExport, exportLabel }: ChartToolbarProps<T>) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <select key={filter.label} aria-label={filter.label} value={filter.value} onChange={(event) => filter.onChange(event.target.value)} className={selectClasses}>
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
      <ExportMenuButton label={exportLabel} getExport={getExport} />
    </div>
  );
}
