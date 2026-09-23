import { cn } from "../../../lib/cn";
import { articleCategoryLabels, type ArticleCategory } from "../knowledgeBase";

const OPTIONS = ["all", ...Object.keys(articleCategoryLabels)] as (ArticleCategory | "all")[];

export function CategoryPills({ value, onChange }: { value: ArticleCategory | "all"; onChange: (value: ArticleCategory | "all") => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium",
            value === option ? "border-sidebar bg-sidebar text-white" : "border-border text-text hover:bg-bg",
          )}
        >
          {option === "all" ? "All Categories" : articleCategoryLabels[option]}
        </button>
      ))}
    </div>
  );
}
