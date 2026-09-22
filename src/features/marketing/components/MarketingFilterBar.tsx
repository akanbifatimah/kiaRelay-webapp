import { Search, Download, Settings2 } from "lucide-react";
import { Button } from "../../../components/Button";
import { Tooltip } from "../../../components/Tooltip";
import type { MarketingEmailStatus } from "../data";
import type { RecipientFilter } from "../filterEmails";

const RECIPIENT_OPTIONS = [
  "All Active Drivers",
  "Fleet Operators",
  "Warehouse Staff - East Coast",
  "Management Tier 1 & 2",
  "Independent Operators",
  "External Vendors List A",
  "Affected Segment (Dynamic)",
];

interface MarketingFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: MarketingEmailStatus | "all";
  onStatusChange: (value: MarketingEmailStatus | "all") => void;
  recipient: RecipientFilter;
  onRecipientChange: (value: RecipientFilter) => void;
  onExport: () => void;
}

// TODO: Date filter is visual-only for now, matching CustomersFilterBar's
// own Date Range dropdown — wire up once a real date field exists to filter
// against. The trailing icon button is a table-settings/column-picker
// placeholder (TODO), not wired to anything yet.
export function MarketingFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  recipient,
  onRecipientChange,
  onExport,
}: MarketingFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex min-w-56 flex-1 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
        <Search className="h-4 w-4 text-text-muted" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by recipient or subject"
          className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
        />
      </div>
      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as MarketingEmailStatus | "all")}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
      >
        <option value="all">Status: All</option>
        <option value="sent">Sent</option>
        <option value="draft">Draft</option>
        <option value="scheduled">Scheduled</option>
        <option value="sending">Sending</option>
        <option value="failed">Failed</option>
      </select>
      <select className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text">
        <option>Date: Last 30 Days</option>
      </select>
      <select
        value={recipient}
        onChange={(event) => onRecipientChange(event.target.value)}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
      >
        <option value="all">Recipient: Any</option>
        {RECIPIENT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <Button type="button" variant="secondary" onClick={onExport}>
        <Download className="h-4 w-4" />
        Export
      </Button>
      <Tooltip label="Table settings">
        <button type="button" aria-label="Table settings" className="rounded-lg border border-border p-2 text-text-muted hover:bg-bg">
          <Settings2 className="h-4 w-4" />
        </button>
      </Tooltip>
    </div>
  );
}
