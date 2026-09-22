import type { MarketingEmailStatus } from "./data";
import type { MarketingEmail } from "./emails";

export type RecipientFilter = "all" | string;

export interface EmailFilters {
  search: string;
  status: MarketingEmailStatus | "all";
  recipient: RecipientFilter;
}

export function filterEmails(emails: MarketingEmail[], filters: EmailFilters): MarketingEmail[] {
  const search = filters.search.trim().toLowerCase();

  return emails.filter((email) => {
    if (filters.status !== "all" && email.status !== filters.status) return false;
    if (filters.recipient !== "all" && email.recipient !== filters.recipient) return false;
    if (search && !email.subject.toLowerCase().includes(search) && !email.recipient.toLowerCase().includes(search)) {
      return false;
    }
    return true;
  });
}
