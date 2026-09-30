import { US_STATES } from "../../../constants/usStates";
import { otherLabel } from "./deliveryOptions";
import type { DeliveryOrder, LoadDetails, StopAddress } from "./deliveryTypes";
import type { DeliveryStage } from "./trackingTypes";

// Display helpers for delivery screens (2026-09-30), the web twin of the
// customer app's src/lib/deliveryDisplay.ts.

export const stateCode = (name: string) => US_STATES.find((s) => s.name === name)?.code ?? name;

/** "Houston, TX 77002". */
export const cityLine = (address: StopAddress) => (address.city ? `${address.city}, ${stateCode(address.state)} ${address.zip}`.trim() : "");

/** "Houston, TX". */
export const cityState = (address: StopAddress) => (address.city ? `${address.city}, ${stateCode(address.state)}` : "—");

export const stopTitle = (address: StopAddress) => address.name || address.street || "Address not set";

export const STAGE_LABELS: Record<DeliveryStage, string> = {
  searching: "Finding a driver",
  choosing: "Choose a driver",
  requested: "Request sent",
  unavailable: "Driver unavailable",
  accepted: "Driver en route",
  "at-pickup": "Driver at pickup",
  "in-transit": "In transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export type StageTone = "info" | "warning" | "success" | "danger";

export function stageTone(stage: DeliveryStage): StageTone {
  if (stage === "delivered") return "success";
  if (stage === "cancelled" || stage === "unavailable") return "danger";
  if (stage === "in-transit" || stage === "at-pickup") return "warning";
  return "info";
}

/** "Today at 2:45 PM" / "Oct 24, 2026 · 2:45 PM". */
export function formatWhen(iso: string | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const today = new Date();
  const yesterday = new Date(today.getTime() - 86_400_000);
  if (date.toDateString() === today.toDateString()) return `Today at ${time}`;
  if (date.toDateString() === yesterday.toDateString()) return `Yesterday at ${time}`;
  return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · ${time}`;
}

export const formatDay = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/** "Industrial solvents · 8 × Drum · 3,840 lbs". */
export function loadSummary(load: LoadDetails): string {
  const weight = (load.weightLbs * Math.max(1, load.quantity)).toLocaleString("en-US");
  return [load.description || otherLabel(load.category, load.categoryOther), `${load.quantity} × ${otherLabel(load.packaging, load.packagingOther)}`, `${weight} lbs`].filter(Boolean).join(" · ");
}

/** "24 × 18 × 12 in" or "55 gal". */
export const loadSize = (load: LoadDetails) => (load.measurement === "Liquid" ? `${load.volume} ${load.volumeUnit}` : `${load.lengthIn} × ${load.widthIn} × ${load.heightIn} in`);

export const shortId = (order: DeliveryOrder) => order.id.replace("#ORD-", "#");
