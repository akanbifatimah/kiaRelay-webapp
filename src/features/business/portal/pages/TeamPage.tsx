import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Building2, Plus } from "lucide-react";
import { Avatar } from "../../../../components/Avatar";
import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
import { ConfirmModal } from "../../../../components/ConfirmModal";
import { DataTable, type Column } from "../../../../components/DataTable";
import { DropdownMenu } from "../../../../components/DropdownMenu";
import { PageHeader } from "../../../../components/PageHeader";
import { useToast } from "../../../../components/toast/ToastContext";
import { cn } from "../../../../lib/cn";
import { branchUserName, type BranchUser } from "../../../customers/companyBranches";
import { companyBranchesOverviews } from "../../../customers/companyBranchesData";
import { setCompanyTeam } from "../../../customers/companyTeamStore";
import { usePortalAccount } from "../usePortalAccount";
import { ALL_BRANCHES, portalBranches, usePortalTeam } from "../usePortalData";
import { AddMemberModal } from "./AddMemberModal";

// Team & Branches (2026-09-30, no design — first pass). The same users admin
// sees under Company Users & Branches (shared companyTeamStore).
export function TeamPage() {
  const account = usePortalAccount();
  const team = usePortalTeam(account);
  const { showToast } = useToast();
  const [params, setParams] = useSearchParams();
  const [toggle, setToggle] = useState<BranchUser | null>(null);
  if (!account) return null;
  const adding = params.get("add") === "1";
  const branches = companyBranchesOverviews[account.id]?.branches ?? [];
  const isSelf = (m: BranchUser) => m.email.toLowerCase() === account.owner.email.toLowerCase();
  const save = (update: (t: BranchUser[]) => BranchUser[]) => setCompanyTeam(account.id, () => update(team));

  const columns: Column<BranchUser>[] = [
    { header: "Name", accessor: (m) => <div className="flex items-center gap-2"><Avatar name={branchUserName(m)} /><div><p className="font-medium text-text">{branchUserName(m)}{isSelf(m) && " (you)"}</p><p className="text-xs text-text-muted">{m.email}</p></div></div> },
    { header: "Role", accessor: (m) => <span className="capitalize">{m.role}</span> },
    { header: "Branch", accessor: (m) => <span className="whitespace-nowrap">{m.branchAssignment}</span> },
    { header: "Status", accessor: (m) => <span className={cn("text-sm font-medium", m.status === "active" ? "text-success" : "text-text-muted")}>{m.status === "active" ? "Active" : "Inactive"}</span> },
    { header: "Last Active", accessor: (m) => <span className="whitespace-nowrap">{m.lastActive}</span> },
    {
      header: "Actions",
      align: "right",
      accessor: (m) => <DropdownMenu ariaLabel={`Actions for ${branchUserName(m)}`} items={isSelf(m) ? [] : [{ label: m.status === "active" ? "Deactivate" : "Reactivate", tone: m.status === "active" ? "danger" : undefined, onClick: () => setToggle(m) }]} />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Team & Branches" subtitle="Who can book and see your company's deliveries." actions={<Button onClick={() => setParams({ add: "1" })} className="flex items-center gap-2"><Plus className="h-4 w-4" /> Add Member</Button>} />
      <Card>
        <DataTable columns={columns} rows={team} rowKey={(m) => m.id} />
      </Card>
      <h2 className="text-lg font-bold text-text">Branches</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {(branches.length ? branches : [{ id: "hq", name: "HQ", city: account.company.city, state: account.company.state, hubCode: "HQ", primaryContact: `${account.owner.firstName} ${account.owner.lastName}` }]).map((b) => (
          <Card key={b.id} className="flex flex-col gap-1">
            <Building2 className="h-5 w-5 text-sidebar" />
            <p className="font-semibold text-text">{b.name}</p>
            <p className="text-xs text-text-muted">{b.hubCode} · {b.city}, {b.state}</p>
            <p className="text-xs text-text-muted">Contact: {b.primaryContact}</p>
          </Card>
        ))}
      </div>
      <p className="text-sm text-text-muted">To add or change a branch, contact your KiaRelay account manager.</p>
      {adding && (
        <AddMemberModal
          branches={[...portalBranches(account), ALL_BRANCHES]}
          existing={team}
          onClose={() => setParams({})}
          onAdd={(member) => {
            save((t) => [...t, { ...member, id: `bu-${Date.now()}`, status: "active", lastActive: "Invite sent" }]);
            setParams({});
            showToast("success", `Invite sent to ${member.email}.`);
          }}
        />
      )}
      {toggle && (
        <ConfirmModal
          title={`${toggle.status === "active" ? "Deactivate" : "Reactivate"} ${branchUserName(toggle)}?`}
          message={toggle.status === "active" ? "They'll lose access to book and view company deliveries." : "They'll regain their previous access."}
          confirmLabel={toggle.status === "active" ? "Deactivate" : "Reactivate"}
          tone={toggle.status === "active" ? "danger" : "default"}
          onCancel={() => setToggle(null)}
          onConfirm={() => {
            save((t) => t.map((m) => (m.id === toggle.id ? { ...m, status: m.status === "active" ? "inactive" : "active" } : m)));
            setToggle(null);
          }}
        />
      )}
    </div>
  );
}
