import { useState } from "react";
import { PageHeader } from "../../components/PageHeader";
import { StatTile } from "../../components/StatTile";
import { RevenueTrendChart } from "./components/RevenueTrendChart";
import { DeliveryVolumeChart } from "./components/DeliveryVolumeChart";
import { TopCustomersCard } from "./components/TopCustomersCard";
import { TopDriversCard } from "./components/TopDriversCard";
import { DateRangeTabs } from "./components/DateRangeTabs";
import { buildCustomSnapshot, getDefaultCustomRange, type DateRangeKey } from "./data";
import { dashboardByRange } from "./dashboardSnapshots";

export function DashboardPage() {
  const [range, setRange] = useState<DateRangeKey>("today");
  const [customRange, setCustomRange] = useState(getDefaultCustomRange());

  const snapshot =
    range === "custom" ? buildCustomSnapshot(customRange.from, customRange.to) : dashboardByRange[range];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        subtitle="Real-time logistics performance and financial metrics."
        actions={
          <DateRangeTabs
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
      <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {snapshot.stats.map((stat) => (
          <StatTile key={stat.label} {...stat} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RevenueTrendChart data={snapshot.revenueTrend} />
        <DeliveryVolumeChart data={snapshot.deliveryVolume} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TopCustomersCard />
        <TopDriversCard />
      </div>
    </div>
  );
}
