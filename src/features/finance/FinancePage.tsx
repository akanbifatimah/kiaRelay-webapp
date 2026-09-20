import { useState } from "react";
import { PageHeader } from "../../components/PageHeader";
import { FinanceDateRangeTabs } from "./components/FinanceDateRangeTabs";
import { FinanceStatTile } from "./components/FinanceStatTile";
import { RevenueSnapshotChart } from "./components/RevenueSnapshotChart";
import { QuickFinancialActionsCard } from "./components/QuickFinancialActionsCard";
import { UpcomingSettlementsCard } from "./components/UpcomingSettlementsCard";
import { RevenueByDeliveryTypeCard } from "./components/RevenueByDeliveryTypeCard";
import { CustomerSegmentBreakdownCard } from "./components/CustomerSegmentBreakdownCard";
import { RecentFinancialActivitySection } from "./components/RecentFinancialActivitySection";
import { financeByRange, buildCustomFinanceSnapshot } from "./financeSnapshots";
import { getDefaultCustomRange, type FinanceRangeKey } from "./data";

const rangeLabels: Record<FinanceRangeKey, string> = {
  today: "Today",
  week: "This Week",
  month: "This Month",
  quarter: "This Quarter",
};

export function FinancePage() {
  const [range, setRange] = useState<FinanceRangeKey | "custom">("month");
  const [customRange, setCustomRange] = useState(getDefaultCustomRange());

  const snapshot =
    range === "custom" ? buildCustomFinanceSnapshot(customRange.from, customRange.to) : financeByRange[range];
  const rangeLabel = range === "custom" ? `${customRange.from} to ${customRange.to}` : rangeLabels[range];
  const grossRevenueTotal = snapshot.stats.find((s) => s.type === "revenue")?.value ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Finance"
        subtitle="Monitor revenue, payouts, invoices, refunds and platform fees."
        actions={
          <FinanceDateRangeTabs
            value={range}
            customRange={customRange}
            onSelectPreset={setRange}
            onApplyCustom={(next) => {
              setCustomRange(next);
              setRange("custom");
            }}
          />
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {snapshot.stats.map((stat) => (
          <FinanceStatTile key={stat.type} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <RevenueSnapshotChart
            revenue={snapshot.revenue}
            grossRevenueTotal={grossRevenueTotal}
            netRevenueTotal={snapshot.netRevenueTotal}
            deltaAmount={snapshot.revenueDeltaAmount}
            deltaPct={snapshot.revenueDeltaPct}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <RevenueByDeliveryTypeCard rows={snapshot.deliveryTypes} />
            <CustomerSegmentBreakdownCard segments={snapshot.segments} note={snapshot.segmentNote} />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <QuickFinancialActionsCard snapshot={snapshot} rangeLabel={rangeLabel} />
          <UpcomingSettlementsCard settlements={snapshot.settlements} />
        </div>
      </div>

      <RecentFinancialActivitySection />
    </div>
  );
}
