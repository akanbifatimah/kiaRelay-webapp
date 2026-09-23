import { createStore, useStore } from "../../lib/createStore";
import { seedArticles } from "./knowledgeBaseSeeds";

export type ArticleCategory = "customer-help" | "driver-help" | "deliveries" | "billing" | "safety" | "policies";
export type ArticleStatus = "published" | "draft" | "in-review";
export type ArticleAudience = "support-staff" | "customers" | "drivers";

export const articleCategoryLabels: Record<ArticleCategory, string> = {
  "customer-help": "Customer Help",
  "driver-help": "Driver Help",
  deliveries: "Deliveries",
  billing: "Billing",
  safety: "Safety",
  policies: "Policies",
};

export const articleStatusLabels: Record<ArticleStatus, string> = {
  published: "Published",
  draft: "Draft",
  "in-review": "In Review",
};

export const audienceLabels: Record<ArticleAudience, string> = {
  "support-staff": "Support Staff",
  customers: "Customers",
  drivers: "Drivers",
};

export interface KnowledgeArticle {
  id: string;
  title: string;
  summary: string;
  category: ArticleCategory;
  author: string;
  authorRole: string;
  updatedDaysAgo: number;
  status: ArticleStatus;
  audiences: ArticleAudience[];
  tags: string[];
  /** Markdown-ish body — see ArticleContent.tsx for the supported syntax. */
  content: string;
  helpfulYes: number;
  helpfulNo: number;
  views: number;
}

// TODO: replace with GET/POST/PUT/DELETE /support/knowledge-base once the
// Support module API exists. Session-wide store (lib/createStore.ts) so an
// article created or published in the editor shows up in the list.
export const articlesStore = createStore<KnowledgeArticle[]>(seedArticles);

export const useArticles = () => useStore(articlesStore);

export function useArticle(id: string | undefined): KnowledgeArticle | undefined {
  return useArticles().find((article) => article.id === id);
}

export function saveArticle(article: KnowledgeArticle): void {
  articlesStore.set((prev) =>
    prev.some((existing) => existing.id === article.id)
      ? prev.map((existing) => (existing.id === article.id ? article : existing))
      : [article, ...prev],
  );
}

export function updateArticle(id: string, changes: Partial<KnowledgeArticle>): void {
  articlesStore.set((prev) => prev.map((article) => (article.id === id ? { ...article, ...changes } : article)));
}

export function removeArticle(id: string): void {
  articlesStore.set((prev) => prev.filter((article) => article.id !== id));
}

export function nextArticleId(): string {
  const highest = articlesStore.get().reduce((max, article) => Math.max(max, Number(article.id.replace(/\D/g, "")) || 0), 1000);
  return `KB-${highest + 1}`;
}

export function formatUpdated(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

export function helpfulPct(article: KnowledgeArticle): number | null {
  const total = article.helpfulYes + article.helpfulNo;
  return total === 0 ? null : Math.round((article.helpfulYes / total) * 100);
}
