import { StatTile } from "../../../components/StatTile";

interface CustomerOrderStatsRowProps {
  totalOrders: number;
  inProgress: number;
  expressUsed: number;
  ltv: string;
}

export function CustomerOrderStatsRow({ totalOrders, inProgress, expressUsed, ltv }: CustomerOrderStatsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatTile label="Total Orders" value={totalOrders.toLocaleString()} accent="primary" />
      <StatTile label="In Progress" value={String(inProgress).padStart(2, "0")} accent="neutral" />
      <StatTile label="Express Used" value={String(expressUsed)} accent="success" />
      <StatTile label="LTV" value={ltv} accent="primary" />
    </div>
  );
}
