import { useMemo, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Pagination } from "../../components/Pagination";
import { useToast } from "../../components/toast/ToastContext";
import { BranchStatsRow } from "./components/BranchStatsRow";
import { BranchUsersFilterBar } from "./components/BranchUsersFilterBar";
import { BranchUsersTable } from "./components/BranchUsersTable";
import { BranchesSection } from "./components/BranchesSection";
import { AddBranchModal } from "./components/AddBranchModal";
import { customers } from "./data";
import { getCustomerDetail } from "./customerDetails";
import { getCompanyBranchesOverview, type Branch, type BranchUser, type BranchUserRole } from "./companyBranches";

const PAGE_SIZE = 3;

export function CompanyUsersBranchesPage() {
  const { accountType, id } = useParams<{ accountType: string; id: string }>();
  const { showToast } = useToast();
  const customer = customers.find((c) => c.id === id);
  const detail = customer ? getCustomerDetail(customer) : null;

  const overview = useMemo(() => (detail ? getCompanyBranchesOverview(detail) : null), [detail]);
  const [users, setUsers] = useState<BranchUser[]>(overview?.users ?? []);
  const [branches, setBranches] = useState<Branch[]>(overview?.branches ?? []);
  const [totalActiveHubs, setTotalActiveHubs] = useState(overview?.totalActiveHubs ?? 0);
  const [role, setRole] = useState<BranchUserRole | "all">("all");
  const [branchFilter, setBranchFilter] = useState<string | "all">("all");
  const [page, setPage] = useState(1);
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);

  if (!customer || !detail || !overview) {
    return <Navigate to={`/customers/${accountType ?? "company"}`} replace />;
  }

  const branchOptions = Array.from(new Set([...branches.map((b) => b.name), ...users.map((u) => u.branchAssignment)]));
  const filteredUsers = users.filter(
    (u) => (role === "all" || u.role === role) && (branchFilter === "all" || u.branchAssignment === branchFilter),
  );
  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function updateFilter<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  function handleAddBranch(branch: Branch) {
    setBranches((prev) => [...prev, branch]);
    setTotalActiveHubs((prev) => prev + 1);
    showToast("success", `${branch.name} has been added to the network.`);
  }

  function handleRemoveUser(user: BranchUser) {
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    showToast("success", `${user.name}'s access has been removed.`);
  }

  function handleUpdateBranch(branch: Branch) {
    setBranches((prev) => prev.map((b) => (b.id === branch.id ? branch : b)));
    showToast("success", `${branch.name} updated.`);
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={`/customers/${detail.accountType}/${detail.id}`}
        className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Profile
      </Link>

      <PageHeader
        title="Company Users & Branches"
        subtitle="Manage operational hubs, user access, and logistics across regional nodes."
        actions={
          <Button onClick={() => setIsAddBranchOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Branch
          </Button>
        }
      />

      <BranchStatsRow
        totalActiveHubs={totalActiveHubs}
        hubsDeltaLabel={overview.hubsDeltaLabel}
        globalDispatchRate={overview.globalDispatchRate}
        activeOperationalUsers={overview.activeOperationalUsers}
        operationalUserCap={overview.operationalUserCap}
        totalNetworkSpend={overview.totalNetworkSpend}
        networkSpendDeltaLabel={overview.networkSpendDeltaLabel}
      />

      <Card className="flex flex-col gap-4">
        <BranchUsersFilterBar
          role={role}
          onRoleChange={updateFilter(setRole)}
          branch={branchFilter}
          branchOptions={branchOptions}
          onBranchChange={updateFilter(setBranchFilter)}
          visibleCount={filteredUsers.length}
        />
        <BranchUsersTable rows={pageRows} onRemoveUser={handleRemoveUser} />
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={filteredUsers.length}
          pageSize={PAGE_SIZE}
          itemLabel="entries"
          onPageChange={setPage}
        />
      </Card>

      <BranchesSection branches={branches} onAdd={handleAddBranch} onUpdate={handleUpdateBranch} />

      {isAddBranchOpen && <AddBranchModal onClose={() => setIsAddBranchOpen(false)} onAdd={handleAddBranch} />}
    </div>
  );
}
