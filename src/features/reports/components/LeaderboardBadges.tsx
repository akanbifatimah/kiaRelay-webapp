import { cn } from "../../../lib/cn";

export function RankBadge({ rank }: { rank: number }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 min-w-6 items-center justify-center rounded-md px-1 font-mono text-xs font-semibold",
        rank <= 3 ? "bg-success/10 text-success" : "text-text-muted",
      )}
    >
      #{rank}
    </span>
  );
}

export function IncidentBadge({ count }: { count: number }) {
  const tone = count === 0 ? "bg-success/10 text-success" : count <= 2 ? "bg-bg text-text" : "bg-danger/10 text-danger";
  return <span className={cn("inline-flex h-5 min-w-5 items-center justify-center rounded px-1 font-mono text-xs font-semibold", tone)}>{count}</span>;
}
