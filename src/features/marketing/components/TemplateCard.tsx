import { Clock, Pencil, Copy, Mail, Newspaper } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/Button";
import { Tooltip } from "../../../components/Tooltip";
import { cn } from "../../../lib/cn";
import type { Template, TemplateType } from "../templates";
import { TemplateThumbnail } from "./TemplateThumbnail";

// Solid white chip (not the tinted tag-bg tokens) so it stays legible over
// each thumbnail's own background color.
const tagClasses: Record<TemplateType, string> = {
  email: "bg-surface text-tag-freight-fg shadow-sm",
  newsletter: "bg-surface text-tag-overnight-fg shadow-sm",
};

const tagIcon: Record<TemplateType, typeof Mail> = { email: Mail, newsletter: Newspaper };
const tagLabel: Record<TemplateType, string> = { email: "Email", newsletter: "Newsletter" };

interface TemplateCardProps {
  template: Template;
  onDuplicate: (template: Template) => void;
}

export function TemplateCard({ template, onDuplicate }: TemplateCardProps) {
  const navigate = useNavigate();
  const TagIcon = tagIcon[template.type];

  return (
    // Plain styled wrapper, not the shared Card — its baked-in p-5 would
    // conflict with the edge-to-edge thumbnail this needs (same
    // class-ordering issue CLAUDE.md flags for Button overrides).
    <div className="flex flex-col gap-3 overflow-hidden rounded-(--radius-card) border border-border bg-surface shadow-sm">
      <div className="relative h-28 w-full overflow-hidden">
        <span
          className={cn(
            "absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            tagClasses[template.type],
          )}
        >
          <TagIcon className="h-3 w-3" />
          {tagLabel[template.type]}
        </span>
        <TemplateThumbnail template={template} />
      </div>
      <div className="flex flex-col gap-2 px-4 pb-4">
        <h3 className="text-sm font-semibold text-text">{template.name}</h3>
        <p className="text-xs text-text-muted">{template.description}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <Clock className="h-3 w-3" />
            {template.updatedLabel}
          </span>
          <div className="flex items-center gap-2">
            <Tooltip label="Edit template">
              <button
                type="button"
                aria-label="Edit template"
                onClick={() => navigate("/marketing/templates/new", { state: { templateId: template.id } })}
                className="text-text-muted hover:text-text"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </Tooltip>
            <Tooltip label="Duplicate template">
              <button
                type="button"
                aria-label="Duplicate template"
                onClick={() => onDuplicate(template)}
                className="text-text-muted hover:text-text"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </Tooltip>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                const target = template.type === "newsletter" ? "/marketing/newsletters/new" : "/marketing/emails/new";
                navigate(target, { state: { templateId: template.id } });
              }}
            >
              Use
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
