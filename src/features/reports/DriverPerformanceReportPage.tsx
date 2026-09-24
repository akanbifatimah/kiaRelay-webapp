import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Card } from "../../components/Card";
import { DataTable } from "../../components/DataTable";
import { Pagination } from "../../components/Pagination";
import { ExportMenuButton } from "../../components/ExportMenuButton";
import { vehicleTypes, type DriverStatus } from "../drivers/driverRoster";
import { ReportPageHeader } from "./components/ReportPageHeader";
import { ReportRangeTabs } from "./components/ReportRangeTabs";
import { TotalsRow } from "./components/TotalsRow";
import { LEADERBOARD_SORTERS, leaderboardColumns, leaderboardExportColumns, leaderboardExportFooter, leaderboardTotalsCells } from "./components/leaderboardColumns";
import { useTableState } from "../../hooks/useTableState";
import { DEFAULT_RANGE, rangeBounds, rangeLabel, type ReportRange } from "./reportRange";
import { driverReportRows, leaderboardTotals } from "./driverPerformanceReport";
import { REGIONS } from "./regions";

const selectClasses = "rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text";
const STATUS_LABELS: Record<DriverStatus, string> = { online: "Online", "in-transit": "In Transit", delivered: "Delivered", offline: "Offline", suspended: "Suspended" };

export function DriverPerformanceReportPage() {
  const navigate = useNavigate();
  const [range, setRange] = useState<ReportRange>(DEFAULT_RANGE);
  const [searchParams] = useSearchParams();
  // ?zone= preselects a region — the Reports hub's Regional Performance map links here.
  const [zone, setZone] = useState(() => {
    const requested = searchParams.get("zone");
    return requested && REGIONS.some((region) => region.id === requested) ? requested : "all";
  });
  const [vehicleType, setVehicleType] = useState("all");
  const [status, setStatus] = useState<DriverStatus | "all">("all");
  const [search, setSearch] = useState("");

  const allRows = useMemo(() => driverReportRows(rangeBounds(range)), [range]);
  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allRows.filter(
      (row) =>
        (zone === "all" || row.zoneId === zone) &&
        (vehicleType === "all" || row.vehicleType === vehicleType) &&
        (status === "all" || row.status === status) &&
        (!query || row.name.toLowerCase().includes(query) || row.id.toLowerCase().includes(query)),
    );
  }, [allRows, zone, vehicleType, status, search]);
  const totals = useMemo(() => leaderboardTotals(rows), [rows]);
  const table = useTableState({ rows, sorters: LEADERBOARD_SORTERS, initialSort: { key: "rank", direction: "asc" }, initialPageSize: 10 });
  const filterText = [
    rangeLabel(range),
    zone !== "all" && REGIONS.find((region) => region.id === zone)?.name,
    vehicleType !== "all" && vehicleType,
    status !== "all" && STATUS_LABELS[status],
  ].filter(Boolean).join(" · ");

  return (
    <div className="flex flex-col gap-6">
      <ReportPageHeader
        title="Driver Performance"
        statusLabel="Fleet Sync Active"
        subtitle="Comprehensive fleet metrics and efficiency scorecards across all active drivers."
      />

      <div className="flex flex-wrap items-center gap-2">
        <select aria-label="Zone" value={zone} onChange={(event) => setZone(event.target.value)} className={selectClasses}>
          <option value="all">All Zones</option>
          {REGIONS.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
        <ReportRangeTabs value={range} onChange={setRange} />
        <select aria-label="Vehicle type" value={vehicleType} onChange={(event) => setVehicleType(event.target.value)} className={selectClasses}>
          <option value="all">All Vehicle Types</option>
          {vehicleTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select aria-label="Driver status" value={status} onChange={(event) => setStatus(event.target.value as DriverStatus | "all")} className={selectClasses}>
          <option value="all">All Drivers</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <Card className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold text-text">Driver Performance Leaderboard</h2>
            <span className="rounded-full bg-bg px-2.5 py-0.5 text-xs text-text-muted">
              Showing {rows.length} of {allRows.length} drivers
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex min-w-56 flex-1 items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 lg:w-64 lg:flex-none">
              <Search className="h-4 w-4 text-text-muted" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Filter driver name, ID..."
                className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
              />
            </div>
            <ExportMenuButton
              label="Export leaderboard"
              getExport={() => ({
                title: "Driver Performance Leaderboard",
                subtitle: filterText,
                columns: leaderboardExportColumns,
                rows: table.sorted,
                footer: leaderboardExportFooter(totals),
              })}
            />
          </div>
        </div>
        {rows.length === 0 ? (
          <p className="py-10 text-center text-sm text-text-muted">No drivers match the current filters.</p>
        ) : (
          <DataTable
            columns={leaderboardColumns}
            rows={table.pageRows}
            rowKey={(row) => row.id}
            sort={table.sort}
            onSortChange={table.onSortChange}
            onRowClick={(row) => navigate(`/drivers/${row.id}`)}
            footer={<TotalsRow cells={leaderboardTotalsCells(totals)} />}
          />
        )}
        <Pagination {...table.pagination} itemLabel="drivers" />
      </Card>
    </div>
  );
}
