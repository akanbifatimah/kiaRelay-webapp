import { Download, ArrowUpDown } from "lucide-react";
import { Button } from "../../../components/Button";
import type { CustomerStatus, VerificationStatus } from "../data";

interface CustomersFilterBarProps {
  status: CustomerStatus | "all";
  onStatusChange: (value: CustomerStatus | "all") => void;
  verification: VerificationStatus | "all";
  onVerificationChange: (value: VerificationStatus | "all") => void;
  onExport: () => void;
}

// TODO: wire Date Range and Sort to real behavior once needed — matching
// OrderFilterBar's pattern, these are visual-only for now.
export function CustomersFilterBar({
  status,
  onStatusChange,
  verification,
  onVerificationChange,
  onExport,
}: CustomersFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as CustomerStatus | "all")}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
      >
        <option value="all">Status</option>
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
      </select>
      <select
        value={verification}
        onChange={(event) => onVerificationChange(event.target.value as VerificationStatus | "all")}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
      >
        <option value="all">Verification</option>
        <option value="verified">Verified</option>
        <option value="pending">Pending</option>
        <option value="failed">Failed</option>
      </select>
      <select className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text">
        <option>Date Range</option>
      </select>
      <Button type="button" variant="secondary" onClick={onExport}>
        <Download className="h-4 w-4" />
        Export
      </Button>
      <Button type="button" variant="secondary">
        <ArrowUpDown className="h-4 w-4" />
        Sort
      </Button>
    </div>
  );
}
