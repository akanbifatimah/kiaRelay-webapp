import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader";
import { FinanceStatTile } from "./components/FinanceStatTile";
import { OnDemandStatTile } from "./components/OnDemandStatTile";
import { PayoutRegisterSection } from "./components/PayoutRegisterSection";
import { OnDemandRequestsSection } from "./components/OnDemandRequestsSection";
import { driverPayoutStats, onDemandStat } from "./driverPayoutsOverview";

export function DriverPayoutsOverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <Link to="/finance" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Finance
      </Link>

      <PageHeader title="Driver Payouts" subtitle="Review and process the driver payout register, plus on-demand withdrawal requests." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {driverPayoutStats.map((stat) => (
          <FinanceStatTile key={stat.type} {...stat} />
        ))}
        <OnDemandStatTile value={onDemandStat.value} urgentCount={onDemandStat.urgentCount} />
      </div>

      <PayoutRegisterSection />
      <OnDemandRequestsSection />
    </div>
  );
}
