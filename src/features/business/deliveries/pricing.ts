import { DEMURRAGE, HANDLING_SURCHARGES, PROVISION_SURCHARGES, SPEED_OPTIONS } from "./deliveryOptions";
import type { DeliveryDraft, StopAddress } from "./deliveryTypes";
import type { PriceLine, Quote } from "./trackingTypes";

// Mock quote (2026-09-30), same as the customer app's src/lib/pricing.ts.
// TODO: replace with POST /quotes; the server owns rates, distance and tax.

export const TAX_RATE = 0.0625;
/** Loads at or above this total weight are priced as freight (linehaul). */
const FREIGHT_LBS = 1000;
const LINEHAUL_PER_MILE = 2.15;

const round2 = (value: number) => Math.round(value * 100) / 100;

/** Road miles between two stops. TODO: a routing API; this uses the ZIPs. */
export function mockMiles(from: StopAddress, to: StopAddress): number {
  const a = Number(from.zip);
  const b = Number(to.zip);
  if (!a || !b) return 0;
  if (from.city === to.city && from.state === to.state) return 4 + (Math.abs(a - b) % 14);
  return Math.min(1400, Math.round(18 + Math.abs(a - b) / 4 + ((a + b) % 23)));
}

export function quoteDelivery(draft: Pick<DeliveryDraft, "pickup" | "dropoff" | "load" | "handling" | "speed">): Quote {
  const miles = mockMiles(draft.pickup.address, draft.dropoff.address);
  const totalLbs = draft.load.weightLbs * Math.max(1, draft.load.quantity);
  const lines: PriceLine[] = [];

  if (totalLbs >= FREIGHT_LBS) {
    const linehaul = round2(Math.max(150, miles * LINEHAUL_PER_MILE));
    lines.push({ label: `Linehaul (${miles} miles @ $${LINEHAUL_PER_MILE}/mi)`, amount: linehaul });
    lines.push({ label: "Fuel Surcharge", amount: round2(linehaul * 0.23) });
  } else {
    lines.push({ label: "Base Delivery", amount: round2(Math.max(25, 18 + miles * 1.2)) });
  }

  const speed = SPEED_OPTIONS[draft.speed];
  if (speed.surcharge) lines.push({ label: `${speed.label} Surge`, amount: speed.surcharge });
  for (const flag of draft.handling) {
    const add = HANDLING_SURCHARGES[flag];
    if (add) lines.push(add);
  }
  for (const provision of draft.dropoff.provisions) {
    const add = PROVISION_SURCHARGES[provision];
    if (add) lines.push(add);
  }

  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
  lines.push({ label: "Tax & Fees", amount: round2(subtotal * TAX_RATE) });
  return { lines, total: sumLines(lines), miles, transitMinutes: Math.round((miles / 45) * 60) + 20 };
}

export function sumLines(lines: PriceLine[]): number {
  return round2(lines.reduce((sum, line) => sum + line.amount, 0));
}

/** Demurrage for time waited past the free window, or undefined. */
export function demurrageLine(waitMinutes: number): PriceLine | undefined {
  const over = waitMinutes - DEMURRAGE.freeMinutes;
  if (over <= 0) return undefined;
  const hours = Math.round((over / 60) * 10) / 10;
  return { label: `Demurrage (${hours} hrs)`, amount: round2((over / 60) * DEMURRAGE.hourlyRate), accrued: true };
}

/** "$1,250.00". */
export function formatMoney(amount: number): string {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
