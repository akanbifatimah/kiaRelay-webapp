import type { MarketingEmail } from "./emails";

export type EmailSortKey = "subject" | "recipient" | "status" | "sentAt" | "openedPct" | "clickedPct";
export type SortDirection = "asc" | "desc";

// Client-side only, mirrors sortCustomers.ts. Null values (drafts/scheduled
// with no sent-metrics yet) always sort last regardless of direction.
export function sortEmails(emails: MarketingEmail[], key: EmailSortKey, direction: SortDirection): MarketingEmail[] {
  const sorted = [...emails].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    const cmp = typeof aVal === "number" && typeof bVal === "number" ? aVal - bVal : String(aVal).localeCompare(String(bVal));
    return direction === "asc" ? cmp : -cmp;
  });

  return sorted;
}
