import { AlertTriangle, BookOpen, Box, CircleDollarSign, FileText, Lock, Truck, Users } from "lucide-react";
import { cn } from "../../../lib/cn";
import { articleCategoryLabels, articleStatusLabels, type ArticleCategory, type ArticleStatus } from "../knowledgeBase";

const CATEGORY_ICONS: Record<ArticleCategory, typeof Truck> = {
  "customer-help": Users,
  "driver-help": Truck,
  deliveries: Box,
  billing: CircleDollarSign,
  safety: AlertTriangle,
  policies: FileText,
};

export function CategoryChip({ category, tone = "neutral" }: { category: ArticleCategory; tone?: "neutral" | "strong" }) {
  const Icon = CATEGORY_ICONS[category] ?? BookOpen;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded px-1.5 py-0.5 text-xs font-medium",
        tone === "strong" && category === "safety" ? "bg-tag-danger-bg text-tag-danger-fg" : "bg-bg text-text",
      )}
    >
      <Icon className="h-3 w-3" />
      {articleCategoryLabels[category]}
    </span>
  );
}

const statusClasses: Record<ArticleStatus, string> = {
  published: "bg-success/10 text-success",
  draft: "bg-tag-standard-bg text-tag-standard-fg",
  "in-review": "bg-tag-overnight-bg text-tag-overnight-fg",
};

export function ArticleStatusPill({ status }: { status: ArticleStatus }) {
  return <span className={cn("text-badge whitespace-nowrap rounded-full px-2 py-0.5", statusClasses[status])}>{articleStatusLabels[status]}</span>;
}

export function InternalOnlyChip() {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-border px-1.5 py-0.5 text-xs font-medium text-text-muted">
      <Lock className="h-3 w-3" />
      Internal Only
    </span>
  );
}
