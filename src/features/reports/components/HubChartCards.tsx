import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, TrendingUp } from "lucide-react";
import { Area, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../../../components/Card";
import { formatMoneyCompact, formatMoneyExact } from "../formatReport";
import { dailyDeliveryVolume, hubRevenueTrend } from "../reportsHub";
import { SEGMENT_FILTER_OPTIONS, segmentMeta, type RevenueSegment } from "../segments";
import { ChartToolbar } from "./ChartToolbar";

const axisTick = { fill: "var(--color-text-muted)", fontSize: 10 };
const tooltipStyle = { borderRadius: 8, borderColor: "var(--color-border)", fontSize: 12 };
const SEGMENT_OPTIONS = SEGMENT_FILTER_OPTIONS;
const segmentText = (segment: RevenueSegment | "all") => (segment === "all" ? "All segments" : segmentMeta(segment).shortLabel);

export function HubRevenueTrendCard() {
  const [days, setDays] = useState<7 | 30 | 90>(30);
  const [segment, setSegment] = useState<RevenueSegment | "all">("all");
  const data = useMemo(() => hubRevenueTrend(days, segment), [days, segment]);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-text">
          <TrendingUp className="h-4 w-4 text-primary" />
          Revenue Trend
        </h2>
        <ChartToolbar
          exportLabel="Export revenue trend"
          filters={[
            { label: "Period", value: String(days), onChange: (v) => setDays(Number(v) as 7 | 30 | 90), options: [{ value: "7", label: "Last 7 Days" }, { value: "30", label: "Last 30 Days" }, { value: "90", label: "Last 90 Days" }] },
            { label: "Segment", value: segment, onChange: (v) => setSegment(v as RevenueSegment | "all"), options: SEGMENT_OPTIONS },
          ]}
          getExport={() => ({
            title: "Revenue Trend",
            subtitle: `Last ${days} days · ${segmentText(segment)}`,
            columns: [
              { header: days === 90 ? "Week" : "Date", value: (p) => p.fullLabel },
              { header: "Gross", value: (p) => formatMoneyExact(p.gross), align: "right" },
              { header: "Net Recognized", value: (p) => formatMoneyExact(p.net), align: "right" },
            ],
            rows: data,
          })}
        />
      </div>
      <div className="-mt-2 flex items-center gap-4 text-xs text-text-muted">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sidebar" />Gross</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" />Net Recognized</span>
        <Link to="/reports/revenue" className="ml-auto font-medium text-primary hover:underline">View report</Link>
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
        <ChartToolbar
          exportLabel="Export delivery volume"
          filters={[
            { label: "Period", value: String(days), onChange: (v) => setDays(Number(v)), options: [{ value: "7", label: "Last 7 Days" }, { value: "14", label: "Last 14 Days" }, { value: "30", label: "Last 30 Days" }] },
            { label: "Tier", value: tier, onChange: (v) => setTier(v as RevenueSegment | "all"), options: SEGMENT_OPTIONS.map((o) => (o.value === "all" ? { ...o, label: "All Tiers" } : o)) },
          ]}
          getExport={() => ({
            title: "Delivery Volume by Day",
            subtitle: `Last ${days} days · ${segmentText(tier)}`,
            columns: [
              { header: "Day", value: (p) => p.label },
              { header: "Completed Deliveries", value: (p) => p.deliveries, align: "right" },
              { header: "Peak", value: (p) => (p.isPeak ? "Yes" : "") },
            ],
            rows: data,
            footer: ["Total", total, ""],
          })}
        />
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
