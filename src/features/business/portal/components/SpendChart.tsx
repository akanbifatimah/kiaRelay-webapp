import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatMoney } from "../../deliveries/pricing";
import type { MonthSpend } from "../../deliveries/spend";

/** Monthly spend bars; the current month is highlighted. */
export function SpendChart({ months, height = 240 }: { months: MonthSpend[]; height?: number }) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={months}>
          <CartesianGrid vertical={false} stroke="var(--color-border)" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} width={56} tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} tickFormatter={(v: number) => `$${Math.round(v / 100) / 10}k`} />
          <Tooltip formatter={(value) => [formatMoney(Number(value)), "Spend"]} cursor={{ fill: "var(--color-bg)" }} />
          <Bar dataKey="total" radius={[4, 4, 0, 0]}>
            {months.map((m, i) => (
              <Cell key={m.key} fill={i === months.length - 1 ? "var(--color-primary)" : "var(--color-chart-bar)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
