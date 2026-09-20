import { Search, Download } from "lucide-react";
import { Button } from "../../../components/Button";

interface FinanceActivityFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onExport: () => void;
}

export function FinanceActivityFilterBar({ search, onSearchChange, onExport }: FinanceActivityFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 sm:max-w-xs">
        <Search className="h-4 w-4 shrink-0 text-text-muted" />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Filter by reference or party…"
          className="w-full min-w-0 bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
        />
      </div>
      <Button type="button" variant="secondary" onClick={onExport}>
        <Download className="h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
}
