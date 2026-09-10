import { DataTable, type Column } from "../../../components/DataTable";
import { Avatar } from "../../../components/Avatar";
import { DropdownMenu } from "../../../components/DropdownMenu";
import { OnboardingStatusBadge } from "./OnboardingStatusBadge";
import type { DriverApplication } from "../data";

interface DriverQueueTableProps {
  rows: DriverApplication[];
  onReview: (application: DriverApplication) => void;
}

export function DriverQueueTable({ rows, onReview }: DriverQueueTableProps) {
  const columns: Column<DriverApplication>[] = [
    {
      header: "Driver",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.driverName} size="sm" />
          <span className="whitespace-nowrap font-medium text-text">{row.driverName}</span>
        </div>
      ),
    },
    {
      header: "Submitted",
      accessor: (row) => <span className="whitespace-nowrap text-text-muted">{row.submittedDate}</span>,
    },
    { header: "Status", accessor: (row) => <OnboardingStatusBadge status={row.status} /> },
    {
      header: "",
      accessor: (row) => (
        <DropdownMenu
          ariaLabel={`Actions for ${row.driverName}`}
          items={
            row.status === "pending" ? [{ label: "Review Documents", onClick: () => onReview(row) }] : []
          }
        />
      ),
      align: "right",
    },
  ];

  return <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} />;
}
