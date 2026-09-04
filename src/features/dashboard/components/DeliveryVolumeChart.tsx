import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../../../components/ChartCard";
import type { VolumePoint } from "../data";

export function DeliveryVolumeChart({ data }: { data: VolumePoint[] }) {
  return (
    <ChartCard title="Delivery Volume">
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
              tickFormatter={(value: number) => value.toLocaleString()}
            />
            <Tooltip />
            <Bar dataKey="orders" radius={[4, 4, 0, 0]}>
              {data.map((point) => (
                <Cell
                  key={point.label}
                  fill={point.highlighted ? "var(--color-primary)" : "var(--color-chart-bar)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
