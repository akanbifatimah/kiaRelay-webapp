import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BarChart3, PieChart, SearchCheck } from "lucide-react";
import { ReportPageHeader } from "./components/ReportPageHeader";
import { ReportRangeTabs } from "./components/ReportRangeTabs";
import { ReportStatCard } from "./components/ReportStatCard";
import { CustomerDirectoryCard } from "./components/CustomerDirectoryCard";
import { AccountScorecardPanel } from "./components/AccountScorecardPanel";
import { DEFAULT_RANGE, previousBounds, rangeBounds, rangeLabel, type ReportRange } from "./reportRange";
import { accountsForRange, summarizeCohort } from "./customerPerformance";
import { formatDeltaPct, formatMoney } from "./formatReport";

export function CustomerPerformancePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [range, setRange] = useState<ReportRange>(DEFAULT_RANGE);
  const bounds = useMemo(() => rangeBounds(range), [range]);
  const accounts = useMemo(() => accountsForRange(bounds), [bounds]);
  const current = useMemo(() => summarizeCohort(accounts), [accounts]);
  const previous = useMemo(() => summarizeCohort(accountsForRange(previousBounds(bounds), 1)), [bounds]);

  // ?account=ID opens that scorecard — the Reports hub's Top 5 Customers
  // links here, and it keeps an open scorecard shareable/refresh-safe.
  const openAccount = accounts.find((account) => account.id === searchParams.get("account"));
  const perWeek = (orders: number, count: number) => (count === 0 ? 0 : orders / count / Math.max(1, bounds.days / 7));
  const frequency = perWeek(current.orders, current.accounts);
  const claimDelta = current.claimRate - previous.claimRate;

  return (
    <div className="flex flex-col gap-6">
      <ReportPageHeader
        title="Customer Performance"
        subtitle="Account-level volume, spend, delivery reliability and claim exposure."
        actions={<ReportRangeTabs value={range} onChange={setRange} />}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <ReportStatCard
          label="Total Spend"
          hint={`${current.orders.toLocaleString()} orders · ${rangeLabel(range)}`}
          value={formatMoney(current.spend)}
          delta={formatDeltaPct(current.spend, previous.spend)}
          icon={<SearchCheck className="h-4 w-4" />}
        />
        <ReportStatCard
          label="Order Frequency"
          hint="Avg orders per account per week"
          value={frequency.toFixed(1)}
          unit="Dispatches / Wk"
          delta={formatDeltaPct(frequency, perWeek(previous.orders, previous.accounts))}
          icon={<BarChart3 className="h-4 w-4" />}
        />
        <ReportStatCard
          label="Claim Rate by Segment"
          hint="Dispute & damage incidence, order-weighted"
          value={`${current.claimRate.toFixed(2)}%`}
          delta={{
            label: `${claimDelta > 0 ? "+" : ""}${claimDelta.toFixed(2)}% vs prior`,
            direction: Math.abs(claimDelta) < 0.005 ? "flat" : claimDelta > 0 ? "up" : "down",
            invert: true,
          }}
          icon={<PieChart className="h-4 w-4" />}
        />
      </div>

      <CustomerDirectoryCard
        accounts={accounts}
        rangeText={rangeLabel(range)}
        onOpenAccount={(account) => setSearchParams({ account: account.id })}
      />

      {openAccount && <AccountScorecardPanel account={openAccount} rangeText={rangeLabel(range)} onClose={() => setSearchParams({})} />}
    </div>
  );
}
