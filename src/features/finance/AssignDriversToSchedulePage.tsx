import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Pagination } from "../../components/Pagination";
import { AssignableDriversFilterBar } from "./components/AssignableDriversFilterBar";
import { AssignableDriversTable } from "./components/AssignableDriversTable";
import { AssignmentSuccessModal } from "./components/AssignmentSuccessModal";
import { payoutSchedules } from "./payoutSchedules";
import {
  assignableDrivers as initialDrivers,
  filterAssignableDrivers,
  type AssignableDriver,
  type AssignableDriverFilters,
} from "./scheduleAssignableDrivers";

const PAGE_SIZE = 10;
const DEFAULT_FILTERS: AssignableDriverFilters = { search: "", fleet: "all", region: "all", scheduleId: "all" };

export function AssignDriversToSchedulePage() {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<AssignableDriver[]>(initialDrivers);
  const [filters, setFilters] = useState<AssignableDriverFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [successInfo, setSuccessInfo] = useState<{ count: number; fromScheduleName: string; toScheduleName: string } | null>(null);

  const filtered = useMemo(() => filterAssignableDrivers(drivers, filters), [drivers, filters]);

  const foundSchedule = payoutSchedules.find((s) => s.id === scheduleId);
  if (!foundSchedule) return <Navigate to="/finance/payout-schedules" replace />;
  const schedule = foundSchedule;

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function moveSelected() {
    const selectedDrivers = drivers.filter((d) => selected.has(d.id));
    const counts = new Map<string, number>();
    selectedDrivers.forEach((d) => counts.set(d.currentScheduleId, (counts.get(d.currentScheduleId) ?? 0) + 1));
    const topSourceId = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
    const fromScheduleName = payoutSchedules.find((s) => s.id === topSourceId)?.name ?? "their previous schedule";

    setDrivers((prev) => prev.map((d) => (selected.has(d.id) ? { ...d, currentScheduleId: schedule.id } : d)));
    setSuccessInfo({ count: selected.size, fromScheduleName, toScheduleName: schedule.name });
    setSelected(new Set());
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/finance/payout-schedules" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Payout Schedules
      </Link>

      <div>
        <h1 className="text-heading-1 text-text">Assign Drivers to Schedule</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-text-muted">
          <span className="text-badge rounded-full bg-tag-warning-bg px-2.5 py-0.5 text-tag-warning-fg">
            Currently Managing: {schedule.name}
          </span>
          <span>Schedule ID: {schedule.id}</span>
        </div>
      </div>

      <AssignableDriversFilterBar
        filters={filters}
        onChange={(next) => {
          setFilters(next);
          setPage(1);
        }}
      />

      <Card className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-text">Driver Directory</h3>
          <span className="text-badge rounded-full bg-bg px-2 py-0.5 text-text-muted">{filtered.length.toLocaleString()} Total</span>
        </div>

        {selected.size > 0 && (
          <div className="flex items-center justify-between gap-3 rounded-lg bg-tag-warning-bg px-3 py-2">
            <span className="text-sm font-medium text-tag-warning-fg">{selected.size} driver{selected.size === 1 ? "" : "s"} selected</span>
            <Button type="button" size="sm" onClick={moveSelected}>
              Move to {schedule.name}
            </Button>
          </div>
        )}

        <AssignableDriversTable rows={pageRows} selected={selected} onToggleRow={toggleRow} />
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={filtered.length}
          pageSize={pageSize}
          itemLabel="drivers"
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </Card>

      {successInfo && (
        <AssignmentSuccessModal
          count={successInfo.count}
          fromScheduleName={successInfo.fromScheduleName}
          toScheduleName={successInfo.toScheduleName}
          onReturn={() => navigate("/finance/payout-schedules")}
        />
      )}
    </div>
  );
}
