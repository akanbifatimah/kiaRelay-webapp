import { useNavigate } from "react-router-dom";
import { PenSquare } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "../../components/Button";
import { StatTile } from "../../components/StatTile";
import { dashboardStats, dashboardInsights } from "./data";
import { MarketingQuickLinksCard } from "./components/MarketingQuickLinksCard";
import { CustomerDistributionCard } from "./components/CustomerDistributionCard";
import { RecentEmailsCard } from "./components/RecentEmailsCard";
import { MarketingInsightsCard } from "./components/MarketingInsightsCard";

export function MarketingDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Marketing"
        subtitle="Send emails to your customers and see what's working."
        actions={
          <Button onClick={() => navigate("/marketing/emails/new")}>
            <PenSquare className="h-4 w-4" />
            Write a new email
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="People on your email list" value={dashboardStats.peopleOnList.toLocaleString()} />
        <StatTile label="Emails sent this month" value={String(dashboardStats.emailsSentThisMonth)} />
        <StatTile
          label="How many open your emails"
          value={`${dashboardStats.openRate}%`}
          accent="success"
          delta={{ kind: "up", value: dashboardStats.openRateDelta }}
        />
        <StatTile label="How many click your links" value={`${dashboardStats.clickRate}%`} />
      </div>

      <MarketingQuickLinksCard />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CustomerDistributionCard />
        <RecentEmailsCard />
      </div>

      <MarketingInsightsCard insights={dashboardInsights} />
    </div>
  );
}
