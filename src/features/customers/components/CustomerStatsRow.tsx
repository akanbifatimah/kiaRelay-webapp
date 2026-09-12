import { StatTile } from "../../../components/StatTile";
import { customerOverviewStats } from "../data";
import type { CustomerAccountType } from "../data";

export function CustomerStatsRow({ accountType }: { accountType: CustomerAccountType }) {
  if (accountType === "company") {
    const { total, pendingVerification, active, suspended } = customerOverviewStats.company;
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile label="Total Company Customers" value={total.toLocaleString()} accent="primary" />
        <StatTile label="Pending Verification" value={pendingVerification.toLocaleString()} accent="primary" />
        <StatTile label="Active Accounts" value={active.toLocaleString()} accent="success" />
        <StatTile label="Suspended Accounts" value={suspended.toLocaleString()} accent="neutral" />
      </div>
    );
  }

  const { total, active, suspended } = customerOverviewStats.individual;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatTile label="Total Individual Customers" value={total.toLocaleString()} accent="primary" />
      <StatTile label="Active Accounts" value={active.toLocaleString()} accent="success" />
      <StatTile label="Suspended Accounts" value={suspended.toLocaleString()} accent="neutral" />
    </div>
  );
}
