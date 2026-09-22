import type { Newsletter, NewsletterStatus } from "./newsletters";

export type NewsletterTab = "all" | "draft" | "scheduled" | "sent";

const tabToStatus: Record<Exclude<NewsletterTab, "all">, NewsletterStatus> = {
  draft: "draft",
  scheduled: "scheduled",
  sent: "sent",
};

export interface NewsletterFilters {
  search: string;
  tab: NewsletterTab;
}

export function filterNewsletters(newsletters: Newsletter[], filters: NewsletterFilters): Newsletter[] {
  const search = filters.search.trim().toLowerCase();

  return newsletters.filter((newsletter) => {
    if (filters.tab !== "all" && newsletter.status !== tabToStatus[filters.tab]) return false;
    if (search && !newsletter.name.toLowerCase().includes(search) && !newsletter.audience.toLowerCase().includes(search)) {
      return false;
    }
    return true;
  });
}
