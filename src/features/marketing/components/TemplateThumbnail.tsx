import { AlertTriangle, Image as ImageIcon } from "lucide-react";
import type { Template } from "../templates";

interface TemplateThumbnailProps {
  template: Template;
}

// Hand-authored per template, matching the Templates Library screenshot's
// three distinct thumbnail styles (a dark strategy-update card, a masthead
// newsletter layout, a red alert card) — no screenshot shows a fourth
// template, so anything else falls back to a generic neutral mockup.
export function TemplateThumbnail({ template }: TemplateThumbnailProps) {
  if (template.id === "template-q3-logistics-update") {
    return (
      <div className="flex h-full w-full flex-col justify-center gap-2 bg-sidebar px-4">
        <p className="text-sm font-bold uppercase tracking-wide text-white">Q4 2023 Strategy Update</p>
        <p className="text-xs text-sidebar-fg">Growth & Innovation</p>
        <div className="mt-1 flex flex-col gap-1">
          <span className="h-1 w-3/4 rounded-full bg-white/20" />
          <span className="h-1 w-1/2 rounded-full bg-primary" />
        </div>
      </div>
    );
  }

  if (template.id === "template-monthly-fleet-dispatch") {
    return (
      <div className="flex h-full w-full items-center gap-3 bg-bg px-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-tag-overnight-bg text-tag-overnight-fg">
          <ImageIcon className="h-4 w-4" />
        </span>
        <div className="flex flex-1 flex-col gap-1.5">
          <span className="h-1.5 w-3/4 rounded-full bg-text" />
          <span className="h-1 w-full rounded-full bg-border" />
          <span className="h-1 w-2/3 rounded-full bg-border" />
        </div>
      </div>
    );
  }

  if (template.id === "template-urgent-route-advisory") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-tag-danger-bg px-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-danger text-white">
          <AlertTriangle className="h-4 w-4" />
        </span>
        <p className="text-xs font-bold text-tag-danger-fg">Route Advisory Issued</p>
        <span className="h-1 w-2/3 rounded-full bg-danger/30" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col justify-center gap-1.5 bg-bg px-4">
      <span className="h-1.5 w-2/3 rounded-full bg-text-muted" />
      <span className="h-1 w-full rounded-full bg-border" />
      <span className="h-1 w-1/2 rounded-full bg-border" />
    </div>
  );
}
