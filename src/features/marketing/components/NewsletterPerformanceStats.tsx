import { Card } from "../../../components/Card";
import type { NewsletterPerformance } from "../newsletterPerformance";

interface NewsletterPerformanceStatsProps {
  performance: NewsletterPerformance;
}

// A plain stat row (value + a muted rate line, no delta arrow/color) — the
// numbers here aren't a comparison against a prior period, so StatTile's
// delta treatment doesn't fit; built directly on Card instead.
export function NewsletterPerformanceStats({ performance }: NewsletterPerformanceStatsProps) {
  const stats = [
    { label: "Sent", value: performance.sent, rate: null },
    { label: "Delivered", value: performance.delivered, rate: `${performance.deliveredRate}%` },
    { label: "Opened", value: performance.opened, rate: `${performance.openRate}% Rate` },
    { label: "Clicked", value: performance.clicked, rate: `${performance.clickRate}% Rate` },
    { label: "Unsubscribed", value: performance.unsubscribed, rate: `${performance.unsubscribeRate}%` },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.label} className="flex flex-col gap-1">
          <span className="text-label text-text-muted">{stat.label}</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-text">{stat.value.toLocaleString()}</span>
            {stat.rate && <span className="text-xs text-text-muted">{stat.rate}</span>}
          </div>
        </Card>
      ))}
    </div>
  );
}
