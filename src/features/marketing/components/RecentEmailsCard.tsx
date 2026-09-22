import { Link } from "react-router-dom";
import { Card } from "../../../components/Card";
import { recentEmailsWidget } from "../data";
import { MarketingPerformanceBadge } from "./MarketingPerformanceBadge";

export function RecentEmailsCard() {
  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-text">Your recent emails</h3>
      <div className="flex flex-col divide-y divide-border">
        {recentEmailsWidget.map((email) => (
          <Link
            key={email.id}
            to={`/marketing/emails/${email.id}/results`}
            className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 hover:bg-bg"
          >
            <div>
              <p className="text-sm font-medium text-text">{email.subject}</p>
              <p className="text-xs text-text-muted">{email.meta}</p>
            </div>
            <MarketingPerformanceBadge tone={email.tone} />
          </Link>
        ))}
      </div>
      <Link to="/marketing/emails" className="text-sm font-medium text-primary hover:underline">
        See all emails →
      </Link>
    </Card>
  );
}
