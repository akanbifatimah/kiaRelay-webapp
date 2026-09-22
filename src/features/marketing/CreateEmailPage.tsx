import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card } from "../../components/Card";
import { ConfirmModal } from "../../components/ConfirmModal";
import { useToast } from "../../components/toast/ToastContext";
import { downloadFile } from "../../lib/downloadFile";
import { buildEmailHtml } from "./buildEmailHtml";
import {
  type CreateEmailFormValues,
  buildEmailDefaultValuesFromTemplate,
  computeRecipientCount,
  createEmailDefaultValues,
} from "./createEmailForm";
import { templates } from "./templates";
import { CreateEmailHeader } from "./components/CreateEmailHeader";
import { EmailStepHeader } from "./components/EmailStepHeader";
import { EmailWriteStep } from "./components/EmailWriteStep";
import { EmailAudienceStep } from "./components/EmailAudienceStep";
import { EmailSendStep } from "./components/EmailSendStep";

export function CreateEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const appliedTemplate = templates.find((t) => t.id === (location.state as { templateId?: string } | null)?.templateId);
  const { control, handleSubmit, getValues } = useForm<CreateEmailFormValues>({
    defaultValues: appliedTemplate ? buildEmailDefaultValuesFromTemplate(appliedTemplate) : createEmailDefaultValues,
  });
  const [savedAt] = useState(() => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);

  const sendToAllAreas = useWatch({ control, name: "sendToAllAreas" });
  const selectedAreaIds = useWatch({ control, name: "selectedAreaIds" });
  const recipientCount = computeRecipientCount(sendToAllAreas, selectedAreaIds);

  function onSubmit(values: CreateEmailFormValues) {
    const action = values.sendTiming === "now" ? "sent" : "scheduled";
    showToast("success", `"${values.subject}" was ${action} to ${recipientCount.toLocaleString()} recipients.`);
    navigate("/marketing/emails");
  }

  function handlePreview() {
    const values = getValues();
    navigate("/marketing/emails/draft/preview", {
      state: {
        internalName: values.internalName,
        subject: values.subject,
        message: values.message,
        actionLabel: values.actionLabel,
        actionUrl: values.actionUrl,
      },
    });
  }

  function handleDownloadHtml() {
    const html = buildEmailHtml(getValues());
    const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
    downloadFile(URL.createObjectURL(blob), `${getValues("internalName") || "email"}.html`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Link to="/marketing/emails" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Emails
      </Link>
      <CreateEmailHeader savedAt={savedAt} onPreview={handlePreview} onSaveDraft={() => showToast("success", "Draft saved.")} />

      <Card>
        <EmailStepHeader step={1} title="Write it" />
        <EmailWriteStep control={control} />
      </Card>

      <Card>
        <EmailStepHeader step={2} title="Choose who gets it" />
        <EmailAudienceStep control={control} recipientCount={recipientCount} />
      </Card>

      <Card>
        <EmailStepHeader step={3} title="Send it" />
        <EmailSendStep
          control={control}
          recipientCount={recipientCount}
          onDiscard={() => setIsDiscardOpen(true)}
          onDownloadHtml={handleDownloadHtml}
        />
      </Card>

      {isDiscardOpen && (
        <ConfirmModal
          title="Discard draft?"
          message="This email hasn't been sent yet. Discarding it can't be undone."
          confirmLabel="Discard draft"
          tone="danger"
          onCancel={() => setIsDiscardOpen(false)}
          onConfirm={() => {
            setIsDiscardOpen(false);
            showToast("success", "Draft discarded.");
            navigate("/marketing/emails");
          }}
        />
      )}
    </form>
  );
}
