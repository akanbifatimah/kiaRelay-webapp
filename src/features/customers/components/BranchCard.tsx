import { Warehouse, Eye, Pencil } from "lucide-react";
import { Card } from "../../../components/Card";
import { Avatar } from "../../../components/Avatar";
import { Tooltip } from "../../../components/Tooltip";
import type { Branch } from "../companyBranches";

function currency(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

interface BranchCardProps {
  branch: Branch;
  onView: () => void;
  onEdit: () => void;
}

export function BranchCard({ branch, onView, onEdit }: BranchCardProps) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-bg text-primary">
            <Warehouse className="h-4 w-4" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="font-semibold text-text">{branch.name}</p>
              {branch.nodeType && (
                <span className="text-badge rounded-full bg-tag-freight-bg px-2 py-0.5 text-tag-freight-fg">
                  {branch.nodeType}
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted">
              {branch.city}, {branch.state} · {branch.hubCode}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-text-muted">
          <Tooltip label="View branch">
            <button type="button" aria-label="View branch" onClick={onView} className="hover:text-text">
              <Eye className="h-4 w-4" />
            </button>
          </Tooltip>
          <Tooltip label="Edit branch">
            <button type="button" aria-label="Edit branch" onClick={onEdit} className="hover:text-text">
              <Pencil className="h-4 w-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-label text-text-muted">Primary Contact</p>
          <p className="mt-0.5 font-medium text-text">{branch.primaryContact}</p>
        </div>
        <div>
          <p className="text-label text-text-muted">Operators</p>
          <p className="mt-0.5 font-medium text-text">{branch.operatorsActive} Active</p>
        </div>
        <div>
          <p className="text-label text-text-muted">Live Orders</p>
          <p className="mt-0.5 font-semibold text-primary">{branch.liveOrders.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-label text-text-muted">Delivered</p>
          <p className="mt-0.5 font-medium text-text">{branch.delivered.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <div>
          <p className="text-label text-text-muted">YTD Spend</p>
          <p className="font-semibold text-text">{currency(branch.ytdSpend)}</p>
        </div>
        <div className="flex items-center -space-x-2">
          {branch.teamNames.map((name) => (
            <Avatar key={name} name={name} size="sm" />
          ))}
          {branch.teamOverflow > 0 && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-surface bg-bg text-[10px] font-medium text-text-muted">
              +{branch.teamOverflow}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
