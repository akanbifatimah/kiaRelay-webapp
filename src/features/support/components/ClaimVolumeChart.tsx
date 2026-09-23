import { Area, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../../../components/Card";
import { VOLUME_RANGES, type VolumePoint } from "../claimStats";

interface ClaimVolumeChartProps {
  data: VolumePoint[];
  range: number;
  onRangeChange: (days: number) => void;
}

const tick = { fill: "var(--color-text-muted)", fontSize: 12 };

// Incoming claims as the filled orange area, resolved as the dashed dark
// line — matching the screenshot's two-series look; both are real counts
// from the claims store (claimStats.ts), not a static series.
export function ClaimVolumeChart({ data, range, onRangeChange }: ClaimVolumeChartProps) {
  const label = VOLUME_RANGES.find((option) => option.days === range)?.label ?? "";
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-text">Claim Volume ({label})</h2>
        <select
          aria-label="Date range"
          value={range}
          onChange={(event) => onRangeChange(Number(event.target.value))}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text"
        >
          {VOLUME_RANGES.map((option) => (
            <option key={option.days} value={option.days}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <defs>
              <linearGradient id="claimIncomingFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={tick} minTickGap={16} />
            <YAxis tickLine={false} axisLine={false} tick={tick} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: 8, borderColor: "var(--color-border)", fontSize: 12 }} />
            <Legend verticalAlign="top" height={28} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            <Area
              type="monotone"
              dataKey="incoming"
              name="Incoming Claims"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#claimIncomingFill)"
              dot={{ r: 3, fill: "var(--color-surface)", stroke: "var(--color-primary)", strokeWidth: 2 }}
            />
            <Line type="monotone" dataKey="resolved" name="Resolved" stroke="var(--color-text)" strokeWidth={2} strokeDasharray="5 4" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
