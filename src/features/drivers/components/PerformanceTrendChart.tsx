import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../../../components/ChartCard";
import type { PerformanceTrendPoint } from "../driverPerformanceDetail";

// Same recharts + CSS-variable composition as OnTimeTrendChart (fleet-wide) —
// its own file since the series here are different (On-Time % vs Efficiency
// Score over 6 months, not Actual vs Target).
export function PerformanceTrendChart({ data }: { data: PerformanceTrendPoint[] }) {
  return (
    <ChartCard title="Performance Trend (Last 6 Months)">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid vertical={false} stroke="var(--color-border)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="onTimePct"
              name="On-Time %"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--color-primary)", strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="efficiencyScore"
              name="Efficiency Score"
              stroke="var(--color-info)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--color-info)", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
