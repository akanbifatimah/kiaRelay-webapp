import { StatTile } from "../../../components/StatTile";
import { DeliveryVolumeBarList } from "./DeliveryVolumeBarList";
import { RatingSpreadChart } from "./RatingSpreadChart";
import { OnTimeTrendChart } from "./OnTimeTrendChart";
import { TopDriverLeaderboardCard } from "./TopDriverLeaderboardCard";
import {
  performanceStats,
  deliveryVolume,
  ratingSpread,
  onTimeTrend,
  totalRankedDrivers,
  getTopDrivers,
} from "../driverPerformance";

export function PerformanceSection() {
  const topDrivers = getTopDrivers(3);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {performanceStats.map((stat) => (
          <StatTile
            key={stat.label}
            label={stat.label}
            value={stat.value}
            accent="success"
            delta={{ kind: "increase", value: stat.deltaLabel }}
            sparkline={stat.sparkline}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <DeliveryVolumeBarList categories={deliveryVolume} />
        <RatingSpreadChart data={ratingSpread} />
        <OnTimeTrendChart data={onTimeTrend} />
      </div>

      <TopDriverLeaderboardCard drivers={topDrivers} totalRanked={totalRankedDrivers} />
    </div>
  );
}
