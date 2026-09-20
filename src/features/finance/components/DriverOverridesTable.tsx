import { DataTable, type Column } from "../../../components/DataTable";
import { DropdownMenu } from "../../../components/DropdownMenu";
import { PayoutScheduleTypeBadge } from "./PayoutScheduleTypeBadge";
import type { DriverOverride } from "../payoutSchedules";

interface DriverOverridesTableProps {
  rows: DriverOverride[];
  onEdit: (row: DriverOverride) => void;
}

export function DriverOverridesTable({ rows, onEdit }: DriverOverridesTableProps) {
  const columns: Column<DriverOverride>[] = [
    {
      header: "Driver / Fleet",
      accessor: (row) => (
        <div>
          <p className="font-medium text-text">{row.subjectName}</p>
          <p className="text-xs text-text-muted">{row.subjectIdLabel}</p>
        </div>
      ),
    },
    { header: "Current Schedule", accessor: (row) => <PayoutScheduleTypeBadge scheduleId={row.currentScheduleId} /> },
    { header: "Effective Since", accessor: (row) => <span className="whitespace-nowrap">{row.effectiveSince}</span> },
    { header: "Next Payout", accessor: (row) => <span className="whitespace-nowrap">{row.nextPayoutLabel}</span> },
    {
      header: "Actions",
      align: "right",
      accessor: (row) => (
        <DropdownMenu ariaLabel={`Actions for ${row.subjectName}`} items={[{ label: "Edit Override", onClick: () => onEdit(row) }]} />
      ),
    },
  ];

  return <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} />;
}
