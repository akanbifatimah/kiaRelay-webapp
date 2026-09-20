import { useMemo, useState } from "react";
import { Search, Download } from "lucide-react";
import { Card } from "../../../components/Card";
import { Pagination } from "../../../components/Pagination";
import { useToast } from "../../../components/toast/ToastContext";
import { DriverOverridesTable } from "./DriverOverridesTable";
import { AddScheduleOverrideModal } from "./AddScheduleOverrideModal";
import {
  payoutSchedules,
  filterDriverOverrides,
  exportDriverOverridesToCsv,
  type DriverOverride,
  type DriverOverrideFilters,
} from "../payoutSchedules";

const PAGE_SIZE = 10;
const DEFAULT_FILTERS: DriverOverrideFilters = { search: "", scheduleId: "all" };

interface DriverOverridesSectionProps {
  overrides: DriverOverride[];
  onUpdateOverride: (override: DriverOverride) => void;
}

export function DriverOverridesSection({ overrides, onUpdateOverride }: DriverOverridesSectionProps) {
  const { showToast } = useToast();
  const [filters, setFilters] = useState<DriverOverrideFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [editing, setEditing] = useState<DriverOverride | null>(null);

  const filtered = useMemo(() => filterDriverOverrides(overrides, filters), [overrides, filters]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-text">Driver-specific Overrides</h3>
          <p className="text-xs text-text-muted">Individual contractor settings that bypass the global default.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
            <Search className="h-4 w-4 text-text-muted" />
            <input
              type="search"
              value={filters.search}
              onChange={(event) => {
                setFilters({ ...filters, search: event.target.value });
                setPage(1);
              }}
              placeholder="Driver, fleet, or ID…"
              className="w-full min-w-0 bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
            />
          </div>
          <select
            value={filters.scheduleId}
            onChange={(event) => {
              setFilters({ ...filters, scheduleId: event.target.value });
              setPage(1);
            }}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
          >
            <option value="all">All Schedules</option>
            {payoutSchedules.map((schedule) => (
              <option key={schedule.id} value={schedule.id}>
                {schedule.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              if (filtered.length === 0) {
                showToast("error", "No overrides match the current filters — nothing to export.");
                return;
              }
              exportDriverOverridesToCsv(filtered);
              showToast("success", `Exported ${filtered.length} override${filtered.length === 1 ? "" : "s"} to CSV.`);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-text-muted hover:bg-bg hover:text-text"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      <DriverOverridesTable rows={pageRows} onEdit={setEditing} />
      <Pagination
        page={currentPage}
        pageCount={pageCount}
        total={filtered.length}
        pageSize={pageSize}
        itemLabel="overrides"
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />

      {editing && (
        <AddScheduleOverrideModal
          override={editing}
          onClose={() => setEditing(null)}
          onSubmit={(override) => {
            onUpdateOverride(override);
            showToast("success", `Schedule override updated for ${override.subjectName}.`);
          }}
        />
      )}
    </Card>
  );
}
