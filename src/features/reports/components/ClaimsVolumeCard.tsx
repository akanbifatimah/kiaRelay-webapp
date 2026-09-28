import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../../../components/Card";
import { claimCategoryLabels } from "../../support/claimInvestigation";
import { CATEGORY_FILL, CLAIM_CATEGORIES, type CategoryVolumePoint } from "../claimsAnalytics";
import { ChartToolbar } from "./ChartToolbar";

type Category = (typeof CLAIM_CATEGORIES)[number];

interface ClaimsVolumeCardProps {
  data: CategoryVolumePoint[];
  bucketLabel: string;
  rangeText: string;
}

// Own category filter + export (TC-10, 2026-09-28).
export function ClaimsVolumeCard({ data, bucketLabel, rangeText }: ClaimsVolumeCardProps) {
  const [category, setCategory] = useState<Category | "all">("all");
  const shown = category === "all" ? CLAIM_CATEGORIES : [category];

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-text">Claims Filed by Category</h2>
          <p className="text-xs text-text-muted">{bucketLabel} volume, stacked by claim category</p>
        </div>
        <ChartToolbar
          exportLabel="Export claims volume"
          filters={[
            {
              label: "Category",
              value: category,
              onChange: (v) => setCategory(v as Category | "all"),
              options: [{ value: "all", label: "All Categories" }, ...CLAIM_CATEGORIES.map((c) => ({ value: c, label: claimCategoryLabels[c] }))],
            },
          ]}
          getExport={() => ({
            title: "Claims Filed by Category",
            subtitle: `${rangeText} · ${bucketLabel} · ${category === "all" ? "All categories" : claimCategoryLabels[category]}`,
            columns: [
              { header: bucketLabel === "Daily" ? "Day" : "Week", value: (p: CategoryVolumePoint) => p.label },
              ...shown.map((c) => ({ header: claimCategoryLabels[c], value: (p: CategoryVolumePoint) => p[c], align: "right" as const })),
              { header: "Total", value: (p: CategoryVolumePoint) => shown.reduce((sum, c) => sum + p[c], 0), align: "right" as const },
            ],
            rows: data,
          })}
        />
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={12} tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} />
            <Tooltip cursor={{ fill: "var(--color-bg)" }} contentStyle={{ borderRadius: 8, borderColor: "var(--color-border)", fontSize: 12 }} />
            <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
            {shown.map((c, index) => (
              <Bar key={c} dataKey={c} name={claimCategoryLabels[c]} stackId="claims" fill={CATEGORY_FILL[c]} radius={index === shown.length - 1 ? [3, 3, 0, 0] : undefined} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
