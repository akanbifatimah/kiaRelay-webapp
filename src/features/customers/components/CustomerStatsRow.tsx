import { StatTile } from "../../../components/StatTile";
import { customerOverviewStats } from "../data";

export function CustomerStatsRow() {
  const {
    totalCustomers,
    individualAccounts,
    companyAccounts,
    pendingVerification,
    activeAccounts,
    suspendedAccounts,
  } = customerOverviewStats;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      <StatTile
        label="Total Customers"
        value={totalCustomers.toLocaleString()}
        accent="primary"
        delta={{ kind: "up", value: "4.2%" }}
      />
      <StatTile label="Individual Accounts" value={individualAccounts.toLocaleString()} accent="neutral" />
      <StatTile label="Company Accounts" value={companyAccounts.toLocaleString()} accent="neutral" />
      <StatTile label="Pending Verification" value={pendingVerification.toLocaleString()} accent="primary" />
      <StatTile label="Active Accounts" value={activeAccounts.toLocaleString()} accent="success" />
      <StatTile label="Suspended Accounts" value={suspendedAccounts.toLocaleString()} accent="neutral" />
    </div>
  );
}
