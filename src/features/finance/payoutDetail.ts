import type { PayoutRegisterRow, PayoutRegisterStatus } from "./driverPayoutsOverview";

export type PayoutStepKey = "completed" | "created" | "scheduled" | "initiated" | "paid";
export type PayoutStepState = "done" | "active" | "pending";

export interface PayoutStep {
  key: PayoutStepKey;
  label: string;
  state: PayoutStepState;
}

export interface IncludedDelivery {
  orderId: string;
  route: string;
  date: string;
  amount: number;
}

export interface PayoutDetail {
  payout: PayoutRegisterRow;
  driverPhone: string;
  driverEmail: string;
  vehicleType: string;
  destinationLabel: string;
  taxStatusLabel: string;
  bonuses: number;
  steps: PayoutStep[];
  deliveries: IncludedDelivery[];
}

function pick<T>(list: T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return list[Math.abs(hash) % list.length];
}

const vehicleTypes = ["Cargo Van", "Box Truck", "Sedan", "Pickup Truck"];
const destinations = ["Bank of America ••4821", "Chase ••1190", "Wells Fargo ••3307", "Kia Wallet"];
const routes = ["Chicago, IL to Detroit, MI", "Dallas, TX to Houston, TX", "Seattle, WA to Portland, OR", "Miami, FL to Orlando, FL"];

const stepOrder: { key: PayoutStepKey; label: string }[] = [
  { key: "created", label: "Payout Created" },
  { key: "scheduled", label: "Scheduled" },
  { key: "initiated", label: "Initiated" },
  { key: "completed", label: "Processing" },
  { key: "paid", label: "Paid" },
];

const doneCountByStatus: Record<PayoutRegisterStatus, number> = {
  pending: 2,
  processed: 3,
  paid: 5,
  failed: 3,
};

function buildSteps(status: PayoutRegisterStatus): PayoutStep[] {
  const doneCount = doneCountByStatus[status];
  return stepOrder.map((step, index) => ({
    ...step,
    state: status === "failed" && index === doneCount - 1 ? "pending" : index < doneCount ? "done" : index === doneCount ? "active" : "pending",
  }));
}

// TODO: replace with GET /finance/payouts/:id once the Financial
// Management API exists. Driver profile/schedule/timeline/deliveries are
// computed deterministically from the base PayoutRegisterRow rather than a
// second hand-authored dataset, same technique as transactionDetail.ts.
export function getPayoutDetail(payout: PayoutRegisterRow): PayoutDetail {
  const bonuses = Math.round(payout.gross * 0.02 * 100) / 100;
  const deliveryCount = Math.max(1, payout.completedDeliveries);
  const route = pick(routes, payout.driverId);

  return {
    payout,
    driverPhone: `+1 (555) ${100 + (Math.abs(payout.driverId.charCodeAt(3)) % 900)}-${1000 + (Math.abs(payout.driverId.charCodeAt(4)) % 8999)}`,
    driverEmail: `${payout.driverName.toLowerCase().replace(/\s+/g, ".")}@kiarelay-driver.com`,
    vehicleType: pick(vehicleTypes, payout.driverId),
    destinationLabel: pick(destinations, payout.id),
    taxStatusLabel: "W-9 on file",
    bonuses,
    steps: buildSteps(payout.status),
    deliveries: Array.from({ length: deliveryCount }, (_, i) => ({
      orderId: `ORD-${2800 + ((Math.abs(payout.driverId.charCodeAt(i % payout.driverId.length)) + i * 37) % 999)}`,
      route,
      date: payout.nextPayoutDate,
      amount: Math.round((payout.gross / deliveryCount) * 100) / 100,
    })),
  };
}
