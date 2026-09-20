import { RotateCcw, PlusCircle, type LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DataTable, type Column } from "../../../components/DataTable";
import { DropdownMenu } from "../../../components/DropdownMenu";
import { AdjustmentStatusBadge } from "./AdjustmentStatusBadge";
import type { Adjustment, AdjustmentType } from "../adjustments";

const iconByType: Record<AdjustmentType, LucideIcon> = {
  refund: RotateCcw,
  credit: PlusCircle,
};

function formatAmount(value: number): string {
  const sign = value < 0 ? "-" : "+";
  return `${sign}$${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

export function AdjustmentsTable({ rows }: { rows: Adjustment[] }) {
  const navigate = useNavigate();

  function viewDetails(row: Adjustment) {
    navigate(`/finance/refunds/${row.id.replace(/^#/, "")}`);
  }

  const columns: Column<Adjustment>[] = [
    { header: "Adjustment ID", accessor: (row) => <span className="font-medium text-text">{row.id}</span> },
    {
      header: "Type",
      accessor: (row) => {
        const Icon = iconByType[row.type];
        return (
          <span className="inline-flex items-center gap-1.5 text-text capitalize">
            <Icon className="h-3.5 w-3.5 text-text-muted" />
            {row.type}
          </span>
        );
      },
    },
    { header: "Customer", accessor: (row) => row.customer },
    {
      header: "Order/Claim",
      accessor: (row) => (
        <div>
          <p className="whitespace-nowrap text-text">{row.orderRef}</p>
          <p className="whitespace-nowrap text-xs text-text-muted">{row.reasonTag}</p>
        </div>
      ),
    },
    { header: "Original", accessor: (row) => formatCurrency(row.original) },
    {
      header: "Adjustment",
      accessor: (row) => (
        <span className={row.adjustment < 0 ? "font-medium text-danger" : "font-medium text-success"}>
          {formatAmount(row.adjustment)}
        </span>
      ),
    },
    { header: "Status", accessor: (row) => <AdjustmentStatusBadge status={row.status} /> },
    { header: "Date", accessor: (row) => <span className="whitespace-nowrap text-text-muted">{row.date}</span> },
    {
      header: "",
      align: "right",
      accessor: (row) => (
        <DropdownMenu ariaLabel={`Actions for ${row.id}`} items={[{ label: "View Details", onClick: () => viewDetails(row) }]} />
      ),
    },
  ];

  return <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} onRowClick={viewDetails} />;
}
