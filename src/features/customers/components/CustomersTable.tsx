import { DataTable, type Column, type SortState } from "../../../components/DataTable";
import { Avatar } from "../../../components/Avatar";
import { DropdownMenu } from "../../../components/DropdownMenu";
import { AccountStatusBadge } from "./AccountStatusBadge";
import { VerificationBadge } from "./VerificationBadge";
import type { Customer } from "../data";

interface CustomersTableProps {
  rows: Customer[];
  onRowClick?: (row: Customer) => void;
  onReviewVerification: (row: Customer) => void;
  sort?: SortState;
  onSortChange?: (key: string) => void;
}

export function CustomersTable({ rows, onRowClick, onReviewVerification, sort, onSortChange }: CustomersTableProps) {
  const columns: Column<Customer>[] = [
    {
      header: "Customer",
      sortKey: "name",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.name} shape="square" size="sm" />
          <div>
            <p className="whitespace-nowrap font-semibold text-text">{row.name}</p>
            <p className="whitespace-nowrap text-xs text-text-muted">ID: {row.id}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Account Type",
      sortKey: "accountType",
      accessor: (row) => (row.accountType === "individual" ? "Individual" : "Company"),
    },
    { header: "Status", sortKey: "status", accessor: (row) => <AccountStatusBadge status={row.status} /> },
    {
      header: "Verification",
      sortKey: "verification",
      accessor: (row) => <VerificationBadge status={row.verification} />,
    },
    { header: "Orders", sortKey: "orders", accessor: (row) => row.orders.toLocaleString() },
    { header: "Last Activity", accessor: (row) => <span className="whitespace-nowrap">{row.lastActivity}</span> },
    {
      header: "Actions",
      accessor: (row) => (
        <DropdownMenu
          ariaLabel={`Actions for ${row.name}`}
          items={
            row.accountType === "company" && row.verification === "pending"
              ? [{ label: "Review Verification", onClick: () => onReviewVerification(row) }]
              : []
          }
        />
      ),
      align: "right",
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      rowKey={(row) => row.id}
      onRowClick={onRowClick}
      sort={sort}
      onSortChange={onSortChange}
    />
  );
}
