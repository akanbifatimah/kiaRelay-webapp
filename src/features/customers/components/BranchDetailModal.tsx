import { Warehouse } from "lucide-react";
import { Modal } from "../../../components/Modal";
import { Avatar } from "../../../components/Avatar";
import type { Branch } from "../companyBranches";

function currency(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

export function BranchDetailModal({ branch, onClose }: { branch: Branch; onClose: () => void }) {
  const stats = [
    { label: "Operators Active", value: `${branch.operatorsActive}` },
    { label: "Live Orders", value: branch.liveOrders.toLocaleString() },
    { label: "Delivered", value: branch.delivered.toLocaleString() },
    { label: "YTD Spend", value: currency(branch.ytdSpend) },
  ];

  return (
    <Modal
      title={
        <>
          <Warehouse className="h-5 w-5 text-primary" />
          {branch.name}
        </>
      }
      subtitle={`${branch.city}, ${branch.state} · ${branch.hubCode}`}
      onClose={onClose}
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2">
          {branch.nodeType && (
            <span className="text-badge rounded-full bg-tag-freight-bg px-2 py-0.5 text-tag-freight-fg">
              {branch.nodeType}
            </span>
          )}
          {branch.capacityTier && (
            <span className="text-badge rounded-full bg-tag-standard-bg px-2 py-0.5 text-tag-standard-fg">
              {branch.capacityTier}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-label text-text-muted">{stat.label}</p>
              <p className="mt-1 text-sm font-semibold text-text">{stat.value}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="text-label text-text-muted">Primary Contact</p>
          <p className="mt-1 text-sm font-medium text-text">{branch.primaryContact}</p>
        </div>

        <div>
          <p className="text-label mb-2 text-text-muted">Team ({branch.teamNames.length + branch.teamOverflow})</p>
          {branch.teamNames.length === 0 ? (
            <p className="text-sm text-text-muted">No team members assigned yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {branch.teamNames.map((name) => (
                <div key={name} className="flex items-center gap-2.5 rounded-lg border border-border p-2.5">
                  <Avatar name={name} size="sm" />
                  <span className="text-sm text-text">{name}</span>
                </div>
              ))}
              {branch.teamOverflow > 0 && (
                <p className="text-xs text-text-muted">+{branch.teamOverflow} more not shown</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
