import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Monitor, Smartphone, Send } from "lucide-react";
import { Button } from "../../components/Button";
import { cn } from "../../lib/cn";
import { useToast } from "../../components/toast/ToastContext";
import { resolveNewsletterPreview } from "./newsletterPreviewData";
import { NewsletterDeliveryMetadataCard } from "./components/NewsletterDeliveryMetadataCard";
import { BrowserFrame } from "./components/BrowserFrame";
import { NewsletterRenderedPreview } from "./components/NewsletterRenderedPreview";

type ViewMode = "desktop" | "mobile";

export function NewsletterPreviewPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const preview = resolveNewsletterPreview(id, location.state);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Editor
        </button>
        <p className="text-sm text-text-muted">
          Previewing: <span className="font-medium text-text">{preview.internalName}</span>{" "}
          <span className="rounded-full bg-tag-standard-bg px-2 py-0.5 text-xs font-medium text-text-muted">{preview.statusLabel}</span>
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-border p-1">
            <button
              type="button"
              onClick={() => setViewMode("desktop")}
              className={cn("flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium", viewMode === "desktop" ? "bg-bg text-text" : "text-text-muted")}
            >
              <Monitor className="h-3.5 w-3.5" />
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setViewMode("mobile")}
              className={cn("flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium", viewMode === "mobile" ? "bg-bg text-text" : "text-text-muted")}
            >
              <Smartphone className="h-3.5 w-3.5" />
              Mobile
            </button>
          </div>
          <Button type="button" onClick={() => showToast("success", "Test email sent to your inbox.")}>
            <Send className="h-4 w-4" />
            Send Test
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[16rem_1fr]">
        <NewsletterDeliveryMetadataCard
          fromName={preview.fromName}
          fromEmail={preview.fromEmail}
          toLabel={preview.toLabel}
          toEmail={preview.toEmail}
          subject={preview.subject}
          preheader={preview.preheader}
        />
        <BrowserFrame label="preview.window.html">
          <div className={cn("mx-auto transition-all", viewMode === "mobile" && "max-w-92 rounded-4xl border-8 border-sidebar")}>
            <NewsletterRenderedPreview
              heroHeadline={preview.heroHeadline}
              greeting={preview.greeting}
              intro={preview.intro}
              calloutTitle={preview.calloutTitle}
              calloutText={preview.calloutText}
              subheading={preview.subheading}
              subheadingText={preview.subheadingText}
              ctaLabel={preview.ctaLabel}
              heroImageUrl={preview.heroImageUrl}
            />
          </div>
        </BrowserFrame>
      </div>
    </div>
  );
}
