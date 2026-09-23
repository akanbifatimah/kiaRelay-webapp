import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Pagination } from "../../components/Pagination";
import { useToast } from "../../components/toast/ToastContext";
import { SUPPORT_TEAMS } from "./agents";
import { availabilityLabels, exportWorkloadToCsv, sortWorkload, teamWorkload, type WorkloadSortKey } from "./teamWorkload";
import type { AgentAvailability } from "./types";
import { FilterPopover } from "./components/FilterPopover";
import { TeamWorkloadTable } from "./components/TeamWorkloadTable";

const selectClasses = "rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text";

export function TeamMonitoringPage() {
  const { showToast } = useToast();
  const [availability, setAvailability] = useState<AgentAvailability | "all">("all");
  const [team, setTeam] = useState<string>("all");
  const [sortKey, setSortKey] = useState<WorkloadSortKey>("openTickets");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const sorted = useMemo(() => {
    const filtered = teamWorkload.filter(
      (agent) => (availability === "all" || agent.availability === availability) && (team === "all" || agent.team === team),
    );
    return sortWorkload(filtered, sortKey, sortDirection);
  }, [availability, team, sortKey, sortDirection]);
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const activeFilters = Number(availability !== "all") + Number(team !== "all");

  function handleSortChange(key: string) {
    setSortDirection((prev) => (sortKey === key ? (prev === "asc" ? "desc" : "asc") : "desc"));
    setSortKey(key as WorkloadSortKey);
    setPage(1);
  }

  function handleExport() {
    if (sorted.length === 0) {
      showToast("error", "No agents match the current filters — nothing to export.");
      return;
    }
    exportWorkloadToCsv(sorted);
    showToast("success", `Exported ${sorted.length} agent${sorted.length === 1 ? "" : "s"} to CSV.`);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Team Monitoring"
        subtitle="Real-time overview of agent workload and SLA adherence."
        actions={
          // TODO: "Live" is aspirational until GET /support/team/workload is
          // polled/pushed — today it's a static snapshot.
          <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            Live Data
          </span>
        }
      />
      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-text">Team Workload Distribution</h2>
          <div className="flex items-center gap-2">
            <FilterPopover
              activeCount={activeFilters}
              onClear={() => {
                setAvailability("all");
                setTeam("all");
                setPage(1);
              }}
            >
              <select
                aria-label="Status"
                value={availability}
                onChange={(event) => {
                  setAvailability(event.target.value as AgentAvailability | "all");
                  setPage(1);
                }}
                className={selectClasses}
              >
                <option value="all">Status: All</option>
                {Object.entries(availabilityLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                aria-label="Team"
                value={team}
                onChange={(event) => {
                  setTeam(event.target.value);
                  setPage(1);
                }}
                className={selectClasses}
              >
                <option value="all">Team: All</option>
                {SUPPORT_TEAMS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </FilterPopover>
            <Button variant="secondary" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        <TeamWorkloadTable rows={pageRows} sort={{ key: sortKey, direction: sortDirection }} onSortChange={handleSortChange} />
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={sorted.length}
          pageSize={pageSize}
          itemLabel="agents"
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </Card>
    </div>
  );
}
