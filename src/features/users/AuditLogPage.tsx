import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { Card } from "../../components/Card";
import { PageHeader } from "../../components/PageHeader";
import { DataTable } from "../../components/DataTable";
import { Pagination } from "../../components/Pagination";
import { ExportMenuButton } from "../../components/ExportMenuButton";
import { useTableState } from "../../hooks/useTableState";
import { auditCategoryLabels, useAuditLog, type AuditCategory } from "../access/auditLog";
import { AUDIT_SORTERS, auditColumns, auditExportColumns } from "./components/auditColumns";

// Local calendar day (ISO timestamps are UTC — slicing them would put late-
// evening actions on the wrong day for the native date filters).
function localDay(iso: string): string {
  const date = new Date(iso);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const inputClasses = "rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text";

// Audit Log — the "Audit Log" button on Team Members had no design
// (2026-09-23). Every user/role/settings/compliance change and sign-in is
// appended by the action itself (access/auditLog.ts), so this is a live
// trail, not sample rows. `?category=` preselects a category.
export function AuditLogPage() {
  const entries = useAuditLog();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<AuditCategory | "all">(() => {
    const requested = searchParams.get("category");
    return requested && requested in auditCategoryLabels ? (requested as AuditCategory) : "all";
  });
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return entries.filter((entry) => {
      const day = localDay(entry.at);
      return (
        (category === "all" || entry.category === category) &&
        (!from || day >= from) &&
        (!to || day <= to) &&
        (!query || [entry.actor, entry.action, entry.target, entry.detail ?? ""].some((value) => value.toLowerCase().includes(query)))
      );
    });
  }, [entries, search, category, from, to]);
  const table = useTableState({ rows, sorters: AUDIT_SORTERS, initialSort: { key: "at", direction: "desc" }, initialPageSize: 15 });
  const filterText = [category === "all" ? "All categories" : auditCategoryLabels[category], from && `from ${from}`, to && `to ${to}`, search && `"${search}"`]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="flex flex-col gap-6">
      <Link to="/users" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Team Members
      </Link>
      <PageHeader title="Audit Log" subtitle="Every admin action on users, roles, settings and compliance records — who did what, and when." />

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-56 flex-1 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
          <Search className="h-4 w-4 text-text-muted" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search actor, action, target or details"
            className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
          />
        </div>
        <select aria-label="Category" value={category} onChange={(event) => setCategory(event.target.value as AuditCategory | "all")} className={inputClasses}>
          <option value="all">Category: All</option>
          {Object.entries(auditCategoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-text-muted">
          From
          <input type="date" value={from} max={to || undefined} onChange={(event) => setFrom(event.target.value)} className={inputClasses} />
        </label>
        <label className="flex items-center gap-2 text-sm text-text-muted">
          To
          <input type="date" value={to} min={from || undefined} onChange={(event) => setTo(event.target.value)} className={inputClasses} />
        </label>
        <ExportMenuButton
          label="Export audit log"
          getExport={() => ({ title: "Admin Audit Log", subtitle: filterText, columns: auditExportColumns, rows: table.sorted })}
        />
      </div>

      <Card className="flex flex-col gap-4">
        {rows.length === 0 ? (
          <p className="py-10 text-center text-sm text-text-muted">No audit entries match the current filters.</p>
        ) : (
          <DataTable columns={auditColumns} rows={table.pageRows} rowKey={(row) => row.id} sort={table.sort} onSortChange={table.onSortChange} />
        )}
        <Pagination {...table.pagination} itemLabel="entries" />
      </Card>
    </div>
  );
}
