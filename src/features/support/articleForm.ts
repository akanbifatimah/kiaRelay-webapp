import type { ArticleAudience, ArticleCategory, ArticleStatus, KnowledgeArticle } from "./knowledgeBase";

export interface ArticleFormValues {
  title: string;
  content: string;
  category: ArticleCategory | "";
  audiences: ArticleAudience[];
  tags: string[];
}

export const EMPTY_ARTICLE_FORM: ArticleFormValues = { title: "", content: "", category: "", audiences: ["support-staff"], tags: [] };

export function formFromArticle(article: KnowledgeArticle): ArticleFormValues {
  return { title: article.title, content: article.content, category: article.category, audiences: article.audiences, tags: article.tags };
}

/** List-row summary — the body's first paragraph with markdown stripped. */
export function summarize(content: string): string {
  const first = content.split("\n\n").find((block) => block.trim() && !/^(#|>|```|!\[|- |\d+\.)/.test(block.trim())) ?? "";
  const plain = first.replace(/\*\*|__|\*|`/g, "").replace(/\[(.+?)\]\(.+?\)/g, "$1").replace(/\s+/g, " ").trim();
  return plain.length > 120 ? `${plain.slice(0, 117)}…` : plain;
}

export function articleFromForm(
  id: string,
  values: ArticleFormValues,
  status: ArticleStatus,
  author: { name: string; role: string },
  existing?: KnowledgeArticle,
): KnowledgeArticle {
  return {
    id,
    title: values.title.trim(),
    summary: summarize(values.content) || "No summary yet.",
    category: values.category || "customer-help",
    author: existing?.author ?? author.name,
    authorRole: existing?.authorRole ?? author.role,
    updatedDaysAgo: 0,
    status,
    audiences: values.audiences,
    tags: values.tags,
    content: values.content,
    helpfulYes: existing?.helpfulYes ?? 0,
    helpfulNo: existing?.helpfulNo ?? 0,
    views: existing?.views ?? 0,
  };
}
