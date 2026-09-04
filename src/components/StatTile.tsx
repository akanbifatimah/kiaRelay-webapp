import { ArrowUp, ArrowDown, Plus } from "lucide-react";
import { Card } from "./Card";
import { CardMenuButton } from "./CardMenuButton";
import { cn } from "../lib/cn";

export type Accent = "primary" | "success" | "neutral";
export type DeltaKind = "up" | "down" | "increase";

const accentText: Record<Accent, string> = {
  primary: "text-primary",
  success: "text-success",
  neutral: "text-text",
};

const accentBorder: Record<Accent, string> = {
  primary: "border-l-4 border-l-primary",
  success: "border-l-4 border-l-success",
  neutral: "border-l-4 border-l-text",
};

const deltaIcon: Record<DeltaKind, typeof ArrowUp> = {
  up: ArrowUp,
  down: ArrowDown,
  increase: Plus,
};

export interface StatDelta {
  kind: DeltaKind;
  value?: string;
}

interface StatTileProps {
  label: string;
  value: string;
  accent?: Accent;
  delta?: StatDelta;
}

export function StatTile({ label, value, accent = "neutral", delta }: StatTileProps) {
  const DeltaIcon = delta ? deltaIcon[delta.kind] : null;
  const [firstWord, ...restWords] = label.split(" ");

  return (
    <Card className={cn("flex h-full flex-col gap-3", accentBorder[accent])}>
      <div className="flex items-start justify-between gap-2">
        <span className={cn("text-label min-w-0 flex-1", accentText[accent])}>
          {firstWord}
          <br />
          {restWords.join(" ")}
        </span>
        <CardMenuButton />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-text">{value}</span>
        {DeltaIcon && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              delta?.kind === "down" ? "text-danger" : "text-success",
            )}
          >
            <DeltaIcon className="h-3 w-3" />
            {delta?.value}
          </span>
        )}
      </div>
    </Card>
  );
}
