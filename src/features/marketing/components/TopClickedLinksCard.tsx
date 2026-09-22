import { Eye, ChevronDown, Truck } from "lucide-react";
import { Card } from "../../../components/Card";
import { cn } from "../../../lib/cn";
import type { EmailAdPreview, TopClickedLink } from "../emailResults";

interface TopClickedLinksCardProps {
  preview: EmailAdPreview;
  topLinks: TopClickedLink[];
}

export function TopClickedLinksCard({ preview, topLinks }: TopClickedLinksCardProps) {
  const totalClicks = topLinks.reduce((sum, link) => sum + link.clicks, 0);

  return (
    <Card className="grid grid-cols-1 gap-6 sm:grid-cols-[19rem_1fr]">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-text">
            <Eye className="h-4 w-4 text-text-muted" />
            What people saw
          </h3>
          {/* TODO: only one preview mode exists (the ad card below) — wire up
              a second mode (e.g. push notification) before this does anything. */}
          <button type="button" className="flex items-center gap-1 text-xs font-medium text-text-muted hover:text-text">
            Toggle preview
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mx-auto w-full max-w-56 overflow-hidden rounded-2xl border-4 border-sidebar bg-surface shadow-sm">
          <div className="flex flex-col gap-0.5 bg-sidebar px-3 py-2.5 text-white">
            <span className="flex items-center gap-1.5 text-sm font-bold">
              <Truck className="h-3.5 w-3.5" />
              KiaRelay
            </span>
            <span className="text-[9px] font-medium tracking-wide text-sidebar-fg">PRIORITY DISPATCH FLEET</span>
          </div>
          <div className="flex flex-col gap-2 p-3">
            <span className="w-fit rounded bg-tag-express-bg px-1.5 py-0.5 text-[9px] font-bold text-tag-express-fg">
              {preview.tagLabel}
            </span>
            <p className="text-xs font-semibold leading-snug text-text">{preview.headline}</p>
            <p className="text-[10px] leading-snug text-text-muted">{preview.description}</p>
            <button type="button" className="rounded-md bg-primary py-1.5 text-[10px] font-semibold text-primary-foreground">
              {preview.ctaLabel}
            </button>
            <button type="button" className="text-[10px] font-medium text-text underline">
              {preview.secondaryLabel}
            </button>
            <p className="border-t border-border pt-1.5 text-center text-[8px] text-text-muted">{preview.footer}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-label text-text-muted">Top 5 Clicked Links</h3>
          <span className="text-xs text-text-muted">Total {totalClicks.toLocaleString()} clicks registered</span>
        </div>
        <ul className="flex flex-col gap-4">
          {topLinks.map((link, i) => (
            <li key={link.label} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bg text-xs font-medium text-text-muted">
                    {i + 1}
                  </span>
                  <span className="text-text">{link.label}</span>
                </span>
                <span className="whitespace-nowrap text-text-muted">
                  <span className="font-semibold text-text">{link.clicks.toLocaleString()} clicks</span> · {link.pct}%
                </span>
              </div>
              <div className="ml-8.5 h-1.5 overflow-hidden rounded-full bg-border">
                <div
                  className={cn("h-full rounded-full", i === 0 ? "bg-primary" : "bg-text")}
                  style={{ width: `${link.pct}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
