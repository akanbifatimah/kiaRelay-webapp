import { CircleCheck, CircleDashed, Clock } from "lucide-react";
import { Card } from "../../../../components/Card";
import { Switch } from "../../../../components/Switch";
import { createPersistentStore } from "../../../../lib/createPersistentStore";
import { useStore } from "../../../../lib/createStore";
import { cn } from "../../../../lib/cn";
import type { BusinessAccount } from "../../businessAccounts";
import { verificationSteps } from "../settings/verification";

/** Verification Status (2026-10-01; first pass): email → phone → documents. */
export function VerificationCard({ account }: { account: BusinessAccount }) {
  const steps = verificationSteps(account);
  const level = steps.filter((s) => s.done).length;
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-text">Verification Status</h2>
        <span className={cn("text-sm font-semibold", level === 3 ? "text-success" : "text-warning")}>Level {level} {level === 3 ? "Complete" : "of 3"}</span>
      </div>
      {steps.map((s, i) => {
        const Icon = s.done ? CircleCheck : s.pending ? Clock : CircleDashed;
        return (
          <div key={s.label} className="flex items-center gap-3 rounded-lg border border-border p-3">
            <Icon className={cn("h-5 w-5", s.done ? "text-success" : s.pending ? "text-warning" : "text-text-muted")} />
            <span className="flex-1 text-sm">
              <span className="block font-medium text-text">Level {i + 1} · {s.label}</span>
              <span className="block text-xs text-text-muted">{s.detail}</span>
            </span>
          </div>
        );
      })}
    </Card>
  );
}

const PREFS = [
  { key: "deliveries", label: "Delivery updates", hint: "Driver assigned, picked up, delivered" },
  { key: "incidents", label: "Incident updates", hint: "When Operations needs something or resolves a report" },
  { key: "billing", label: "Invoices & payments", hint: "New invoices, due dates and receipts" },
  { key: "marketing", label: "Product news", hint: "New services and lanes" },
] as const;

type PrefKey = (typeof PREFS)[number]["key"];
// Per-account notification choices (persisted on this browser, 2026-10-01).
// TODO: PUT /business/me/notification-preferences.
const prefsStore = createPersistentStore<Record<string, Partial<Record<PrefKey, boolean>>>>("kiarelay_portal_prefs_v1", {});

/** Notification Preferences (a row on the Account Settings design — first pass). */
export function NotificationPrefsCard({ account }: { account: BusinessAccount }) {
  const prefs = useStore(prefsStore)[account.id] ?? {};
  return (
    <Card className="flex flex-col gap-3">
      <h2 className="font-semibold text-text">Notification Preferences</h2>
      {PREFS.map((p) => (
        <div key={p.key} className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
          <span className="text-sm">
            <span className="block font-medium text-text">{p.label}</span>
            <span className="block text-xs text-text-muted">{p.hint}</span>
          </span>
          <Switch label={p.label} checked={prefs[p.key] ?? p.key !== "marketing"} onChange={(on) => prefsStore.set((s) => ({ ...s, [account.id]: { ...s[account.id], [p.key]: on } }))} />
        </div>
      ))}
    </Card>
  );
}
