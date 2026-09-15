import { CheckCircle2, ShieldAlert, Camera, Timer } from "lucide-react";
import { PerformanceHeroTile } from "./PerformanceHeroTile";
import { PerformanceMetricTile } from "./PerformanceMetricTile";
import { PerformanceTrendChart } from "./PerformanceTrendChart";
import { CustomerFeedbackCard } from "./CustomerFeedbackCard";
import { OperationalInsightCard } from "./OperationalInsightCard";
import { TodayActivityCard } from "./TodayActivityCard";
import { LastKnownLocationCard } from "./LastKnownLocationCard";
import { getPerformanceDetail } from "../driverPerformanceDetail";

const metricIcons = [CheckCircle2, ShieldAlert, Camera, Timer];

interface PerformanceDetailSectionProps {
  driverId: string;
  driverName: string;
  onViewFullActivity: () => void;
}

export function PerformanceDetailSection({ driverId, driverName, onViewFullActivity }: PerformanceDetailSectionProps) {
  const detail = getPerformanceDetail(driverId);
  const position =
    detail.lastKnownLat !== undefined && detail.lastKnownLng !== undefined
      ? { lat: detail.lastKnownLat, lng: detail.lastKnownLng }
      : undefined;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-4 lg:col-span-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:row-span-2">
            <PerformanceHeroTile
              onTimePct={detail.onTimePct}
              deltaPct={detail.onTimeDeltaPct}
              rating={detail.rating}
              deliveriesCount={detail.deliveriesCount}
            />
          </div>
          {detail.metrics.map((metric, index) => (
            <PerformanceMetricTile
              key={metric.label}
              icon={metricIcons[index % metricIcons.length]}
              label={metric.label}
              value={metric.value}
              qualifier={metric.qualifier}
            />
          ))}
        </div>
        <PerformanceTrendChart data={detail.trend} />
        <CustomerFeedbackCard
          driverId={driverId}
          driverName={driverName}
          reviews={detail.reviews}
          totalCount={detail.totalReviewCount}
        />
      </div>
      <div className="flex flex-col gap-4">
        <OperationalInsightCard
          driverName={driverName}
          percentileNote={detail.percentileNote}
          milesDrivenMtd={detail.milesDrivenMtd}
          milesDrivenMax={detail.milesDrivenMax}
          fuelEfficiencyMpg={detail.fuelEfficiencyMpg}
          fuelEfficiencyMax={detail.fuelEfficiencyMax}
          onTimePct={detail.onTimePct}
          rating={detail.rating}
          deliveriesCount={detail.deliveriesCount}
        />
        <TodayActivityCard entries={detail.todayActivity} onViewHistory={onViewFullActivity} />
        <LastKnownLocationCard isLive={detail.isLive} position={position} address={detail.lastKnownLocationAddress} />
      </div>
    </div>
  );
}
