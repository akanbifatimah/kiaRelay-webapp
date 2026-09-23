import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "../../../components/Card";
import { cn } from "../../../lib/cn";
import type { ClaimCategory } from "../claimInvestigation";
import type { CategorySlice } from "../claimStats";

// Same four-tone scheme as the screenshot's donut (navy / orange / slate /
// light gray), via theme tokens.
const FILL: Record<ClaimCategory, string> = {
  "transit-damage": "var(--color-sidebar)",
  loss: "var(--color-primary)",
  delay: "var(--color-sidebar-fg)",
  billing: "var(--color-border)",
};
const SWATCH: Record<ClaimCategory, string> = {
  "transit-damage": "bg-sidebar",
  loss: "bg-primary",
  delay: "bg-sidebar-fg",
  billing: "bg-border",
};

interface ClaimCategoryDonutProps {
  slices: CategorySlice[];
  active?: ClaimCategory;
  onSelect: (category: ClaimCategory) => void;
}

// Clicking a slice or legend entry filters the claims table below to that
// category (clicking the active one again clears it).
export function ClaimCategoryDonut({ slices, active, onSelect }: ClaimCategoryDonutProps) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-text">Category Distribution</h2>
      <div className="relative h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="label"
              innerRadius="62%"
              outerRadius="95%"
              paddingAngle={1}
              stroke="var(--color-surface)"
              onClick={(_data, index) => onSelect(slices[index].category)}
              className="cursor-pointer"
            >
              {slices.map((slice) => (
                <Cell key={slice.category} fill={FILL[slice.category]} opacity={active && active !== slice.category ? 0.35 : 1} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value} claims`, String(name)]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-text">{total}</span>
          <span className="text-xs text-text-muted">claims</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {slices.map((slice) => (
          <button
            key={slice.category}
            type="button"
            onClick={() => onSelect(slice.category)}
            className={cn("flex items-center gap-2 rounded px-1 py-0.5 text-left text-xs text-text-muted hover:bg-bg", active === slice.category && "font-semibold text-text")}
          >
            <span className={cn("h-2.5 w-2.5 shrink-0 rounded-sm", SWATCH[slice.category])} />
            {slice.label} ({slice.pct}%)
          </button>
        ))}
      </div>
    </Card>
  );
}
