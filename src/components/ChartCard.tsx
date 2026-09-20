import type { ReactNode } from "react";
import { Card } from "./Card";
import { CardMenuButton } from "./CardMenuButton";

interface ChartCardProps {
  title: string;
  /** Replaces the default decorative CardMenuButton when provided (e.g. a granularity toggle). */
  headerActions?: ReactNode;
  children: ReactNode;
}

export function ChartCard({ title, headerActions, children }: ChartCardProps) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text">{title}</h2>
        {headerActions ?? <CardMenuButton />}
      </div>
      {children}
    </Card>
  );
}
