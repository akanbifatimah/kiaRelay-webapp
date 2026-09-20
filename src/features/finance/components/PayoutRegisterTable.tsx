import { useNavigate } from "react-router-dom";
import { DataTable, type Column } from "../../../components/DataTable";
import { Avatar } from "../../../components/Avatar";
import { DropdownMenu } from "../../../components/DropdownMenu";
import { PayoutRegisterStatusBadge } from "./PayoutRegisterStatusBadge";
import type { PayoutRegisterRow } from "../driverPayoutsOverview";

function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

export function PayoutRegisterTable({ rows }: { rows: PayoutRegisterRow[] }) {
  const navigate = useNavigate();

  function viewPayout(row: PayoutRegisterRow) {
    navigate(`/finance/payouts/${row.id}`);
  }

  const columns: Column<PayoutRegisterRow>[] = [
    {
      header: "Driver",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.driverName} size="sm" />
          <div>
            <p className="font-medium text-text">{row.driverName}</p>
            <p className="text-xs text-text-muted">{row.driverId}</p>
          </div>
        </div>
      ),
    },
    { header: "Deliveries", accessor: (row) => row.completedDeliveries },
    { header: "Gross", accessor: (row) => formatCurrency(row.gross) },
    { header: "Deductions", accessor: (row) => <span className="text-danger">-{formatCurrency(row.deductions)}</span> },
    { header: "Net Payout", accessor: (row) => <span className="font-medium text-text">{formatCurrency(row.net)}</span> },
    { header: "Schedule", accessor: (row) => <span className="whitespace-nowrap">{row.schedule}</span> },
    { header: "Next Payout", accessor: (row) => <span className="whitespace-nowrap">{row.nextPayoutDate}</span> },
    { header: "Status", accessor: (row) => <PayoutRegisterStatusBadge status={row.status} /> },
    {
      header: "",
      align: "right",
      accessor: (row) => (
        <DropdownMenu ariaLabel={`Actions for ${row.id}`} items={[{ label: "View Payout", onClick: () => viewPayout(row) }]} />
      ),
    },
  ];

  return <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} onRowClick={viewPayout} />;
}
