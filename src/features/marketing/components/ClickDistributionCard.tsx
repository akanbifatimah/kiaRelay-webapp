import { Card } from "../../../components/Card";
import { ProgressBar } from "../../../components/ProgressBar";
import type { ClickDistributionLink } from "../newsletterPerformance";

interface ClickDistributionCardProps {
  links: ClickDistributionLink[];
}

export function ClickDistributionCard({ links }: ClickDistributionCardProps) {
  const maxClicks = Math.max(...links.map((link) => link.clicks), 1);

  return (
    <Card className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-text">Click Distribution</h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate text-text-muted">Link: {link.label}</span>
            <span className="flex shrink-0 items-center gap-2">
              <ProgressBar value={link.clicks} max={maxClicks} />
              <span className="w-16 text-right font-medium text-text">{link.clicks.toLocaleString()} clicks</span>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
