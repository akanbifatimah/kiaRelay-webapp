import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Card } from "../../../components/Card";

interface SettingsCardProps {
  title: string;
  subtitle?: string;
  /** Leading icon beside the title (Finance Settings' numbered sections). */
  icon?: LucideIcon;
  /** Operations Settings' orange dot + "SECTION 01" pill. */
  sectionNumber?: number;
  headerAside?: ReactNode;
  children: ReactNode;
}

export function SettingsCard({ title, subtitle, icon: Icon, sectionNumber, headerAside, children }: SettingsCardProps) {
  return (
    <Card className="flex flex-col gap-5 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-text">
            {sectionNumber !== undefined && <span className="h-2 w-2 rounded-full bg-primary" />}
            {Icon && <Icon className="h-4 w-4 text-text-muted" />}
            {title}
          </h2>
          {subtitle && <p className="mt-0.5 text-xs text-text-muted">{subtitle}</p>}
        </div>
        {sectionNumber !== undefined && (
          <span className="text-label shrink-0 rounded-full border border-border px-2.5 py-0.5 text-text-muted">Section {String(sectionNumber).padStart(2, "0")}</span>
        )}
        {headerAside}
      </div>
      {children}
    </Card>
  );
}
