import { createPersistentStore } from "../../lib/createPersistentStore";
import { useStore } from "../../lib/createStore";

export type AuditCategory = "users" | "roles" | "settings" | "compliance" | "auth";

export const auditCategoryLabels: Record<AuditCategory, string> = {
  users: "User Management",
  roles: "Roles & Permissions",
  settings: "Settings",
  compliance: "Compliance",
  auth: "Sign-in",
};

export interface AuditEntry {
  id: string;
  /** ISO timestamp. */
  at: string;
  actor: string;
  category: AuditCategory;
  action: string;
  target: string;
  detail?: string;
}

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3_600_000).toISOString();

// A few historical rows so the log isn't empty on first open; everything
// after that is appended by real actions (user edits, settings saves...).
const SEED: AuditEntry[] = [
  { id: "aud-seed-1", at: hoursAgo(3), actor: "David Chen", category: "users", action: "Updated module access", target: "Maria Lopez", detail: "Granted Claims & Support" },
  { id: "aud-seed-2", at: hoursAgo(26), actor: "Alex Mercer", category: "settings", action: "Saved Finance Settings", target: "Finance Settings", detail: "Default payment terms → Net 30" },
  { id: "aud-seed-3", at: hoursAgo(120), actor: "David Chen", category: "users", action: "Deactivated user", target: "James Wright", detail: "Seasonal contract ended" },
  { id: "aud-seed-4", at: hoursAgo(24 * 42), actor: "Alex Mercer", category: "compliance", action: "Renewed Certificate of Good Standing", target: "Texas Secretary of State", detail: "Annual renewal filed" },
  { id: "aud-seed-5", at: hoursAgo(24 * 90), actor: "Alex Mercer", category: "roles", action: "Edited role defaults", target: "Finance Admin", detail: "Added Customers" },
];

// TODO: replace with GET /admin/audit-log once Security & Audit (PRD §9)
// has a backend — writes then happen server-side on each admin action.
const auditStore = createPersistentStore<AuditEntry[]>("kiarelay_audit_v1", SEED);

export const useAuditLog = () => useStore(auditStore);

export function logAudit(entry: Omit<AuditEntry, "id" | "at">): void {
  auditStore.set((prev) => [{ ...entry, id: `aud-${Date.now()}-${prev.length}`, at: new Date().toISOString() }, ...prev]);
}
