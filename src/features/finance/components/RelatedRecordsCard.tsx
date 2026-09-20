import { Building2, ShoppingCart, AlertTriangle, ExternalLink, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "../../../components/toast/ToastContext";
import type { RelatedRecord } from "../adjustmentDetail";

const iconByLabel: Record<string, LucideIcon> = {
  Customer: Building2,
  "Original Order": ShoppingCart,
  "Claim Record": AlertTriangle,
};

// Customer links to a real profile (see adjustmentDetail.ts's deterministic
// customer pick). Original Order and Claim Record stay toast-only — Orders'
// mock ids don't share an id space with Finance's own mock data (same
// documented mismatch as Orders vs Invoices, see CLAUDE.md), and there's no
// Claims module built yet anywhere in the app.
export function RelatedRecordsCard({ records }: { records: RelatedRecord[] }) {
  const { showToast } = useToast();

  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-sm">
      <h3 className="text-label text-text-muted">Related Records</h3>
      <div className="flex flex-col divide-y divide-border">
        {records.map((record) => {
          const Icon = iconByLabel[record.label] ?? Building2;
          const rowContent = (
            <>
              <span className="flex items-center gap-2 text-text-muted">
                <Icon className="h-4 w-4" />
                {record.label}
              </span>
              <span className="flex items-center gap-1 font-medium text-primary">
                {record.value}
                <ExternalLink className="h-3 w-3" />
              </span>
            </>
          );

          return record.href ? (
            <Link
              key={record.label}
              to={record.href}
              className="flex items-center justify-between gap-2 py-2.5 text-left text-sm hover:bg-bg"
            >
              {rowContent}
            </Link>
          ) : (
            <button
              key={record.label}
              type="button"
              onClick={() => showToast("success", `Opening ${record.label.toLowerCase()} — coming soon.`)}
              className="flex items-center justify-between gap-2 py-2.5 text-left text-sm hover:bg-bg"
            >
              {rowContent}
            </button>
          );
        })}
      </div>
    </div>
  );
}
