import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, ExternalLink, type LucideIcon } from "lucide-react";
import { cn } from "../../../../lib/cn";

interface RowProps {
  icon: LucideIcon;
  label: string;
  detail?: string;
  /** Status text on the right ("Level 3 Complete"). */
  trailing?: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  tone?: "default" | "danger";
}

const rowClass = "flex w-full items-center gap-3 border-b border-border px-4 py-3.5 text-left last:border-0 hover:bg-bg";

/** Settings row, same as the app's ListRow: icon, label, detail, chevron. */
export function SettingsRow({ icon: Icon, label, detail, trailing, to, href, onClick, tone = "default" }: RowProps) {
  const danger = tone === "danger";
  const body = (
    <>
      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", danger ? "bg-danger/10" : "bg-bg")}>
        <Icon className={cn("h-4 w-4", danger ? "text-danger" : "text-sidebar")} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block text-sm", danger ? "font-medium text-danger" : "text-text")}>{label}</span>
        {detail && <span className="block truncate text-xs text-text-muted">{detail}</span>}
      </span>
      {trailing}
      {!danger && (href ? <ExternalLink className="h-4 w-4 text-text-muted" /> : <ChevronRight className="h-4 w-4 text-text-muted" />)}
    </>
  );
  if (to) return <Link to={to} className={rowClass}>{body}</Link>;
  if (href) return <a href={href} target="_blank" rel="noreferrer" className={rowClass}>{body}</a>;
  return <button type="button" onClick={onClick} className={rowClass}>{body}</button>;
}

export function SettingsGroup({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      {title && <h2 className="px-1 text-xs font-semibold uppercase tracking-wide text-text-muted">{title}</h2>}
      <div className="overflow-hidden rounded-xl border border-border bg-surface">{children}</div>
    </section>
  );
}

/** A settings sub-page: "Back to Settings", title, then the content. */
export function SettingsSubPage({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <Link to="/business/settings" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Settings
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-text">{title}</h1>
        {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
