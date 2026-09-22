import { Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { StatTile } from "../../components/StatTile";
import { useToast } from "../../components/toast/ToastContext";
import { campaigns, campaignStats } from "./campaigns";
import { RecentCampaignsTable } from "./components/RecentCampaignsTable";
import { MarketingQuickLinksCard } from "./components/MarketingQuickLinksCard";
import { RecentActivityCard } from "./components/RecentActivityCard";
import { recentActivity } from "./data";

export function CampaignsPage() {
  const { showToast } = useToast();

  return (
    <div className="flex flex-col gap-6">
      <Link to="/marketing" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Marketing
      </Link>
      <PageHeader
        title="Marketing Overview"
        subtitle="Command center for outgoing logistics communications."
        actions={
          // TODO: no campaign-builder screen exists yet — route this to a
          // real /marketing/campaigns/new flow once one is designed.
          <Button onClick={() => showToast("success", "Campaign builder is coming soon — try Write a new email for now.")}>
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Emails Sent"
          value={campaignStats.emailsSent.toLocaleString()}
          accent="success"
          delta={{ kind: "up", value: campaignStats.emailsSentDelta }}
        />
        <StatTile
          label="Open Rate"
          value={`${campaignStats.openRate}%`}
          accent="success"
          delta={{ kind: "up", value: campaignStats.openRateDelta }}
        />
        <StatTile
          label="Click Rate"
          value={`${campaignStats.clickRate}%`}
          delta={{ kind: "down", value: campaignStats.clickRateDelta }}
        />
        <StatTile label="Active Campaigns" value={String(campaignStats.activeCampaigns)} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="flex flex-col gap-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text">Recent Campaigns</h3>
            {/* TODO: no dedicated all-campaigns list screen yet — points back here. */}
            <Link to="/marketing/campaigns" className="text-sm font-medium text-primary hover:underline">
              View All
            </Link>
          </div>
          <RecentCampaignsTable campaigns={campaigns} />
        </Card>
        <div className="flex flex-col gap-4">
          <MarketingQuickLinksCard />
          <RecentActivityCard entries={recentActivity} />
        </div>
      </div>
    </div>
  );
}
