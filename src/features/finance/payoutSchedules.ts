export type ScheduleFrequency = "end-of-day" | "first-of-week" | "bi-weekly" | "on-demand" | "custom";

export interface PayoutSchedule {
  id: string;
  name: string;
  frequency: ScheduleFrequency;
  description: string;
  driverCount: number;
  nextPayoutDate?: string;
  feeLabel?: string;
  isGlobalDefault: boolean;
  isActive: boolean;
}

export type OverrideSubjectKind = "driver" | "fleet";

export interface DriverOverride {
  id: string;
  subjectName: string;
  subjectIdLabel: string;
  subjectKind: OverrideSubjectKind;
  currentScheduleId: string;
  effectiveSince: string;
  nextPayoutLabel: string;
}

// TODO: replace with GET /finance/payout-schedules once the Financial
// Management API exists. Distinct from the Driver Payouts register
// (driverPayoutsOverview.ts) — this is policy configuration (which drivers
// run on which recurring schedule), not the payout ledger itself.
export const payoutSchedules: PayoutSchedule[] = [
  {
    id: "SCH-END-OF-DAY",
    name: "End of Day",
    frequency: "end-of-day",
    description: "Automated settlements processed daily at 11:59 PM PST.",
    driverCount: 1248,
    nextPayoutDate: "Oct 24, 2023",
    isGlobalDefault: true,
    isActive: true,
  },
  {
    id: "SCH-FIRST-OF-WEEK",
    name: "First of Week",
    frequency: "first-of-week",
    description: "Weekly reconciliation processed every Monday morning.",
    driverCount: 412,
    nextPayoutDate: "Oct 30, 2023",
    isGlobalDefault: false,
    isActive: true,
  },
  {
    id: "SCH-BI-WEEKLY",
    name: "Bi-Weekly",
    frequency: "bi-weekly",
    description: "Payments issued every 14 days on Friday cycle.",
    driverCount: 0,
    nextPayoutDate: "N/A",
    isGlobalDefault: false,
    isActive: false,
  },
  {
    id: "SCH-ON-DEMAND",
    name: "On-Demand",
    frequency: "on-demand",
    description: "Express payout triggered manually by driver request.",
    driverCount: 185,
    feeLabel: "$2.99 / trx",
    isGlobalDefault: false,
    isActive: true,
  },
];

const handAuthoredOverrides: DriverOverride[] = [
  { id: "OVR-1", subjectName: "James Donovan", subjectIdLabel: "DRV-9921-TX", subjectKind: "driver", currentScheduleId: "SCH-BI-WEEKLY", effectiveSince: "Jan 12, 2023", nextPayoutLabel: "Oct 6, 2023" },
  { id: "OVR-2", subjectName: "SwiftWheels Logistics", subjectIdLabel: "FLT-8022-CA", subjectKind: "fleet", currentScheduleId: "SCH-FIRST-OF-WEEK", effectiveSince: "Mar 05, 2023", nextPayoutLabel: "Oct 2, 2023" },
  { id: "OVR-3", subjectName: "Anita Maxwell", subjectIdLabel: "DRV-4401-FL", subjectKind: "driver", currentScheduleId: "SCH-END-OF-DAY", effectiveSince: "Aug 20, 2023", nextPayoutLabel: "Today" },
];

const fillerNames = ["Rosa Delgado", "Ben Foster", "Nadia Okafor", "Trevor Lin", "Grace Pham"];
const fillerScheduleIds = ["SCH-END-OF-DAY", "SCH-FIRST-OF-WEEK", "SCH-BI-WEEKLY"];

function buildFillerOverrides(count: number): DriverOverride[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `OVR-0${100 + i}`,
    subjectName: `${fillerNames[i % fillerNames.length]} ${Math.floor(i / fillerNames.length) + 1}`,
    subjectIdLabel: `DRV-0${9500 + i}-${["TX", "CA", "FL", "NY"][i % 4]}`,
    subjectKind: "driver",
    currentScheduleId: fillerScheduleIds[i % fillerScheduleIds.length],
    effectiveSince: `${["Jan", "Mar", "Jun", "Sep"][i % 4]} ${1 + (i % 28)}, 2023`,
    nextPayoutLabel: `Oct ${1 + (i % 28)}, 2023`,
  }));
}

export const driverOverrides: DriverOverride[] = [...handAuthoredOverrides, ...buildFillerOverrides(21)];

export interface DriverOverrideFilters {
  search: string;
  scheduleId: string | "all";
}

export function filterDriverOverrides(rows: DriverOverride[], filters: DriverOverrideFilters): DriverOverride[] {
  const term = filters.search.trim().toLowerCase();
  return rows.filter((row) => {
    if (filters.scheduleId !== "all" && row.currentScheduleId !== filters.scheduleId) return false;
    if (term && !row.subjectName.toLowerCase().includes(term) && !row.subjectIdLabel.toLowerCase().includes(term)) return false;
    return true;
  });
}

export function exportDriverOverridesToCsv(rows: DriverOverride[], filename = "schedule-overrides.csv"): void {
  const headers = ["Driver/Fleet", "ID", "Current Schedule", "Effective Since", "Next Payout"];
  const csvRows = rows.map((r) => [r.subjectName, r.subjectIdLabel, r.currentScheduleId, r.effectiveSince, r.nextPayoutLabel]);
  const csv = [headers, ...csvRows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
