import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../../../components/Card";
import { cn } from "../../../lib/cn";
import type { PerformanceTone } from "../data";
import type { EmailAreaResult } from "../emailResults";

const legendDot: Record<PerformanceTone, string> = { good: "bg-success", okay: "bg-warning", poor: "bg-danger" };
const legendLabel: Record<PerformanceTone, string> = { good: "Good", okay: "Okay", poor: "Ignored" };

interface EmailAreaBreakdownCardProps {
  areas: EmailAreaResult[];
}

// Real recharts grouped bar chart (Opened % / Clicked % per area), same
// two-series pattern as RevenueSnapshotChart — swapped in for the earlier
// custom CSS bubble layout. Tone (Good/Okay/Ignored) is a status, not a
// second color job for the same chart, so it stays out of the bars and
// lives in its own dot+label legend/list below, per the dataviz skill's
// "status colors ship with icon + label, never color alone" rule.
export function EmailAreaBreakdownCard({ areas }: EmailAreaBreakdownCardProps) {
  const data = areas.map((area) => ({ name: area.name, opened: area.openedPct, clicked: area.clickedPct }));

  return (
    <Card className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-text">How each area did</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
              tickFormatter={(value: number) => `${value}%`}
            />
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend formatter={(value) => (value === "opened" ? "Opened %" : "Clicked %")} />
            <Bar dataKey="opened" fill="var(--color-chart-bar)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="clicked" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 text-xs text-text-muted">
        {(["good", "okay", "poor"] as PerformanceTone[]).map((tone) => (
          <span key={tone} className="inline-flex items-center gap-1.5">
            <span className={cn("h-1.5 w-1.5 rounded-full", legendDot[tone])} />
            {legendLabel[tone]}
          </span>
        ))}
      </div>
      <ul className="flex flex-col divide-y divide-border">
        {areas.map((area) => (
          <li key={area.id} className="flex items-center justify-between py-2.5 text-sm">
            <div>
              <p className="font-medium text-text">{area.name}</p>
              <p className="text-xs text-text-muted">
                {area.openedPct}% opened · {area.clickedPct}% clicked
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-muted">{area.clicks} clicks</span>
              <span className={cn("h-2 w-2 rounded-full", legendDot[area.tone])} />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
