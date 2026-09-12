import { Eye, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DataTable, type Column } from "../../../components/DataTable";
import { Tooltip } from "../../../components/Tooltip";
import { DropdownMenu } from "../../../components/DropdownMenu";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import { useToast } from "../../../components/toast/ToastContext";
import type { Invoice } from "../companyInvoices";

const dotPalette = ["bg-info", "bg-warning", "bg-primary", "bg-success", "bg-danger"];

function branchDotClass(branch: string): string {
  let hash = 0;
  for (let i = 0; i < branch.length; i += 1) hash = (hash * 31 + branch.charCodeAt(i)) | 0;
  return dotPalette[Math.abs(hash) % dotPalette.length];
}

interface InvoicesTableProps {
  rows: Invoice[];
  detailHrefFor: (invoice: Invoice) => string;
  onMarkPaid: (invoice: Invoice) => void;
  onDownloadPdf: (invoice: Invoice) => void;
}

export function InvoicesTable({ rows, detailHrefFor, onMarkPaid, onDownloadPdf }: InvoicesTableProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const columns: Column<Invoice>[] = [
    { header: "Invoice No.", accessor: (row) => <span className="font-medium text-primary">{row.id}</span> },
    { header: "Order Ref", accessor: (row) => row.orderRef },
    {
      header: "Branch",
      accessor: (row) => (
        <span className="inline-flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${branchDotClass(row.branch)}`} />
          {row.branch}
        </span>
      ),
    },
    { header: "Date", accessor: (row) => row.date },
    { header: "Due Date", accessor: (row) => row.dueDate },
    { header: "Amount", accessor: (row) => <span className="font-medium text-text">{row.amount}</span> },
    { header: "Status", accessor: (row) => <InvoiceStatusBadge status={row.status} /> },
    {
      header: "Actions",
      align: "right",
      accessor: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Tooltip label="View invoice">
            <button
              type="button"
              aria-label="View invoice"
              onClick={() => navigate(detailHrefFor(row))}
              className="text-text-muted hover:text-text"
            >
              <Eye className="h-4 w-4" />
            </button>
          </Tooltip>
          <Tooltip label="Download PDF">
            <button
              type="button"
              aria-label="Download PDF"
              onClick={() => onDownloadPdf(row)}
              className="text-text-muted hover:text-text"
            >
              <Download className="h-4 w-4" />
            </button>
          </Tooltip>
          <DropdownMenu
            ariaLabel={`More actions for ${row.id}`}
            items={[
              { label: "Send Payment Reminder", onClick: () => showToast("success", `Reminder sent for ${row.id}.`) },
              ...(row.status !== "paid"
                ? [{ label: "Mark as Paid", onClick: () => onMarkPaid(row) }]
                : []),
            ]}
          />
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} onRowClick={(row) => navigate(detailHrefFor(row))} />;
}
