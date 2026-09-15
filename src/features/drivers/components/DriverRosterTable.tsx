import { Star, ArrowUp, ArrowDown, ChevronRight } from "lucide-react";
import { DataTable, type Column, type SortState } from "../../../components/DataTable";
import { Avatar } from "../../../components/Avatar";
import { cn } from "../../../lib/cn";
import { DriverStatusBadge } from "./DriverStatusBadge";
import type { DriverRecord } from "../driverRoster";

interface DriverRosterTableProps {
  rows: DriverRecord[];
  onRowClick: (row: DriverRecord) => void;
  sort?: SortState;
  onSortChange?: (key: string) => void;
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function DriverRosterTable({ rows, onRowClick, sort, onSortChange }: DriverRosterTableProps) {
  const columns: Column<DriverRecord>[] = [
    {
      header: "Driver Name",
      sortKey: "name",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="whitespace-nowrap font-medium text-text">{row.name}</p>
            <p className="whitespace-nowrap text-xs text-text-muted">ID: {row.id}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Vehicle",
      sortKey: "vehicle",
      accessor: (row) => (
        <div>
          <p className="whitespace-nowrap text-text">{row.vehicle}</p>
          <p className="whitespace-nowrap text-xs text-text-muted">Plate: {row.plate}</p>
        </div>
      ),
    },
    { header: "Status", sortKey: "status", accessor: (row) => <DriverStatusBadge status={row.status} /> },
    {
      header: "Rating",
      sortKey: "rating",
      accessor: (row) => (
        <span className="inline-flex items-center gap-1 whitespace-nowrap text-text">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
          {row.rating.toFixed(1)}
        </span>
      ),
    },
    {
      header: "Deliveries",
      sortKey: "deliveries",
      accessor: (row) => (
        <div>
          <p className="whitespace-nowrap font-medium text-text">{row.deliveries.toLocaleString()}</p>
          <p className="whitespace-nowrap text-xs text-success">{row.onTimeRate}% On-Time</p>
        </div>
      ),
    },
    {
      header: "Earnings (to Date)",
      sortKey: "earnings",
      accessor: (row) => (
        <div>
          <p className="whitespace-nowrap font-medium text-text">{formatCurrency(row.earnings)}</p>
          {row.earningsDeltaPct !== 0 && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-xs font-medium",
                row.earningsDeltaPct > 0 ? "text-success" : "text-danger",
              )}
            >
              {row.earningsDeltaPct > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {Math.abs(row.earningsDeltaPct)}%
            </span>
          )}
        </div>
      ),
    },
    {
      header: "",
      accessor: () => <ChevronRight className="h-4 w-4 text-text-muted" />,
      align: "right",
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      rowKey={(row) => row.id}
      onRowClick={onRowClick}
      sort={sort}
      onSortChange={onSortChange}
    />
  );
}
