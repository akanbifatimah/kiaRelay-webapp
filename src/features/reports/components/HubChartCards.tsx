import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, TrendingUp } from "lucide-react";
import { Area, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../../../components/Card";
import { formatMoneyCompact, formatMoneyExact } from "../formatReport";
import { dailyDeliveryVolume, hubRevenueTrend } from "../reportsHub";
import { SEGMENTS, type RevenueSegment } from "../segments";

const axisTick = { fill: "var(--color-text-muted)", fontSize: 10 };
const tooltipStyle = { borderRadius: 8, borderColor: "var(--color-border)", fontSize: 12 };
const selectClasses = "rounded-md border border-border bg-surface px-2 py-1 text-xs text-text";

export function HubRevenueTrendCard() {
  const data = useMemo(() => hubRevenueTrend(), []);
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-text">
          <TrendingUp className="h-4 w-4 text-primary" />
          Revenue Trend
        </h2>
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sidebar" />Gross</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" />Net Recognized</span>
          <Link to="/reports/revenue" className="font-medium text-primary hover:underline">View report</Link>
        </div>
      </div>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="hubNetFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={20} tick={axisTick} />
            <YAxis tickLine={false} axisLine={false} tick={axisTick} tickFormatter={formatMoneyCompact} />
            <Tooltip formatter={(value) => formatMoneyExact(Number(value))} labelFormatter={(_, payload) => payload?.[0]?.payload?.fullLabel ?? ""} contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="net" name="Net Recognized" stroke="var(--color-primary)" strokeWidth={2} fill="url(#hubNetFill)" />
            <Line type="monotone" dataKey="gross" name="Gross" stroke="var(--color-sidebar)" strokeWidth={1.5} dot={{ r: 2.5, fill: "var(--color-surface)", stroke: "var(--color-sidebar)" }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

// "Tier" here is the revenue segment — the service tiers the ledger tracks.
export function DeliveryVolumeByDayCard() {
  const [days, setDays] = useState(7);
  const [tier, setTier] = useState<RevenueSegment | "all">("all");
  const data = useMemo(() => dailyDeliveryVolume(days, tier), [days, tier]);
  const total = data.reduce((sum, point) => sum + point.deliveries, 0);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-text">
          <BarChart3 className="h-4 w-4 text-primary" />
          Delivery Volume by Day
        </h2>
        <div className="flex items-center gap-2">
          <select aria-label="Period" value={days} onChange={(event) => setDays(Number(event.target.value))} className={selectClasses}>
            <option value={7}>Last 7 Days</option>
            <option value={14}>Last 14 Days</option>
            <option value={30}>Last 30 Days</option>
          </select>
          <select aria-label="Tier" value={tier} onChange={(event) => setTier(event.target.value as RevenueSegment | "all")} className={selectClasses}>
            <option value="all">All Tiers</option>
            {SEGMENTS.map((segment) => (
              <option key={segment.key} value={segment.key}>
                {segment.shortLabel}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="-mt-2 text-xs text-text-muted">
        <span className="font-mono font-semibold text-text">{total.toLocaleString()}</span> completed deliveries · peak day highlighted
      </p>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={8} tick={axisTick} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={axisTick} />
            <Tooltip cursor={{ fill: "var(--color-bg)" }} contentStyle={tooltipStyle} />
            <Bar dataKey="deliveries" name="Deliveries" radius={[3, 3, 0, 0]} maxBarSize={28}>
              {data.map((point, index) => (
                <Cell key={index} fill={point.isPeak ? "var(--color-primary)" : "var(--color-chart-bar)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
