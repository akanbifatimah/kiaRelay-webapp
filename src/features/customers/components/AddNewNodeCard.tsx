import { Plus } from "lucide-react";

export function AddNewNodeCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[13rem] flex-col items-center justify-center gap-2 rounded-[var(--radius-card)] border border-dashed border-border p-5 text-center transition-colors hover:border-primary/50 hover:bg-surface"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bg text-primary">
        <Plus className="h-5 w-5" />
      </span>
      <span className="font-semibold text-text">Add New Node</span>
      <span className="max-w-[16rem] text-xs text-text-muted">
        Instantly provision a new regional hub to expand your logistics network footprint.
      </span>
    </button>
  );
}
