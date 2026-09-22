import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Copy } from "lucide-react";
import { StatTile } from "../../components/StatTile";
import { useToast } from "../../components/toast/ToastContext";
import { getEmailResult } from "./emailResults";
import { EmailFunnelCard } from "./components/EmailFunnelCard";
import { EmailAreaBreakdownCard } from "./components/EmailAreaBreakdownCard";
import { MarketingInsightsCard } from "./components/MarketingInsightsCard";
import { TopClickedLinksCard } from "./components/TopClickedLinksCard";

export function EmailResultsPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const result = getEmailResult(id);

  return (
    <div className="flex flex-col gap-6">
      <Link to="/marketing/emails" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Emails
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-heading-1 text-text">{result.subject}</h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-tag-healthcare-bg px-2.5 py-1 text-xs font-medium text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Sent
            </span>
          </div>
          <p className="text-body mt-1 text-text-muted">{result.sentLabel}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/marketing/emails/new")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <Copy className="h-4 w-4" />
          Copy this email to send again
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-text">How it did</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="Opened it" value={result.opened.toLocaleString()} accent="success" />
          <StatTile label="Clicked a link" value={result.clicked.toLocaleString()} accent="primary" />
          <StatTile label="Unsubscribed" value={result.unsubscribed.toLocaleString()} accent="danger" />
          <StatTile label="Booked a delivery" value={result.bookedDelivery.toLocaleString()} accent="success" />
        </div>
      </div>

      <EmailFunnelCard result={result} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <EmailAreaBreakdownCard areas={result.areas} />
        <MarketingInsightsCard
          insights={result.insights}
          title="In plain words"
          boxed
          actions={
            <div className="flex flex-col gap-x-4 gap-y-1 pt-1 sm:flex-row">
              <button
                type="button"
                onClick={() => showToast("success", "Follow-up drafted for people who clicked.")}
                className="text-left text-sm font-medium text-primary hover:underline"
              >
                Send a follow-up to the people who clicked
              </button>
              <button
                type="button"
                onClick={() => navigate("/marketing/emails/new")}
                className="text-left text-sm font-medium text-text hover:underline"
              >
                Send a different email to Beaumont and Zone C
              </button>
            </div>
          }
        />
      </div>

      <TopClickedLinksCard preview={result.preview} topLinks={result.topLinks} />
    </div>
  );
}
