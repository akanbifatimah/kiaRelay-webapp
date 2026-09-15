import { useState } from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/Card";
import { DataTable, type Column } from "../../../components/DataTable";
import { Avatar } from "../../../components/Avatar";
import { DropdownMenu } from "../../../components/DropdownMenu";
import { FullRankingModal } from "./FullRankingModal";
import { getRankedDrivers } from "../driverPerformance";
import type { DriverRecord } from "../driverRoster";

function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface TopDriverLeaderboardCardProps {
  drivers: DriverRecord[];
  totalRanked: number;
}

// Mirrors RecentOrdersCard's "card + DataTable + link" shape, but the link
// sits below the table as a footer instead of the card header — this is the
// leaderboard's own layout, not a full Pagination (per the screenshot).
export function TopDriverLeaderboardCard({ drivers, totalRanked }: TopDriverLeaderboardCardProps) {
  const navigate = useNavigate();
  const [isViewingAll, setIsViewingAll] = useState(false);

  const columns: Column<DriverRecord & { rank: number }>[] = [
    { header: "Rank", accessor: (row) => <span className="font-medium text-text-muted">#{row.rank}</span> },
    {
      header: "Driver",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.name} size="sm" />
          <span className="whitespace-nowrap font-medium text-text">{row.name}</span>
        </div>
      ),
    },
    {
      header: "Rating",
      accessor: (row) => (
        <span className="inline-flex items-center gap-1 text-text">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
          {row.rating.toFixed(2)}
        </span>
      ),
    },
    { header: "Deliveries", accessor: (row) => row.deliveries.toLocaleString() },
    { header: "On-Time", accessor: (row) => `${row.onTimeRate}%` },
    { header: "Earnings", accessor: (row) => formatCurrency(row.earnings) },
    {
      header: "",
      align: "right",
      accessor: (row) => (
        <DropdownMenu
          ariaLabel={`Actions for ${row.name}`}
          items={[{ label: "View Profile", onClick: () => navigate(`/drivers/${row.id}`) }]}
        />
      ),
    },
  ];

  const rows = drivers.map((driver, index) => ({ ...driver, rank: index + 1 }));

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-text">Top Driver Leaderboard</h2>
      <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} />
      <button
        type="button"
        onClick={() => setIsViewingAll(true)}
        className="self-center text-sm font-medium text-primary hover:underline"
      >
        View Full Ranking ({totalRanked.toLocaleString()} Drivers)
      </button>

      {isViewingAll && (
        <FullRankingModal
          drivers={getRankedDrivers().map((driver, index) => ({ ...driver, rank: index + 1 }))}
          onClose={() => setIsViewingAll(false)}
        />
      )}
    </Card>
  );
}
