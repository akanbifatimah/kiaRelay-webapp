import type { ReactNode } from "react";
import { CheckCircle2, AlertTriangle, Flag } from "lucide-react";
import { Card } from "../../../components/Card";
import { cn } from "../../../lib/cn";

interface Insight {
  tone: "good" | "warning";
  text: string;
}

interface MarketingInsightsCardProps {
  insights: Insight[];
  title?: string;
  /** Email Results uses colored highlight boxes per row + a title icon; the
   * dashboard's plain icon-and-text list doesn't. */
  boxed?: boolean;
  /** Email Results' two follow-up action links render inside this same card,
   * below the insight list. */
  actions?: ReactNode;
}

const boxClasses: Record<Insight["tone"], string> = {
  good: "bg-tag-healthcare-bg",
  warning: "bg-tag-warning-bg",
};

// Shared between the dashboard and the Email Results page — same
// "good"/"warning" icon+text content, two different presentations per their
// own screenshots.
export function MarketingInsightsCard({ insights, title = "What's working, in plain words", boxed = false, actions }: MarketingInsightsCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <h3 className="flex items-center gap-1.5 text-sm font-semibold text-text">
        {boxed && <Flag className="h-4 w-4 text-primary" />}
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {insights.map((insight, i) => {
          const Icon = insight.tone === "good" ? CheckCircle2 : AlertTriangle;
          return (
            <li
              key={i}
              className={cn(
                "flex items-start gap-2.5 text-sm",
                boxed && "rounded-lg p-3",
                boxed && boxClasses[insight.tone],
              )}
            >
              <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", insight.tone === "good" ? "text-success" : "text-warning")} />
              <span className="text-text">{insight.text}</span>
            </li>
          );
        })}
      </ul>
      {actions}
    </Card>
  );
}
