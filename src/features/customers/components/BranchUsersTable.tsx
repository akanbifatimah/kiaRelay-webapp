import { DataTable, type Column } from "../../../components/DataTable";
import { Avatar } from "../../../components/Avatar";
import { DropdownMenu } from "../../../components/DropdownMenu";
import { BranchRoleBadge } from "./BranchRoleBadge";
import type { BranchUser } from "../companyBranches";

interface BranchUsersTableProps {
  rows: BranchUser[];
  onRemoveUser: (user: BranchUser) => void;
}

export function BranchUsersTable({ rows, onRemoveUser }: BranchUsersTableProps) {
  const columns: Column<BranchUser>[] = [
    {
      header: "Name & Identity",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.name} />
          <div>
            <p className="whitespace-nowrap font-medium text-text">{row.name}</p>
            <p className="whitespace-nowrap text-xs text-text-muted">{row.email}</p>
          </div>
        </div>
      ),
    },
    { header: "Role", accessor: (row) => <BranchRoleBadge role={row.role} /> },
    { header: "Branch Assignment", accessor: (row) => <span className="whitespace-nowrap">{row.branchAssignment}</span> },
    {
      header: "Status",
      accessor: (row) => (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium">
          <span className={`h-1.5 w-1.5 rounded-full ${row.status === "active" ? "bg-success" : "bg-text-muted"}`} />
          <span className={row.status === "active" ? "text-success" : "text-text-muted"}>
            {row.status === "active" ? "Active" : "Inactive"}
          </span>
        </span>
      ),
    },
    { header: "Last Active", accessor: (row) => <span className="whitespace-nowrap">{row.lastActive}</span> },
    {
      header: "Actions",
      accessor: (row) => (
        <DropdownMenu
          ariaLabel={`Actions for ${row.name}`}
          items={[{ label: "Remove Access", tone: "danger", onClick: () => onRemoveUser(row) }]}
        />
      ),
      align: "right",
    },
  ];

  return <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} />;
}
