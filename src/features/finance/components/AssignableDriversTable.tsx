import { DataTable, type Column } from "../../../components/DataTable";
import { Avatar } from "../../../components/Avatar";
import { DropdownMenu } from "../../../components/DropdownMenu";
import { useToast } from "../../../components/toast/ToastContext";
import { PayoutScheduleTypeBadge } from "./PayoutScheduleTypeBadge";
import type { AssignableDriver } from "../scheduleAssignableDrivers";

interface AssignableDriversTableProps {
  rows: AssignableDriver[];
  selected: Set<string>;
  onToggleRow: (id: string) => void;
}

export function AssignableDriversTable({ rows, selected, onToggleRow }: AssignableDriversTableProps) {
  const { showToast } = useToast();

  const columns: Column<AssignableDriver>[] = [
    {
      header: "",
      accessor: (row) => (
        <input
          type="checkbox"
          checked={selected.has(row.id)}
          onChange={() => onToggleRow(row.id)}
          onClick={(e) => e.stopPropagation()}
          className="h-4 w-4 accent-primary"
        />
      ),
    },
    {
      header: "Drivers",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="whitespace-nowrap font-medium text-text">{row.name}</p>
            <p className="whitespace-nowrap text-xs text-text-muted">{row.classLabel}</p>
          </div>
        </div>
      ),
    },
    { header: "Driver ID", accessor: (row) => <span className="whitespace-nowrap">{row.driverIdLabel}</span> },
    { header: "Fleet", accessor: (row) => <span className="whitespace-nowrap">{row.fleet}</span> },
    { header: "Current Schedule", accessor: (row) => <PayoutScheduleTypeBadge scheduleId={row.currentScheduleId} /> },
    { header: "Joined Date", accessor: (row) => <span className="whitespace-nowrap">{row.joinedDate}</span> },
    {
      header: "Action",
      align: "right",
      accessor: (row) => (
        <DropdownMenu
          ariaLabel={`Actions for ${row.name}`}
          items={[
            {
              label: "View Driver Profile",
              onClick: () => showToast("error", "TODO: no shared id space between this directory and the driver roster yet."),
            },
          ]}
        />
      ),
    },
  ];

  return <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} />;
}
