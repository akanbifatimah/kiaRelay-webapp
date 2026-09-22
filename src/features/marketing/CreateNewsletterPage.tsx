import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useToast } from "../../components/toast/ToastContext";
import {
  type CreateNewsletterFormValues,
  buildNewsletterDefaultValuesFromTemplate,
  createNewsletterDefaultValues,
} from "./createNewsletterForm";
import { templates } from "./templates";
import { NewsletterDetailsCard } from "./components/NewsletterDetailsCard";
import { TargetAudienceCard } from "./components/TargetAudienceCard";
import { NewsletterContentEditor } from "./components/NewsletterContentEditor";
import { PublishingSidebarCard } from "./components/PublishingSidebarCard";
import { NewsletterContentPreviewCard } from "./components/NewsletterContentPreviewCard";

export function CreateNewsletterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const appliedTemplate = templates.find((t) => t.id === (location.state as { templateId?: string } | null)?.templateId);
  const { control, handleSubmit, setValue } = useForm<CreateNewsletterFormValues>({
    defaultValues: appliedTemplate ? buildNewsletterDefaultValuesFromTemplate(appliedTemplate) : createNewsletterDefaultValues,
  });

  function publish(action: "sent" | "scheduled" | "draft") {
    return handleSubmit((values: CreateNewsletterFormValues) => {
      const verb = action === "sent" ? "sent" : action === "scheduled" ? "scheduled" : "saved as a draft";
      showToast("success", `"${values.newsletterName || values.subject}" was ${verb}.`);
      navigate("/marketing/newsletters");
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-text-muted">
            <Link to="/marketing" className="hover:text-text">Marketing & Sales</Link>
            {" / "}
            <Link to="/marketing/newsletters" className="hover:text-text">Newsletters</Link>
            {" / Create"}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <h1 className="text-heading-1 text-text">Create Newsletter</h1>
            <span className="rounded-full bg-tag-standard-bg px-2.5 py-1 text-xs font-medium text-text-muted">Draft</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate("/marketing/newsletters")}
          className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-4">
          <NewsletterDetailsCard control={control} />
          <TargetAudienceCard control={control} />
          <NewsletterContentEditor control={control} setValue={setValue} />
        </div>
        <div className="flex flex-col gap-4">
          <PublishingSidebarCard
            onSendNow={publish("sent")}
            onSchedule={publish("scheduled")}
            onSaveDraft={publish("draft")}
          />
          <NewsletterContentPreviewCard control={control} />
        </div>
      </div>
    </div>
  );
}
