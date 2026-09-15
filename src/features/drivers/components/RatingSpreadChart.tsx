import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../../../components/ChartCard";
import type { RatingBucket } from "../driverPerformance";

// Same recharts + CSS-variable pattern as DeliveryVolumeChart (dashboard) —
// a rotating tag-color palette gives each bucket visual distinction.
const palette = [
  "var(--color-tag-standard-fg)",
  "var(--color-tag-freight-fg)",
  "var(--color-tag-express-fg)",
  "var(--color-tag-overnight-fg)",
  "var(--color-tag-healthcare-fg)",
];

export function RatingSpreadChart({ data }: { data: RatingBucket[] }) {
  return (
    <ChartCard title="Rating Spread">
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
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((bucket, index) => (
                <Cell key={bucket.label} fill={palette[index % palette.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
