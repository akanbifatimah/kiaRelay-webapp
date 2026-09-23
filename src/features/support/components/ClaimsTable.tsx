import { useNavigate } from "react-router-dom";
import { DataTable, type Column, type SortState } from "../../../components/DataTable";
import { DropdownMenu, type DropdownMenuItem } from "../../../components/DropdownMenu";
import { cn } from "../../../lib/cn";
import { claimCategoryLabels, claimStatusLabels, formatUsd, type ClaimInvestigation, type ClaimStatus } from "../claimInvestigation";
import { claimHref } from "../claims";

const claimStatusClasses: Record<ClaimStatus, string> = {
  draft: "bg-tag-standard-bg text-tag-standard-fg",
  open: "bg-tag-info-bg text-tag-info-fg",
  "in-review": "bg-tag-warning-bg text-tag-warning-fg",
  resolved: "bg-success/10 text-success",
  escalated: "bg-tag-danger-bg text-tag-danger-fg",
};

interface ClaimsTableProps {
  rows: ClaimInvestigation[];
  sort: SortState;
  onSortChange: (key: string) => void;
  onDeleteDraft: (claim: ClaimInvestigation) => void;
}

const BACK_STATE = { from: "/support/claims", fromLabel: "Claims Management" };

export function ClaimsTable({ rows, sort, onSortChange, onDeleteDraft }: ClaimsTableProps) {
  const navigate = useNavigate();
  const open = (claim: ClaimInvestigation) => navigate(claimHref(claim), { state: BACK_STATE });

  function actionsFor(claim: ClaimInvestigation): DropdownMenuItem[] {
    if (claim.status === "draft") {
      return [
        { label: "Continue Draft", onClick: () => open(claim) },
        { label: "Delete Draft", tone: "danger", onClick: () => onDeleteDraft(claim) },
      ];
    }
    return [{ label: "Open Investigation", onClick: () => open(claim) }];
  }

  const columns: Column<ClaimInvestigation>[] = [
    { header: "Claim ID", sortKey: "id", accessor: (row) => <span className="whitespace-nowrap font-semibold">{row.id}</span> },
    {
      header: "Customer",
      sortKey: "customer",
      accessor: (row) => (
        <div className="whitespace-nowrap">
          <p className="font-medium text-text">{row.customer.name}</p>
          <p className="text-xs text-text-muted">Order {row.order.ref}</p>
        </div>
      ),
    },
    {
      header: "Category",
      sortKey: "category",
      accessor: (row) => (
        <div className="whitespace-nowrap">
          <p>{claimCategoryLabels[row.category]}</p>
          <p className="text-xs text-text-muted">{row.type}</p>
        </div>
      ),
    },
    { header: "Driver", accessor: (row) => <span className="whitespace-nowrap">{row.driver.name}</span> },
    { header: "Amount", sortKey: "amount", align: "right", accessor: (row) => <span className="font-medium">{formatUsd(row.amount)}</span> },
    { header: "Submitted", sortKey: "created", accessor: (row) => <span className="whitespace-nowrap text-text-muted">{row.submitted}</span> },
    {
      header: "Status",
      sortKey: "status",
      accessor: (row) => <span className={cn("text-badge whitespace-nowrap rounded-full px-2 py-0.5", claimStatusClasses[row.status])}>{claimStatusLabels[row.status]}</span>,
    },
    { header: "", align: "right", accessor: (row) => <DropdownMenu ariaLabel={`Actions for ${row.id}`} items={actionsFor(row)} /> },
  ];

  if (rows.length === 0) return <p className="py-10 text-center text-sm text-text-muted">No claims match the current filters.</p>;

  return <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} sort={sort} onSortChange={onSortChange} onRowClick={open} />;
}
