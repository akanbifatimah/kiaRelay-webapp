import type { DeliveryOrder } from "./deliveryTypes";
import type { DeliveryEvent, DeliveryStage } from "./trackingTypes";

// Mock delivery lifecycle (2026-09-30), same as the customer app's
// src/lib/deliverySim.ts. Requesting a driver writes the whole future
// schedule as dated events (accepted → at pickup → in transit → delivered);
// the current stage is simply the latest event that has already happened.
// Nothing runs in the background, and it survives a reload.
// TODO: replace with live status from the dispatch API (websocket/push).

/** Demo speed: one real second is eight simulated seconds. */
export const SIM_SCALE = 8;
/** Real seconds per phase. */
const PHASE = { match: 3, accept: 4, toPickup: 30, atPickup: 60, transit: 90 };
const SEC = 1000;
const iso = (ms: number) => new Date(ms).toISOString();

export function pastEvents(order: Pick<DeliveryOrder, "events">, now = Date.now()): DeliveryEvent[] {
  return order.events.filter((event) => Date.parse(event.at) <= now);
}

export function stageOf(order: Pick<DeliveryOrder, "events">, now = Date.now()): DeliveryStage {
  const past = pastEvents(order, now);
  return past[past.length - 1]?.stage ?? "searching";
}

/** When a stage happens (or is scheduled to), latest occurrence. */
export function eventTime(order: Pick<DeliveryOrder, "events">, stage: DeliveryStage): string | undefined {
  return [...order.events].reverse().find((event) => event.stage === stage)?.at;
}

export const isFinished = (stage: DeliveryStage) => stage === "delivered" || stage === "cancelled";
export const isMatching = (stage: DeliveryStage) => stage === "searching" || stage === "choosing" || stage === "requested" || stage === "unavailable";
/** A scheduled delivery whose pickup time hasn't come yet ("Scheduled" tab). */
export const isScheduled = (order: Pick<DeliveryOrder, "events" | "scheduledFor">, now = Date.now()) =>
  Boolean(order.scheduledFor) && Date.parse(order.scheduledFor) > now && !isFinished(stageOf(order, now));
/** The customer can still cancel before the load is picked up. */
export const isCancellable = (stage: DeliveryStage) => isMatching(stage) || stage === "accepted" || stage === "at-pickup";

/** Simulated minutes until an event (for "Arriving in 4 minutes"). */
export function simMinutesUntil(at: string | undefined, now = Date.now()): number {
  if (!at) return 0;
  return Math.max(0, Math.ceil((((Date.parse(at) - now) / SEC) * SIM_SCALE) / 60));
}

/** Simulated minutes since an event, fractional (for wait timers). */
export function simMinutesSince(at: string | undefined, now = Date.now()): number {
  if (!at) return 0;
  return Math.max(0, (((now - Date.parse(at)) / SEC) * SIM_SCALE) / 60);
}

/** "08:32" from fractional minutes. */
export function formatClock(minutes: number): string {
  const total = Math.floor(minutes * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/** Order placed: find drivers, then show the offers. */
export function searchEvents(now: number): DeliveryEvent[] {
  return [
    { stage: "searching", at: iso(now) },
    { stage: "choosing", at: iso(now + PHASE.match * SEC) },
  ];
}

/** A driver was requested: their answer and, if yes, the whole trip. */
export function requestEvents(now: number, declines: boolean, scheduledFor: string): DeliveryEvent[] {
  const requested: DeliveryEvent = { stage: "requested", at: iso(now) };
  const answered = now + PHASE.accept * SEC;
  if (declines) return [requested, { stage: "unavailable", at: iso(answered), note: "Vehicle issue" }];
  const arrive = Math.max(answered + PHASE.toPickup * SEC, scheduledFor ? Date.parse(scheduledFor) : 0);
  const pickedUp = arrive + PHASE.atPickup * SEC;
  return [
    requested,
    { stage: "accepted", at: iso(answered) },
    { stage: "at-pickup", at: iso(arrive) },
    { stage: "in-transit", at: iso(pickedUp) },
    { stage: "delivered", at: iso(pickedUp + PHASE.transit * SEC) },
  ];
}

/** Drops the not-yet-happened part of the schedule (cancel, re-pick). */
export function dropFuture(events: DeliveryEvent[], now: number): DeliveryEvent[] {
  return events.filter((event) => Date.parse(event.at) <= now);
}

/** 0–1 along the whole trip, for progress tracks and the map marker. */
export function tripProgress(order: Pick<DeliveryOrder, "events">, now = Date.now()): number {
  const stage = stageOf(order, now);
  const fraction = (from: DeliveryStage, to: DeliveryStage) => {
    const start = Date.parse(eventTime(order, from) ?? "");
    const end = Date.parse(eventTime(order, to) ?? "");
    return end > start ? Math.min(1, Math.max(0, (now - start) / (end - start))) : 0;
  };
  if (stage === "delivered") return 1;
  if (stage === "in-transit") return 0.35 + 0.6 * fraction("in-transit", "delivered");
  if (stage === "at-pickup") return 0.3;
  if (stage === "accepted") return 0.05 + 0.2 * fraction("accepted", "at-pickup");
  return 0;
}

export type StepState = "done" | "active" | "pending";

/** Confirmed → Driver Assigned → Picked Up → Delivered, for timelines. */
export function trackingSteps(order: DeliveryOrder, now = Date.now()): { label: string; at?: string; state: StepState }[] {
  const past = pastEvents(order, now);
  const happened = (stage: DeliveryStage) => [...past].reverse().find((event) => event.stage === stage)?.at;
  const steps = [
    { label: "Confirmed", at: order.createdAt },
    { label: "Driver Assigned", at: happened("accepted") },
    { label: "Picked Up", at: happened("in-transit") },
    { label: "Delivered", at: happened("delivered") },
  ];
  const lastDone = steps.reduce((last, step, i) => (step.at ? i : last), 0);
  return steps.map((step, i) => ({ ...step, state: i < lastDone || (i === lastDone && i === steps.length - 1) ? "done" : i === lastDone ? "active" : "pending" }));
}
