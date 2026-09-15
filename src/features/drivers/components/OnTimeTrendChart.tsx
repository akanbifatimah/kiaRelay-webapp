import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../../../components/ChartCard";
import type { OnTimeTrendPoint } from "../driverPerformance";

// First LineChart in the app (every existing chart is Area/Bar) — same
// recharts + CSS-variable composition pattern as RevenueTrendChart, with a
// second dashed "Target" series.
export function OnTimeTrendChart({ data }: { data: OnTimeTrendPoint[] }) {
  return (
    <ChartCard title="On-Time Trend">
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
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
              tickFormatter={(value: number) => `${value}%`}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--color-primary)", strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="var(--color-text-muted)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
