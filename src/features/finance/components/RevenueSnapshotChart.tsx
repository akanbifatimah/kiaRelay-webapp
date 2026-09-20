import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../../../components/ChartCard";
import { cn } from "../../../lib/cn";
import type { RevenueSnapshotSeries } from "../data";

type Granularity = "daily" | "weekly" | "monthly";

const granularities: { key: Granularity; label: string }[] = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
];

function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

interface RevenueSnapshotChartProps {
  title?: string;
  revenue: RevenueSnapshotSeries;
  netRevenueTotal: number;
  grossRevenueTotal: number;
  deltaAmount: number;
  deltaPct: number;
}

// Grouped Gross-vs-Net bar chart — the one chart on this page without an
// existing single-series precedent to lean on (DeliveryVolumeChart is
// single-series); two <Bar>s sharing categories is a straightforward
// recharts extension of the same CSS-var-driven pattern used everywhere else.
// Reused as-is by both the Finance dashboard ("Revenue Snapshot") and the
// Revenue page ("Revenue Trend") — same chart, different card title.
export function RevenueSnapshotChart({
  title = "Revenue Snapshot",
  revenue,
  netRevenueTotal,
  grossRevenueTotal,
  deltaAmount,
  deltaPct,
}: RevenueSnapshotChartProps) {
  const [granularity, setGranularity] = useState<Granularity>("daily");
  const data = revenue[granularity];

  return (
    <ChartCard
      title={title}
      headerActions={
        <div className="flex items-center gap-1 rounded-lg border border-border bg-bg p-1">
          {granularities.map((g) => (
            <button
              key={g.key}
              type="button"
              onClick={() => setGranularity(g.key)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                granularity === g.key ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text",
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
      }
    >
      <div className="flex flex-wrap items-center gap-6">
        <div>
          <p className="text-label text-text-muted">Gross Revenue</p>
          <p className="text-xl font-semibold text-text">{formatCurrency(grossRevenueTotal)}</p>
        </div>
        <div>
          <p className="text-label text-text-muted">Net Revenue</p>
          <p className="text-xl font-semibold text-text">{formatCurrency(netRevenueTotal)}</p>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-success">
          <ArrowUp className="h-3.5 w-3.5" />+{formatCurrency(deltaAmount)} ({deltaPct}%) vs Previous Period
        </span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid vertical={false} stroke="var(--color-border)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
              tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`}
            />
            <Tooltip />
            <Legend formatter={(value) => (value === "gross" ? "Gross Revenue" : "Net Revenue")} />
            <Bar dataKey="gross" fill="var(--color-chart-bar)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="net" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
