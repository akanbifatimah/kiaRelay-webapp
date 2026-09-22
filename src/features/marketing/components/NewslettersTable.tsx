import { useNavigate } from "react-router-dom";
import { DataTable, type Column } from "../../../components/DataTable";
import { DropdownMenu } from "../../../components/DropdownMenu";
import type { Newsletter } from "../newsletters";
import { NewsletterStatusBadge } from "./NewsletterStatusBadge";

interface NewslettersTableProps {
  rows: Newsletter[];
}

const pct = (value: number | null) => (value == null ? "-" : `${value}%`);

// Same clickable-sent-row + DropdownMenu pattern as EmailsTable: only "sent"
// newsletters have a Performance Detail page to land on.
export function NewslettersTable({ rows }: NewslettersTableProps) {
  const navigate = useNavigate();
  const goToPerformance = (row: Newsletter) => navigate(`/marketing/newsletters/${row.id}`);

  const columns: Column<Newsletter>[] = [
    {
      header: "Newsletter",
      accessor: (row) => (
        <div>
          <p className="font-medium text-text">{row.name}</p>
          <p className="text-xs text-text-muted">{row.category}</p>
        </div>
      ),
    },
    { header: "Audience", accessor: (row) => row.audience },
    { header: "Status", accessor: (row) => <NewsletterStatusBadge status={row.status} /> },
    { header: "Scheduled Date", accessor: (row) => row.scheduledDate ?? "-" },
    { header: "Sent Date", accessor: (row) => (row.status === "sending" ? "Processing..." : row.sentDate ?? "-") },
    { header: "Open Rate", accessor: (row) => (row.status === "sending" ? "--" : pct(row.openRate)) },
    { header: "Click Rate", accessor: (row) => (row.status === "sending" ? "--" : pct(row.clickRate)) },
    {
      header: "",
      align: "right",
      accessor: (row) => (
        <DropdownMenu
          ariaLabel={`Actions for ${row.name}`}
          items={row.status === "sent" ? [{ label: "View Performance", onClick: () => goToPerformance(row) }] : []}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      rowKey={(row) => row.id}
      onRowClick={goToPerformance}
      isRowClickable={(row) => row.status === "sent"}
    />
  );
}
