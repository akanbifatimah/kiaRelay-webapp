import { useNavigate } from "react-router-dom";
import { DataTable, type Column } from "../../../components/DataTable";
import { DropdownMenu } from "../../../components/DropdownMenu";
import { FinanceInvoiceStatusBadge } from "./FinanceInvoiceStatusBadge";
import type { FinanceInvoice } from "../companyInvoicesOverview";

function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

export function CompanyInvoicesTable({ rows }: { rows: FinanceInvoice[] }) {
  const navigate = useNavigate();

  function viewInvoice(row: FinanceInvoice) {
    navigate(`/finance/invoices/${row.id}`);
  }

  const columns: Column<FinanceInvoice>[] = [
    { header: "Invoice#", accessor: (row) => <span className="font-medium text-text">{row.id}</span> },
    { header: "Company Name", accessor: (row) => row.company },
    { header: "Period", accessor: (row) => <span className="whitespace-nowrap">{row.periodLabel}</span> },
    { header: "Amount", accessor: (row) => <span className="font-medium text-text">{formatCurrency(row.amount)}</span> },
    { header: "Status", accessor: (row) => <FinanceInvoiceStatusBadge status={row.status} /> },
    { header: "Due Date", accessor: (row) => <span className="whitespace-nowrap">{row.dueDate}</span> },
    {
      header: "Late",
      accessor: (row) =>
        row.lateDaysLabel ? (
          <span className={row.lateIsUrgent ? "font-medium text-danger" : "font-medium text-warning"}>{row.lateDaysLabel}</span>
        ) : (
          <span className="text-text-muted">—</span>
        ),
    },
    {
      header: "",
      align: "right",
      accessor: (row) => (
        <DropdownMenu ariaLabel={`Actions for ${row.id}`} items={[{ label: "View Invoice", onClick: () => viewInvoice(row) }]} />
      ),
    },
  ];

  return <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} onRowClick={viewInvoice} />;
}
