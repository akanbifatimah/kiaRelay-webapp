import { useNavigate } from "react-router-dom";
import { DataTable, type Column } from "../../../components/DataTable";
import { DropdownMenu } from "../../../components/DropdownMenu";
import { cn } from "../../../lib/cn";
import type { Campaign, CampaignStatus } from "../campaigns";

const pillClasses: Record<CampaignStatus, string> = {
  sent: "bg-tag-healthcare-bg text-success",
  scheduled: "bg-tag-warning-bg text-warning",
  draft: "bg-tag-standard-bg text-text-muted",
};

const labels: Record<CampaignStatus, string> = {
  sent: "Sent",
  scheduled: "Scheduled",
  draft: "Draft",
};

interface RecentCampaignsTableProps {
  campaigns: Campaign[];
}

// "Sent" campaigns open the Email Results page (there's no dedicated
// campaign-detail screen yet) — the whole row is clickable for those, same
// as EmailsTable, while DataTable's isRowClickable keeps scheduled/draft
// rows free of a misleading pointer cursor. The DropdownMenu's own
// "View Results" item keeps working alongside it via stopPropagation.
export function RecentCampaignsTable({ campaigns }: RecentCampaignsTableProps) {
  const navigate = useNavigate();
  const goToResults = (row: Campaign) => navigate(`/marketing/emails/${row.id}/results`);

  const columns: Column<Campaign>[] = [
    {
      header: "Campaign",
      sortKey: "name",
      accessor: (row) => (
        <div>
          <p className="font-medium text-text">{row.name}</p>
          <p className="text-xs text-text-muted">{row.sentLabel}</p>
        </div>
      ),
    },
    { header: "Type", accessor: (row) => row.type },
    { header: "Audience", accessor: (row) => row.audience },
    {
      header: "Metrics (O/C)",
      accessor: (row) => (row.openRate == null ? "—" : `${row.openRate}% / ${row.clickRate}%`),
    },
    {
      header: "Status",
      accessor: (row) => <span className={cn("text-badge rounded-full px-3 py-1", pillClasses[row.status])}>{labels[row.status]}</span>,
    },
    {
      header: "",
      align: "right",
      accessor: (row) => (
        <DropdownMenu
          ariaLabel={`Actions for ${row.name}`}
          items={row.status === "sent" ? [{ label: "View Results", onClick: () => goToResults(row) }] : []}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={campaigns}
      rowKey={(row) => row.id}
      onRowClick={goToResults}
      isRowClickable={(row) => row.status === "sent"}
    />
  );
}
