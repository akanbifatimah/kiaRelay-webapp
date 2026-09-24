import type { Column } from "../../../components/DataTable";
import type { ExportColumn } from "../../../lib/exportTable";
import { cn } from "../../../lib/cn";
import { auditCategoryLabels, type AuditCategory, type AuditEntry } from "../../access/auditLog";

export type AuditSortKey = "at" | "actor" | "category" | "action" | "target";

export const AUDIT_SORTERS: Record<AuditSortKey, (row: AuditEntry) => string | number> = {
  at: (row) => row.at,
  actor: (row) => row.actor,
  category: (row) => auditCategoryLabels[row.category],
  action: (row) => row.action,
  target: (row) => row.target,
};

const categoryClasses: Record<AuditCategory, string> = {
  users: "bg-tag-info-bg text-tag-info-fg",
  roles: "bg-tag-overnight-bg text-tag-overnight-fg",
  settings: "bg-tag-express-bg text-tag-express-fg",
  compliance: "bg-success/10 text-success",
  auth: "bg-tag-standard-bg text-tag-standard-fg",
};

export const formatAuditTime = (iso: string) => new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

export const auditColumns: Column<AuditEntry>[] = [
  { header: "When", sortKey: "at", accessor: (row) => <span className="whitespace-nowrap font-mono text-xs text-text-muted">{formatAuditTime(row.at)}</span> },
  { header: "Actor", sortKey: "actor", accessor: (row) => <span className="whitespace-nowrap font-medium">{row.actor}</span> },
  {
    header: "Category",
    sortKey: "category",
    accessor: (row) => <span className={cn("whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium", categoryClasses[row.category])}>{auditCategoryLabels[row.category]}</span>,
  },
  { header: "Action", sortKey: "action", accessor: (row) => <span className="whitespace-nowrap">{row.action}</span> },
  { header: "Target", sortKey: "target", accessor: (row) => <span className="font-medium">{row.target}</span> },
  { header: "Details", accessor: (row) => <span className="text-text-muted">{row.detail ?? "—"}</span> },
];

export const auditExportColumns: ExportColumn<AuditEntry>[] = [
  { header: "Timestamp", value: (row) => formatAuditTime(row.at) },
  { header: "Actor", value: (row) => row.actor },
  { header: "Category", value: (row) => auditCategoryLabels[row.category] },
  { header: "Action", value: (row) => row.action },
  { header: "Target", value: (row) => row.target },
  { header: "Details", value: (row) => row.detail ?? "" },
];
