import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, Search } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { DataTable, type Column } from "../../components/DataTable";
import { Pagination } from "../../components/Pagination";
import { useToast } from "../../components/toast/ToastContext";
import { cn } from "../../lib/cn";
import { getDriverSupportProfile } from "./driverSupport";
import {
  exportIncidentsToCsv,
  formatIncidentDate,
  incidentStatusLabels,
  incidentTypeLabels,
  type DriverIncident,
  type IncidentStatus,
  type IncidentType,
} from "./driverIncidents";
import { SupportNotFound } from "./components/SupportNotFound";

const statusClasses: Record<IncidentStatus, string> = {
  open: "bg-tag-warning-bg text-tag-warning-fg",
  resolved: "bg-tag-standard-bg text-tag-standard-fg",
  info: "bg-tag-info-bg text-tag-info-fg",
};

const columns: Column<DriverIncident>[] = [
  { header: "ID", accessor: (row) => <span className="whitespace-nowrap font-medium">{row.id}</span> },
  { header: "Date", sortKey: "date", accessor: (row) => <span className="whitespace-nowrap text-text-muted">{formatIncidentDate(row.daysAgo)}</span> },
  { header: "Type", accessor: (row) => incidentTypeLabels[row.type] },
  {
    header: "Incident",
    accessor: (row) => (
      <div className="max-w-md whitespace-normal">
        <p className="font-semibold text-text">{row.title}</p>
        <p className="text-xs text-text-muted">{row.description}</p>
      </div>
    ),
  },
  { header: "Reported By", accessor: (row) => <span className="whitespace-nowrap">{row.reportedBy}</span> },
  { header: "Status", accessor: (row) => <span className={cn("text-badge rounded-full px-2 py-0.5", statusClasses[row.status])}>{incidentStatusLabels[row.status]}</span> },
];

const selectClasses = "rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text";

// "View Full Log" from the Driver Support View's Incident History — no
// design was shared for it, so it follows the house table pattern
// (filters above a Card'd DataTable + Pagination + CSV export).
export function DriverIncidentLogPage() {
  const { driverId = "" } = useParams();
  const { showToast } = useToast();
  const profile = useMemo(() => getDriverSupportProfile(driverId), [driverId]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<IncidentType | "all">("all");
  const [status, setStatus] = useState<IncidentStatus | "all">("all");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = (profile?.incidents ?? []).filter(
      (incident) =>
        (type === "all" || incident.type === type) &&
        (status === "all" || incident.status === status) &&
        (!query || `${incident.title} ${incident.description} ${incident.id}`.toLowerCase().includes(query)),
    );
    // "desc" = newest first, i.e. smallest daysAgo first.
    return [...filtered].sort((a, b) => (direction === "desc" ? a.daysAgo - b.daysAgo : b.daysAgo - a.daysAgo));
  }, [profile, search, type, status, direction]);

  if (!profile) return <SupportNotFound what="driver" id={driverId} />;

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const reset = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-6">
      <Link to={`/support/drivers/${driverId}`} className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to {profile.detail.name}
      </Link>
      <PageHeader title="Incident Log" subtitle={`Every safety, equipment, compliance and delivery event on ${profile.detail.name}'s record.`} />
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-56 flex-1 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
          <Search className="h-4 w-4 text-text-muted" />
          <input
            value={search}
            onChange={(event) => reset(setSearch)(event.target.value)}
            placeholder="Search incidents"
            className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
          />
        </div>
        <select aria-label="Type" value={type} onChange={(event) => reset(setType)(event.target.value as IncidentType | "all")} className={selectClasses}>
          <option value="all">Type: All</option>
          {Object.entries(incidentTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select aria-label="Status" value={status} onChange={(event) => reset(setStatus)(event.target.value as IncidentStatus | "all")} className={selectClasses}>
          <option value="all">Status: All</option>
          {Object.entries(incidentStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <Button
          variant="secondary"
          onClick={() => {
            if (rows.length === 0) return showToast("error", "No incidents match the current filters — nothing to export.");
            exportIncidentsToCsv(profile.detail.name, rows);
            showToast("success", `Exported ${rows.length} incident${rows.length === 1 ? "" : "s"} to CSV.`);
          }}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
      <Card className="flex flex-col gap-4">
        {rows.length === 0 ? (
          <p className="py-10 text-center text-sm text-text-muted">No incidents match the current filters.</p>
        ) : (
          <DataTable
            columns={columns}
            rows={rows.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
            rowKey={(row) => row.id}
            sort={{ key: "date", direction }}
            onSortChange={() => setDirection((prev) => (prev === "desc" ? "asc" : "desc"))}
          />
        )}
        <Pagination page={currentPage} pageCount={pageCount} total={rows.length} pageSize={pageSize} itemLabel="incidents" onPageChange={setPage} onPageSizeChange={reset(setPageSize)} />
      </Card>
    </div>
  );
}
