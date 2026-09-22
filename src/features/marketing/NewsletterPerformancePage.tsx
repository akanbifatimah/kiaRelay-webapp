import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Copy, Eye, Archive } from "lucide-react";
import { Button } from "../../components/Button";
import { useToast } from "../../components/toast/ToastContext";
import { getNewsletterPerformance } from "./newsletterPerformance";
import { NewsletterPerformanceStats } from "./components/NewsletterPerformanceStats";
import { OpenPerformanceChart } from "./components/OpenPerformanceChart";
import { ClickDistributionCard } from "./components/ClickDistributionCard";

export function NewsletterPerformancePage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const performance = getNewsletterPerformance(id);

  return (
    <div className="flex flex-col gap-6">
      <Link to="/marketing/newsletters" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Newsletters
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-heading-1 text-text">{performance.name}</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-tag-healthcare-bg px-2.5 py-1 text-xs font-medium text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Sent
            </span>
          </div>
          <p className="text-body mt-1 text-text-muted">{performance.sentLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Same "open a fresh compose flow" behavior as EmailResultsPage's
              "Copy this email to send again" — no backend to actually clone
              a sent record from. */}
          <Button type="button" variant="secondary" onClick={() => navigate("/marketing/newsletters/new")}>
            <Copy className="h-4 w-4" />
            Duplicate
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate(`/marketing/newsletters/${id}/preview`)}>
            <Eye className="h-4 w-4" />
            View
          </Button>
          <Button type="button" variant="secondary" onClick={() => showToast("success", "Newsletter archived.")}>
            <Archive className="h-4 w-4" />
            Archive
          </Button>
        </div>
      </div>

      <NewsletterPerformanceStats performance={performance} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <OpenPerformanceChart data={performance.openPerformance} />
        <ClickDistributionCard links={performance.clickDistribution} />
      </div>
    </div>
  );
}
