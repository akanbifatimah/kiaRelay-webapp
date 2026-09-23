import { createStore, useStore } from "../../lib/createStore";

export type ScheduleFrequency = "daily" | "weekly-mon" | "biweekly-mon" | "monthly-1st";

export const FREQUENCY_OPTIONS: { value: ScheduleFrequency; label: string }[] = [
  { value: "daily", label: "Daily (07:00)" },
  { value: "weekly-mon", label: "Weekly (Mondays)" },
  { value: "biweekly-mon", label: "Bi-weekly (Mondays)" },
  { value: "monthly-1st", label: "Monthly (1st)" },
];

export interface ReportSchedule {
  enabled: boolean;
  frequency: ScheduleFrequency;
  /** Comma-separated, as typed — validated before save. */
  recipients: string;
  savedAt?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseRecipients(value: string): string[] {
  return value
    .split(/[,;\s]+/)
    .map((email) => email.trim())
    .filter(Boolean);
}

/** Returns an error message, or true when every recipient is a valid email. */
export function validateRecipients(value: string, enabled: boolean): string | true {
  const emails = parseRecipients(value);
  if (!enabled) return true;
  if (emails.length === 0) return "Add at least one recipient.";
  const invalid = emails.find((email) => !EMAIL_PATTERN.test(email));
  return invalid ? `"${invalid}" isn't a valid email address.` : true;
}

// Keyed by report id ("revenue", ...) so each report keeps its own schedule
// for the session (session store, like Support's — see lib/createStore.ts).
// TODO: persist via PUT /reports/:id/schedule once the Reporting API exists;
// actual delivery is a backend job, nothing is emailed from the client.
const schedulesStore = createStore<Record<string, ReportSchedule>>({
  revenue: { enabled: true, frequency: "weekly-mon", recipients: "finance-team@kiarelay.com, alex.rivera@kiarelay.com" },
});

export function useReportSchedule(reportId: string): ReportSchedule {
  const schedules = useStore(schedulesStore);
  return schedules[reportId] ?? { enabled: false, frequency: "weekly-mon", recipients: "" };
}

export function saveReportSchedule(reportId: string, schedule: ReportSchedule): void {
  schedulesStore.set((prev) => ({ ...prev, [reportId]: { ...schedule, savedAt: new Date().toISOString() } }));
}
