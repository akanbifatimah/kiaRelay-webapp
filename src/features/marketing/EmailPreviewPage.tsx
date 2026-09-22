import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Monitor, Smartphone, Send } from "lucide-react";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { cn } from "../../lib/cn";
import { useToast } from "../../components/toast/ToastContext";
import { resolvePreview } from "./previewData";
import { EmailPreviewHeaderCard } from "./components/EmailPreviewHeaderCard";
import { EmailRenderedPreview } from "./components/EmailRenderedPreview";

type ViewMode = "desktop" | "mobile";

export function EmailPreviewPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const preview = resolvePreview(id, location.state);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Editor
        </button>
        <p className="text-sm text-text-muted">
          Previewing: <span className="font-medium text-text">{preview.internalName}</span>
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setViewMode((mode) => (mode === "desktop" ? "mobile" : "desktop"))}
          >
            {viewMode === "desktop" ? <Monitor className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
            {viewMode === "desktop" ? "Desktop View" : "Mobile View"}
          </Button>
          <Button type="button" variant="dark" onClick={() => showToast("success", "Test email sent to your inbox.")}>
            <Send className="h-4 w-4" />
            Send Test
          </Button>
        </div>
      </div>

      <EmailPreviewHeaderCard
        fromName={preview.fromName}
        fromEmail={preview.fromEmail}
        toLabel={preview.toLabel}
        toEmail={preview.toEmail}
        sentLabel={preview.sentLabel}
        subject={preview.subject}
      />

      <Card className="flex justify-center bg-bg p-8">
        <div className={cn("w-full transition-all", viewMode === "desktop" ? "max-w-xl" : "max-w-92 rounded-4xl border-8 border-sidebar")}>
          <EmailRenderedPreview
            headline={preview.headline}
            message={preview.message}
            actionLabel={preview.actionLabel}
            actionUrl={preview.actionUrl}
          />
        </div>
      </Card>
    </div>
  );
}
