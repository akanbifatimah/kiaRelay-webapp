import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { useToast } from "../../components/toast/ToastContext";
import {
  type CreateTemplateFormValues,
  buildFormValuesFromTemplate,
  createTemplateDefaultValues,
} from "./createTemplateForm";
import { templates } from "./templates";
import { TemplateDetailsFields } from "./components/TemplateDetailsFields";
import { TemplateContentEditor } from "./components/TemplateContentEditor";
import { TemplateActionsSidebar } from "./components/TemplateActionsSidebar";
import { TemplatePreviewModal } from "./components/TemplatePreviewModal";

export function CreateTemplatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const editingTemplate = templates.find((t) => t.id === (location.state as { templateId?: string } | null)?.templateId);
  const { control, handleSubmit } = useForm<CreateTemplateFormValues>({
    defaultValues: editingTemplate ? buildFormValuesFromTemplate(editingTemplate) : createTemplateDefaultValues,
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const contentHeadline = useWatch({ control, name: "contentHeadline" });
  const contentSubtitle = useWatch({ control, name: "contentSubtitle" });
  const message = useWatch({ control, name: "message" });

  const onSave = handleSubmit((values) => {
    showToast("success", `"${values.templateName}" template was saved.`);
    navigate("/marketing/templates");
  });

  return (
    <div className="flex flex-col gap-6">
      <Link to="/marketing/templates" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Templates
      </Link>
      <PageHeader
        title={editingTemplate ? "Edit Template" : "Create Template"}
        subtitle="Design a reusable template for your communications."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="flex flex-col gap-4">
          <TemplateDetailsFields control={control} />
          <TemplateContentEditor control={control} />
        </div>
        <TemplateActionsSidebar
          control={control}
          onSave={onSave}
          onPreview={() => setIsPreviewOpen(true)}
          onCancel={() => navigate("/marketing/templates")}
        />
      </div>

      {isPreviewOpen && (
        <TemplatePreviewModal
          headline={contentHeadline}
          subtitle={contentSubtitle}
          message={message}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  );
}
