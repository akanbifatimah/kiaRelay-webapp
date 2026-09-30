import { useMemo } from "react";
import { Card } from "../../../../components/Card";
import { ExportMenuButton } from "../../../../components/ExportMenuButton";
import { PageHeader } from "../../../../components/PageHeader";
import { StatTile } from "../../../../components/StatTile";
import { formatMoney } from "../../deliveries/pricing";
import { spendByBranch, spendByMonth, type MonthSpend } from "../../deliveries/spend";
import { SpendChart } from "../components/SpendChart";
import { usePortalAccount } from "../usePortalAccount";
import { useNow, usePortalDeliveries } from "../usePortalData";

// Usage & Spend (2026-09-30, no web design — first pass): twelve-month trend
// and spend per branch, from the company's own deliveries.
export function SpendPage() {
  const account = usePortalAccount();
  const orders = usePortalDeliveries(account);
  const now = useNow(60_000);
  const months = useMemo(() => spendByMonth(orders, now, 12), [orders, now]);
  const branches = useMemo(() => spendByBranch(orders, now), [orders, now]);
  if (!account) return null;
  const current = months[months.length - 1];
  const previous = months[months.length - 2];
  const year = months.reduce((s, m) => s + m.total, 0);
  const delta = previous.total ? ((current.total - previous.total) / previous.total) * 100 : 0;
  const top = Math.max(1, ...branches.map((b) => b.total));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Usage & Spend" subtitle="Delivered and in-progress deliveries; cancelled ones aren't charged." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="This Month" value={formatMoney(current.total)} accent="primary" delta={previous.total ? { kind: delta >= 0 ? "up" : "down", value: `${Math.abs(delta).toFixed(0)}% vs ${previous.label}` } : undefined} />
        <StatTile label="Deliveries This Month" value={String(current.count)} />
        <StatTile label="Avg. per Delivery" value={formatMoney(current.count ? current.total / current.count : 0)} />
        <StatTile label="Last 12 Months" value={formatMoney(year)} accent="success" />
      </div>
      <Card className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-text">Monthly spend</h2>
          <ExportMenuButton
            label="Export monthly spend"
            getExport={() => ({
              title: `${account.company.legalName} monthly spend`,
              columns: [
                { header: "Month", value: (m: MonthSpend) => m.label },
                { header: "Deliveries", value: (m: MonthSpend) => m.count, align: "right" },
                { header: "Spend", value: (m: MonthSpend) => formatMoney(m.total), align: "right" },
              ],
              rows: months,
              footer: ["Total", months.reduce((s, m) => s + m.count, 0), formatMoney(year)],
            })}
          />
        </div>
        <SpendChart months={months} height={280} />
      </Card>
      <Card className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-text">Spend by branch</h2>
        {branches.length === 0 && <p className="text-sm text-text-muted">No deliveries yet.</p>}
        {branches.map((b) => (
          <div key={b.branch} className="flex flex-col gap-1">
            <div className="flex justify-between text-sm">
              <span className="text-text">{b.branch} <span className="text-text-muted">· {b.count} deliveries</span></span>
              <span className="font-semibold text-text">{formatMoney(b.total)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-bg">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${(b.total / top) * 100}%` }} />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
