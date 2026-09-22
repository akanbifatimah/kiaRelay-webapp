import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "../../components/Button";
import { useToast } from "../../components/toast/ToastContext";
import { templates as initialTemplates, type Template } from "./templates";
import { TemplateCard } from "./components/TemplateCard";

export function TemplatesLibraryPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);

  function handleDuplicate(template: Template) {
    const copy: Template = { ...template, id: `${template.id}-copy-${Date.now()}`, name: `${template.name} (Copy)`, updatedLabel: "Just now" };
    setTemplates((prev) => [copy, ...prev]);
    showToast("success", `"${template.name}" was duplicated.`);
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/marketing" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Marketing
      </Link>
      <PageHeader
        title="Templates"
        subtitle="Create reusable email and newsletter templates to standardize communications."
        actions={
          <Button onClick={() => navigate("/marketing/templates/new")}>
            <Plus className="h-4 w-4" />
            Create Template
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <TemplateCard key={template.id} template={template} onDuplicate={handleDuplicate} />
        ))}
      </div>
    </div>
  );
}
