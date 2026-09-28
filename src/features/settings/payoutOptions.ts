export type PayoutFrequency = "daily" | "weekly" | "bi-weekly" | "monthly" | "on-demand";

export interface PayoutOption {
  value: PayoutFrequency;
  label: string;
  description: string;
  popular?: boolean;
}

// One catalog of driver payout options (TC-08, 2026-09-28), shared by
// Finance Settings (which ones are offered, plus the default) and the
// driver-side Configure Payout Cycle modal (which one a driver is on).
// Before this, Settings allowed a single schedule and the driver modal had
// its own, different list with different weekdays.
export const PAYOUT_OPTIONS: PayoutOption[] = [
  { value: "daily", label: "Daily", description: "Every day at 00:00 CST" },
  { value: "weekly", label: "Weekly", description: "Every Tuesday at 00:00 CST", popular: true },
  { value: "bi-weekly", label: "Bi-Weekly", description: "Every other Tuesday at 00:00 CST" },
  { value: "monthly", label: "Monthly", description: "1st of the month" },
  { value: "on-demand", label: "On-Demand", description: "Driver requests a payout any time; instant-cashout fee may apply" },
];

export const payoutLabel = (value: string) => PAYOUT_OPTIONS.find((option) => option.value === value)?.label ?? value;
