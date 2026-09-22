import { Search } from "lucide-react";
import { cn } from "../../../lib/cn";
import type { NewsletterTab } from "../filterNewsletters";

const tabs: { id: NewsletterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "draft", label: "Drafts" },
  { id: "scheduled", label: "Scheduled" },
  { id: "sent", label: "Sent" },
];

interface NewslettersFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  tab: NewsletterTab;
  onTabChange: (tab: NewsletterTab) => void;
}

export function NewslettersFilterBar({ search, onSearchChange, tab, onTabChange }: NewslettersFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-56 flex-1 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 sm:max-w-sm">
        <Search className="h-4 w-4 text-text-muted" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search newsletters..."
          className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-1.5">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onTabChange(t.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium",
              tab === t.id ? "border-text bg-text text-white" : "border-border text-text-muted hover:bg-bg",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
