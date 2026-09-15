import { drivers } from "./driverRoster";

export type ActivityType = "compliance" | "wallet" | "delivery" | "background-check" | "documents" | "account" | "note";

export interface ActivityLogEntry {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  statusLabel?: string;
  attachments?: string[];
}

function daysAgoDate(n: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// TODO: replace with GET /drivers/:id/activity-log once the Security &
// Audit API exists. Only Marcus Thorne (DR-08190) has this exact
// hand-authored detail — every other roster driver gets the generic
// fallback in buildGenericActivityLog() below, not an empty list (that used
// to look like the tab was broken rather than just using mock data — same
// class of bug fixed for customers' generic fallback).
const handAuthored: Record<string, ActivityLogEntry[]> = {
  "DR-08190": [
    {
      id: "act-1",
      type: "compliance",
      title: "Compliance Review",
      description: "Bi-annual safety protocol audit and document verification cycle initiated by System Admin.",
      timestamp: "Today, 09:42 AM",
      statusLabel: "In Progress",
    },
    {
      id: "act-2",
      type: "wallet",
      title: "Wallet Withdrawal",
      description: "Successfully transferred $1,250.00 to Bank Account (••••4926). Ref: TXN-992831-8",
      timestamp: "Oct 15, 2026",
    },
    {
      id: "act-3",
      type: "delivery",
      title: "First Delivery Completed",
      description: "Successfully completed Order #ORD-4402 (Chicago to Detroit). Received 5-star rating from dispatcher.",
      timestamp: "Oct 6, 2026",
    },
    {
      id: "act-4",
      type: "background-check",
      title: "Background Check Passed",
      description: "Third-party verification (Checkr) completed. No flags raised. Identity and commercial license validated.",
      timestamp: "Oct 4, 2026",
    },
    {
      id: "act-5",
      type: "documents",
      title: "Documents Uploaded",
      description: "Uploaded CDL, Insurance Certificate, and Vehicle Registration for review.",
      timestamp: "Oct 2, 2026",
      attachments: ["CDL_Front.jpg", "INS_Policy.pdf"],
    },
    {
      id: "act-6",
      type: "account",
      title: "Account Created",
      description: "Driver profile initiated via Mobile App onboarding flow.",
      timestamp: "Oct 1, 2026",
    },
  ],
};

function buildGenericActivityLog(driverId: string): ActivityLogEntry[] {
  return [
    {
      id: `${driverId}-act-1`,
      type: "delivery",
      title: "First Delivery Completed",
      description: "Successfully completed a delivery order. Received a 5-star rating from dispatcher.",
      timestamp: formatDate(daysAgoDate(6)),
    },
    {
      id: `${driverId}-act-2`,
      type: "background-check",
      title: "Background Check Passed",
      description: "Third-party verification (Checkr) completed. No flags raised. Identity and commercial license validated.",
      timestamp: formatDate(daysAgoDate(9)),
    },
    {
      id: `${driverId}-act-3`,
      type: "documents",
      title: "Documents Uploaded",
      description: "Uploaded CDL, Insurance Certificate, and Vehicle Registration for review.",
      timestamp: formatDate(daysAgoDate(11)),
      attachments: ["CDL_Front.jpg", "INS_Policy.pdf"],
    },
    {
      id: `${driverId}-act-4`,
      type: "account",
      title: "Account Created",
      description: "Driver profile initiated via Mobile App onboarding flow.",
      timestamp: formatDate(daysAgoDate(12)),
    },
  ];
}

export function getActivityLog(driverId: string): ActivityLogEntry[] {
  if (handAuthored[driverId]) return handAuthored[driverId];
  return drivers.some((d) => d.id === driverId) ? buildGenericActivityLog(driverId) : [];
}
