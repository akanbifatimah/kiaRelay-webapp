import { Plus } from "lucide-react";

export function AddNewPolicyCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 rounded-[var(--radius-card)] border border-dashed border-border p-5 text-center hover:border-primary hover:bg-bg"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg text-text-muted">
        <Plus className="h-4 w-4" />
      </span>
      <p className="text-sm font-semibold text-text">Add New Policy</p>
      <p className="text-xs text-text-muted">Define a custom payout cycle for specific driver groups or regions.</p>
    </button>
  );
}
