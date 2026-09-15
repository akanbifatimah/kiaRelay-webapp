import { StatTile } from "../../../components/StatTile";
import { driverOverviewStats } from "../driverRoster";

export function DriverStatsRow() {
  const { totalDrivers, activeToday, onlineNow, pendingOnboarding, flaggedOrSuspended } = driverOverviewStats;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatTile label="Total Drivers" value={totalDrivers.toLocaleString()} accent="primary" />
      <StatTile
        label="Active Today"
        value={activeToday.toLocaleString()}
        accent="success"
        delta={{ kind: "increase", value: `${onlineNow} Online` }}
      />
      <StatTile label="Pending Onboarding" value={pendingOnboarding.toLocaleString()} accent="neutral" />
      <StatTile label="Flagged / Suspended" value={flaggedOrSuspended.toLocaleString()} accent="danger" />
    </div>
  );
}
