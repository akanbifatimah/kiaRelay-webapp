import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/Card";
import { CardMenuButton } from "../../../components/CardMenuButton";
import { DataTable, type Column } from "../../../components/DataTable";
import { Avatar } from "../../../components/Avatar";
import { topCustomers, type TopCustomer } from "../data";

const columns: Column<TopCustomer>[] = [
  {
    header: "Client",
    accessor: (row) => (
      <div className="flex items-center gap-2">
        <Avatar name={row.name} shape="square" size="sm" />
        <span>{row.name}</span>
      </div>
    ),
  },
  { header: "Orders", accessor: (row) => row.orders },
  { header: "Revenue", accessor: (row) => row.revenue, align: "right" },
];

export function TopCustomersCard() {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-label text-text-muted">Top Customers</h2>
        <CardMenuButton />
      </div>
      <DataTable
        columns={columns}
        rows={topCustomers}
        rowKey={(row) => row.id}
        onRowClick={(row) => navigate(`/customers/${row.accountType}/${row.id}`)}
      />
    </Card>
  );
}
