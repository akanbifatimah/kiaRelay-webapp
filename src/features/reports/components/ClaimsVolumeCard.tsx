import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../../../components/Card";
import { claimCategoryLabels } from "../../support/claimInvestigation";
import { CATEGORY_FILL, CLAIM_CATEGORIES, type CategoryVolumePoint } from "../claimsAnalytics";

export function ClaimsVolumeCard({ data, bucketLabel }: { data: CategoryVolumePoint[]; bucketLabel: string }) {
  return (
    <Card className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-text">Claims Filed by Category</h2>
        <p className="text-xs text-text-muted">{bucketLabel} volume, stacked by claim category</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={12} tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} />
            <Tooltip cursor={{ fill: "var(--color-bg)" }} contentStyle={{ borderRadius: 8, borderColor: "var(--color-border)", fontSize: 12 }} />
            <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
            {CLAIM_CATEGORIES.map((category, index) => (
              <Bar
                key={category}
                dataKey={category}
                name={claimCategoryLabels[category]}
                stackId="claims"
                fill={CATEGORY_FILL[category]}
                radius={index === CLAIM_CATEGORIES.length - 1 ? [3, 3, 0, 0] : undefined}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
