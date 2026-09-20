export type ScheduleChangeTone = "success" | "warning" | "muted";

export interface ScheduleChangeEvent {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  tone: ScheduleChangeTone;
}

// TODO: replace with GET /finance/payout-schedules/changes once the
// Financial Management API exists.
export const scheduleChangeLog: ScheduleChangeEvent[] = [
  { id: "chg-1", actor: "Alex Mercer", action: "Set End of Day as the global default schedule", timestamp: "Today, 9:12 AM", tone: "success" },
  { id: "chg-2", actor: "Priya Anand", action: "Added a schedule override for James Donovan (Bi-Weekly)", timestamp: "Yesterday, 3:40 PM", tone: "muted" },
  { id: "chg-3", actor: "Mike Ross", action: "Deactivated the Bi-Weekly schedule (0 active drivers)", timestamp: "Oct 12, 2023, 11:05 AM", tone: "warning" },
  { id: "chg-4", actor: "Daniel Kim", action: "Created the On-Demand schedule ($2.99 / trx fee)", timestamp: "Oct 8, 2023, 2:20 PM", tone: "success" },
  { id: "chg-5", actor: "Alex Mercer", action: "Moved 12 drivers from End of Day to First of Week", timestamp: "Oct 3, 2023, 10:15 AM", tone: "muted" },
];
