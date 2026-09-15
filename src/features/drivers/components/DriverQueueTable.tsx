import { DataTable, type Column } from "../../../components/DataTable";
import { Avatar } from "../../../components/Avatar";
import { Button } from "../../../components/Button";
import { ProgressBar } from "../../../components/ProgressBar";
import { OnboardingStatusBadge } from "./OnboardingStatusBadge";
import { daysAgoLabel, type DriverApplication } from "../data";

interface DriverQueueTableProps {
  rows: DriverApplication[];
  onReview: (application: DriverApplication) => void;
}

export function DriverQueueTable({ rows, onReview }: DriverQueueTableProps) {
  const columns: Column<DriverApplication>[] = [
    {
      header: "Applicant",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.driverName} size="sm" />
          <div>
            <p className="whitespace-nowrap font-medium text-text">{row.driverName}</p>
            <p className="whitespace-nowrap text-xs text-text-muted">ID: {row.idNumber}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Applied",
      accessor: (row) => (
        <div>
          <p className="whitespace-nowrap text-text">{row.submittedDate}</p>
          <p className="whitespace-nowrap text-xs text-text-muted">{daysAgoLabel(row.appliedDaysAgo)}</p>
        </div>
      ),
    },
    {
      header: "Documents",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <ProgressBar value={row.documentsComplete} max={row.documentsTotal} />
          <span className="whitespace-nowrap text-xs text-text-muted">
            {row.documentsComplete}/{row.documentsTotal}
          </span>
        </div>
      ),
    },
    { header: "Status", accessor: (row) => <OnboardingStatusBadge status={row.status} /> },
    {
      header: "Actions",
      accessor: (row) =>
        row.status === "pending" ? (
          <Button size="sm" onClick={() => onReview(row)}>
            Review
          </Button>
        ) : null,
      align: "right",
    },
  ];

  return <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} />;
}
