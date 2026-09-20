import { CreditCard, FileText, Truck, RotateCcw, Eye, type LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DataTable, type Column } from "../../../components/DataTable";
import { Tooltip } from "../../../components/Tooltip";
import { FinanceTransactionStatusBadge } from "./FinanceTransactionStatusBadge";
import { signedAmount, type FinanceTransaction, type FinanceTransactionType } from "../financeTransactions";

const iconByType: Record<FinanceTransactionType, LucideIcon> = {
  "delivery-payment": CreditCard,
  "company-invoice": FileText,
  "driver-payout": Truck,
  refund: RotateCcw,
};

const typeLabel: Record<FinanceTransactionType, string> = {
  "delivery-payment": "Delivery Payment",
  "company-invoice": "Company Invoice",
  "driver-payout": "Driver Payout",
  refund: "Refund",
};

function formatAmount(value: number): string {
  const sign = value < 0 ? "-" : "+";
  return `${sign}$${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

export function RecentFinancialActivityTable({ rows }: { rows: FinanceTransaction[] }) {
  const navigate = useNavigate();

  function viewTransaction(row: FinanceTransaction) {
    navigate(`/finance/transactions/${row.id.replace(/^#/, "")}`);
  }

  const columns: Column<FinanceTransaction>[] = [
    { header: "Reference", accessor: (row) => <span className="font-medium text-text">{row.id}</span> },
    {
      header: "Type",
      accessor: (row) => {
        const Icon = iconByType[row.type];
        return (
          <span className="inline-flex items-center gap-1.5 text-text">
            <Icon className="h-3.5 w-3.5 text-text-muted" />
            {typeLabel[row.type]}
          </span>
        );
      },
    },
    { header: "Customer/Driver", accessor: (row) => row.party },
    {
      header: "Amount",
      accessor: (row) => {
        const amount = signedAmount(row);
        return <span className={amount < 0 ? "font-medium text-danger" : "font-medium text-success"}>{formatAmount(amount)}</span>;
      },
    },
    { header: "Status", accessor: (row) => <FinanceTransactionStatusBadge status={row.status} /> },
    { header: "Date", accessor: (row) => <span className="whitespace-nowrap text-text-muted">{row.date}, {row.time}</span> },
    {
      header: "",
      align: "right",
      accessor: (row) => (
        <Tooltip label="View transaction">
          <button
            type="button"
            aria-label="View transaction"
            onClick={() => viewTransaction(row)}
            className="text-text-muted hover:text-text"
          >
            <Eye className="h-4 w-4" />
          </button>
        </Tooltip>
      ),
    },
  ];

  return <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} onRowClick={viewTransaction} />;
}
