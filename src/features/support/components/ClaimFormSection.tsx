import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Card } from "../../../components/Card";

export function ClaimFormSection({ step, title, icon: Icon, children }: { step: number; title: string; icon: LucideIcon; children: ReactNode }) {
  return (
    <Card className="flex flex-col gap-5">
      <h2 className="flex items-center gap-2 border-b border-border pb-3 text-sm font-semibold uppercase tracking-wide text-text">
        <Icon className="h-4 w-4" />
        {step}. {title}
      </h2>
      {children}
    </Card>
  );
}
