import { useNavigate } from "react-router-dom";
import { DataTable, type Column, type SortState } from "../../../components/DataTable";
import { DropdownMenu } from "../../../components/DropdownMenu";
import type { MarketingEmail } from "../emails";
import { MarketingStatusBadge } from "./MarketingStatusBadge";

interface EmailsTableProps {
  rows: MarketingEmail[];
  sort: SortState;
  onSortChange: (key: string) => void;
}

const pct = (value: number | null) => (value == null ? "—" : `${value}%`);

// "Sending" rows show "In progress" in place of a percentage, matching the
// Email Management screenshot exactly — those two cells are the one place
// this table deviates from a plain number/em-dash.
//
// Only "sent" rows have anywhere to go (Email Results only exists for
// completed sends). The whole row is clickable for those — DataTable's
// isRowClickable keeps the pointer cursor/onClick off every other status —
// alongside the DropdownMenu's own "View Results" item, which still works
// on its own thanks to DropdownMenu's stopPropagation guard.
export function EmailsTable({ rows, sort, onSortChange }: EmailsTableProps) {
  const navigate = useNavigate();
  const goToResults = (row: MarketingEmail) => navigate(`/marketing/emails/${row.id}/results`);

  const columns: Column<MarketingEmail>[] = [
    {
      header: "Email (Subject Line)",
      sortKey: "subject",
      accessor: (row) => (
        <div>
          <p className="font-medium text-text">{row.subject}</p>
          <p className="text-xs text-text-muted">{row.context}</p>
        </div>
      ),
    },
    { header: "Recipient", sortKey: "recipient", accessor: (row) => row.recipient },
    { header: "Status", sortKey: "status", accessor: (row) => <MarketingStatusBadge status={row.status} /> },
    { header: "Sent At", sortKey: "sentAt", accessor: (row) => row.sentAt ?? "—" },
    {
      header: "Opened (%)",
      sortKey: "openedPct",
      accessor: (row) => (row.status === "sending" ? "In progress" : pct(row.openedPct)),
    },
    {
      header: "Clicked (%)",
      sortKey: "clickedPct",
      accessor: (row) => (row.status === "sending" ? "In progress" : pct(row.clickedPct)),
    },
    {
      header: "",
      align: "right",
      accessor: (row) => (
        <DropdownMenu
          ariaLabel={`Actions for ${row.subject}`}
          items={row.status === "sent" ? [{ label: "View Results", onClick: () => goToResults(row) }] : []}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      rowKey={(row) => row.id}
      sort={sort}
      onSortChange={onSortChange}
      onRowClick={goToResults}
      isRowClickable={(row) => row.status === "sent"}
    />
  );
}
