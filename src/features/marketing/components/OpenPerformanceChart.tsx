import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../../../components/ChartCard";
import type { OpenPerformancePoint } from "../newsletterPerformance";

interface OpenPerformanceChartProps {
  data: OpenPerformancePoint[];
}

// Single-series bar chart, same pattern as DeliveryVolumeChart.
export function OpenPerformanceChart({ data }: OpenPerformanceChartProps) {
  return (
    <ChartCard title="Open Performance (48h)">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
            <Tooltip formatter={(value) => [`${value} opens`, "Opens"]} />
            <Bar dataKey="opens" fill="var(--color-chart-bar)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
