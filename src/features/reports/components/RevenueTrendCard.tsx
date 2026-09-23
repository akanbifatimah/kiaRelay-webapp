import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipContentProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { Card } from "../../../components/Card";
import { formatMoneyCompact, formatMoneyExact } from "../formatReport";
import type { TrendPoint } from "../revenueAggregates";

interface DotProps {
  cx?: number;
  cy?: number;
  payload?: TrendPoint;
}

// Hollow ring per period, filled orange on the peak one — the design's
// dot-plot look (no connecting line; stroke="none" on the Line itself).
function TrendDot({ cx, cy, payload }: DotProps) {
  if (cx === undefined || cy === undefined) return null;
  return payload?.isPeak ? (
    <circle cx={cx} cy={cy} r={4.5} fill="var(--color-primary)" />
  ) : (
    <circle cx={cx} cy={cy} r={4} fill="var(--color-surface)" stroke="var(--color-text)" strokeWidth={1.5} />
  );
}

function TrendTooltip({ active, payload }: TooltipContentProps<ValueType, NameType>) {
  const point = payload?.[0]?.payload as TrendPoint | undefined;
  if (!active || !point) return null;
  return (
    <div className="rounded-md bg-sidebar px-3 py-2 text-white shadow-lg">
      <div className="flex items-center justify-between gap-6">
        <span className="text-xs text-sidebar-fg">{point.fullLabel}</span>
        {point.isPeak && <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold text-primary">Peak Demand</span>}
      </div>
      <p className="mt-1 whitespace-nowrap font-mono text-xs tabular-nums">
        Gross: <span className="font-semibold">{formatMoneyExact(point.gross)}</span>
        <span className="mx-2 text-sidebar-fg">|</span>
        <span className="text-primary">Net: {formatMoneyExact(point.net)}</span>
        <span className="mx-2 text-sidebar-fg">|</span>
        <span className="text-primary">Dem: {formatMoneyExact(point.demurrage)}</span>
      </p>
    </div>
  );
}

export function RevenueTrendCard({ data }: { data: TrendPoint[] }) {
  const peakLabel = data.find((point) => point.isPeak)?.label;
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-text">Revenue Trend</h2>
        <span className="rounded bg-bg px-2 py-0.5 text-xs text-text-muted">Real-time Recognition</span>
      </div>
      {data.length === 0 ? (
        <p className="py-16 text-center text-sm text-text-muted">No recognized revenue in this range.</p>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: "var(--color-border)" }}
                interval="preserveStartEnd"
                minTickGap={16}
                tick={({ x, y, payload }) => (
                  <text
                    x={x}
                    y={Number(y) + 12}
                    textAnchor="middle"
                    fontSize={10}
                    fontFamily="monospace"
                    fontWeight={payload.value === peakLabel ? 700 : 400}
                    fill={payload.value === peakLabel ? "var(--color-primary)" : "var(--color-text-muted)"}
                  >
                    {payload.value}
                  </text>
                )}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={52}
                tick={{ fill: "var(--color-text-muted)", fontSize: 10, fontFamily: "monospace" }}
                tickFormatter={formatMoneyCompact}
              />
              <Tooltip content={TrendTooltip} cursor={{ stroke: "var(--color-primary)", strokeDasharray: "3 3" }} />
              <Line
                type="monotone"
                dataKey="gross"
                stroke="none"
                dot={<TrendDot />}
                activeDot={{ r: 6, fill: "var(--color-primary)", stroke: "var(--color-surface)", strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
