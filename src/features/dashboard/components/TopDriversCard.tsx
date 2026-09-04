import { Card } from "../../../components/Card";
import { CardMenuButton } from "../../../components/CardMenuButton";
import { DataTable, type Column } from "../../../components/DataTable";
import { Avatar } from "../../../components/Avatar";
import { topDrivers, type TopDriver } from "../data";

const columns: Column<TopDriver>[] = [
  {
    header: "Driver",
    accessor: (row) => (
      <div className="flex items-center gap-2">
        <Avatar name={row.name} shape="square" size="sm" />
        <span>{row.name}</span>
      </div>
    ),
  },
  { header: "Deliveries", accessor: (row) => row.deliveries },
  {
    header: "Rating",
    accessor: (row) => <span className="font-medium text-success">{row.rating.toFixed(1)}</span>,
    align: "right",
  },
];

export function TopDriversCard() {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-label text-text-muted">Top Drivers</h2>
        <CardMenuButton />
      </div>
      <DataTable columns={columns} rows={topDrivers} rowKey={(row) => row.name} />
    </Card>
  );
}
