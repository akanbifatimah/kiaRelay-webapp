import type { ReactNode } from "react";

interface BrowserFrameProps {
  label: string;
  children: ReactNode;
}

// A decorative browser-chrome wrapper (traffic-light dots + address label) —
// used to frame the Newsletter Preview's rendered content.
export function BrowserFrame({ label, children }: BrowserFrameProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
      <div className="flex items-center gap-2 border-b border-border bg-bg px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        <span className="ml-2 rounded bg-surface px-2 py-0.5 text-xs text-text-muted">{label}</span>
      </div>
      <div className="bg-bg p-6">{children}</div>
    </div>
  );
}
