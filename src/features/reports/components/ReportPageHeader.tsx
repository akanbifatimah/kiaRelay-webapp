import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface ReportPageHeaderProps {
  title: string;
  subtitle?: string;
  /** Green "live" pill next to the title — e.g. "Ledger Synchronized". */
  statusLabel?: string;
  actions?: ReactNode;
  /** Sub-reports link back to the Reports hub; the hub itself omits this. */
  showBackLink?: boolean;
}

export function ReportStatusPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
      {label}
    </span>
  );
}

// PageHeader can't take the status pill beside the title (its title is a
// plain string), so reports get their own header — same layout otherwise.
export function ReportPageHeader({ title, subtitle, statusLabel, actions, showBackLink = true }: ReportPageHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      {showBackLink && (
        <Link to="/reports" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Reports
        </Link>
      )}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-heading-1 text-text">{title}</h1>
            {statusLabel && <ReportStatusPill label={statusLabel} />}
          </div>
          {subtitle && <p className="text-body mt-1 text-text-muted">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}
