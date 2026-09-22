import { useWatch, type Control } from "react-hook-form";
import { Save, Eye, CheckCircle2, Circle } from "lucide-react";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { cn } from "../../../lib/cn";
import type { CreateTemplateFormValues } from "../createTemplateForm";

interface TemplateActionsSidebarProps {
  control: Control<CreateTemplateFormValues>;
  onSave: () => void;
  onPreview: () => void;
  onCancel: () => void;
}

// Checklist state is derived live from the form's own fields (same pattern
// as SuspendAccountModal's live warning banner) rather than a separate
// tracked flag — it reflects what's actually filled in right now.
export function TemplateActionsSidebar({ control, onSave, onPreview, onCancel }: TemplateActionsSidebarProps) {
  const templateName = useWatch({ control, name: "templateName" });
  const defaultSubject = useWatch({ control, name: "defaultSubject" });
  const message = useWatch({ control, name: "message" });

  const checklist = [
    { label: "Template Name set", done: Boolean(templateName?.trim()) },
    { label: "Default Subject Line set", done: Boolean(defaultSubject?.trim()) },
    { label: "Content verified", done: Boolean(message?.trim()) },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-text">Actions</h3>
        <Button type="button" onClick={onSave}>
          <Save className="h-4 w-4" />
          Save Template
        </Button>
        <Button type="button" variant="secondary" onClick={onPreview}>
          <Eye className="h-4 w-4" />
          Preview
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </Card>
      <Card className="flex flex-col gap-2">
        <h3 className="text-label text-text-muted">Review Checklist</h3>
        <ul className="flex flex-col gap-2">
          {checklist.map((item) => (
            <li key={item.label} className="flex items-center gap-2 text-sm">
              {item.done ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Circle className="h-4 w-4 text-text-muted" />}
              <span className={cn(item.done ? "text-text" : "text-text-muted")}>{item.label}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
