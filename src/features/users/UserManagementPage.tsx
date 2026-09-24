import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { History, Plus } from "lucide-react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { DataTable } from "../../components/DataTable";
import { Pagination } from "../../components/Pagination";
import { ExportMenuButton } from "../../components/ExportMenuButton";
import { useToast } from "../../components/toast/ToastContext";
import { useTableState } from "../../hooks/useTableState";
import { roleMeta, type RoleKey } from "../access/modules";
import { useCurrentUser } from "../access/permissions";
import { useTeamMembers } from "../access/teamMembers";
import { setUsersActive } from "./userActions";
import { TEAM_SORTERS, teamColumns, teamExportColumns } from "./components/teamColumns";
import { TeamToolbar, type BatchAction } from "./components/TeamToolbar";
import { RoleOverviewSection } from "./components/RoleOverviewSection";
import { UserDialogs, type UserDialog } from "./components/UserDialogs";

// Team Members (User Management) — Super Admin only (see access/permissions.ts).
export function UserManagementPage() {
  const { showToast } = useToast();
  const team = useTeamMembers();
  const currentUser = useCurrentUser();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<RoleKey | "all">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dialog, setDialog] = useState<UserDialog | null>(null);
  const actor = { id: currentUser?.id ?? "", name: currentUser?.name ?? "Unknown admin" };

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return team.filter(
      (member) =>
        (role === "all" || member.role === role) &&
        (!query || member.name.toLowerCase().includes(query) || member.email.toLowerCase().includes(query) || member.title.toLowerCase().includes(query)),
    );
  }, [team, search, role]);
  const table = useTableState({ rows, sorters: TEAM_SORTERS, initialSort: { key: "lastActive", direction: "desc" } });
  const pageIds = table.pageRows.map((member) => member.id);
  // Selection only ever holds members still in the current filtered list.
  const selectedIds = rows.filter((member) => selected.has(member.id)).map((member) => member.id);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleBatch(action: BatchAction) {
    if (action === "activate") {
      const error = setUsersActive(selectedIds, true, actor);
      if (error) return showToast("error", error);
      showToast("success", `${selectedIds.length} user${selectedIds.length === 1 ? "" : "s"} activated.`);
      return setSelected(new Set());
    }
    setDialog({ kind: action, ids: selectedIds });
  }

  const columns = teamColumns({
    currentUserId: currentUser?.id,
    selected,
    pageIds,
    onToggleSelect: toggle,
    onTogglePage: (select) => setSelected((prev) => new Set(select ? [...prev, ...pageIds] : [...prev].filter((id) => !pageIds.includes(id)))),
    onToggleActive: (member, active) => {
      if (!active) return setDialog({ kind: "deactivate", ids: [member.id] });
      const error = setUsersActive([member.id], true, actor);
      showToast(error ? "error" : "success", error ?? `${member.name} reactivated.`);
    },
    onEdit: (member) => setDialog({ kind: "form", member }),
    onDelete: (member) => setDialog({ kind: "delete", ids: [member.id] }),
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-heading-1 text-text">Team Members</h1>
          <p className="text-body mt-1 text-text-muted">Manage admin accounts, roles, and module-level access.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/users/audit-log" className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-bg">
            <History className="h-4 w-4" />
            Audit Log
          </Link>
          <Button onClick={() => setDialog({ kind: "form" })}>
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <TeamToolbar
        search={search}
        onSearchChange={setSearch}
        role={role}
        onRoleChange={setRole}
        activeCount={team.filter((member) => member.active).length}
        selectedCount={selectedIds.length}
        onBatchAction={handleBatch}
      />

      <Card className="flex flex-col gap-4">
        <div className="flex justify-end">
          <ExportMenuButton
            label="Export team members"
            getExport={() => ({
              title: "Team Members",
              subtitle: `${role === "all" ? "All roles" : roleMeta(role).label}${search ? ` · "${search}"` : ""}`,
              columns: teamExportColumns,
              rows: table.sorted,
            })}
          />
        </div>
        {rows.length === 0 ? (
          <p className="py-10 text-center text-sm text-text-muted">No team members match the current filters.</p>
        ) : (
          <DataTable columns={columns} rows={table.pageRows} rowKey={(row) => row.id} sort={table.sort} onSortChange={table.onSortChange} />
        )}
        <Pagination {...table.pagination} itemLabel="team members" />
      </Card>

      <RoleOverviewSection members={team} onEditRole={(key) => setDialog({ kind: "permissions", role: key })} onFilterRole={setRole} />

      {dialog && <UserDialogs dialog={dialog} actor={actor} onClose={() => setDialog(null)} onDone={() => setSelected(new Set())} />}
    </div>
  );
}
