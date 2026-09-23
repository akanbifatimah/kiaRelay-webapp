import { cn } from "../../../lib/cn";
import { industryLabels, type Industry } from "../customerPerformanceData";

const industryStyles: Record<Industry, { dot: string; chip: string; avatar: string }> = {
  "oil-gas": { dot: "bg-sidebar", chip: "bg-bg text-text", avatar: "bg-sidebar" },
  construction: { dot: "bg-primary", chip: "bg-tag-express-bg text-tag-express-fg", avatar: "bg-primary" },
  healthcare: { dot: "bg-info", chip: "bg-tag-info-bg text-tag-info-fg", avatar: "bg-info" },
  logistics: { dot: "bg-sidebar-fg", chip: "bg-bg text-text", avatar: "bg-sidebar" },
  manufacturing: { dot: "bg-tag-overnight-fg", chip: "bg-tag-overnight-bg text-tag-overnight-fg", avatar: "bg-tag-overnight-fg" },
  individual: { dot: "bg-text-muted", chip: "bg-bg text-text-muted", avatar: "bg-sidebar-fg" },
};

export function IndustryChip({ industry }: { industry: Industry }) {
  const style = industryStyles[industry];
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium", style.chip)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
      {industryLabels[industry]}
    </span>
  );
}

/** Square initials tile, colored by industry — the directory's avatar style. */
export function AccountAvatar({ name, industry, size = "md" }: { name: string; industry: Industry; size?: "md" | "lg" }) {
  const initials = name
    .split(" ")
    .filter((part) => /^[A-Za-z]/.test(part))
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md font-semibold text-white",
        industryStyles[industry].avatar,
        size === "lg" ? "h-12 w-12 text-base" : "h-9 w-9 text-xs",
      )}
    >
      {initials}
    </span>
  );
}
