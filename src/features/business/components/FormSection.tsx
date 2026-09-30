import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Card } from "../../../components/Card";

interface FormSectionProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}

/** Design's "Company Details" / "Primary Contact" card: icon + title, then fields. */
export function FormSection({ title, icon: Icon, children }: FormSectionProps) {
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="flex items-center gap-2 border-b border-border pb-3 text-lg font-semibold text-text">
        <Icon className="h-5 w-5 text-navy-brand" />
        {title}
      </h2>
      {children}
    </Card>
  );
}
