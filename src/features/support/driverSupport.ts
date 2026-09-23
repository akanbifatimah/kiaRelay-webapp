import { createStore, useStore } from "../../lib/createStore";
import { drivers, type DriverRecord } from "../drivers/driverRoster";
import { getDriverDetail, type DriverDetail } from "../drivers/driverDetails";
import type { LatLng } from "../../types/geo";
import { buildDriverIncidents, type DriverIncident } from "./driverIncidents";

export interface DriverSupportProfile {
  roster: DriverRecord;
  detail: DriverDetail;
  load: {
    trackingId: string;
    origin: string;
    departed: string;
    destination: string;
    eta: string;
    path: LatLng[];
    /** 0–1 share of the route already driven. */
    progress: number;
  };
  incidents: DriverIncident[];
}

// Chicago → Detroit along I-94 (matches the Driver Support View screenshot's
// Origin/ETA cards) — real highway waypoints so the map line follows the
// interstate rather than cutting straight across Lake Michigan.
const CHICAGO_DETROIT: LatLng[] = [
  { lat: 41.8781, lng: -87.6298 },
  { lat: 41.5934, lng: -87.3464 },
  { lat: 41.7075, lng: -86.895 },
  { lat: 42.1167, lng: -86.4542 },
  { lat: 42.2917, lng: -85.5872 },
  { lat: 42.3212, lng: -85.1797 },
  { lat: 42.2459, lng: -84.4013 },
  { lat: 42.2808, lng: -83.743 },
  { lat: 42.3314, lng: -83.0458 },
];

// Houston → Dallas along I-45, for every other driver's generic profile.
const HOUSTON_DALLAS: LatLng[] = [
  { lat: 29.7604, lng: -95.3698 },
  { lat: 30.1658, lng: -95.4613 },
  { lat: 30.7235, lng: -95.5508 },
  { lat: 31.3257, lng: -95.9269 },
  { lat: 31.7632, lng: -96.1678 },
  { lat: 32.3163, lng: -96.6214 },
  { lat: 32.7767, lng: -96.797 },
];

// TODO: replace with GET /support/drivers/:id (live load + compliance +
// incident history) once the Support/Driver APIs exist. Built on top of the
// real roster + driver detail records so "Details" on this view opens the
// same driver's existing profile page, not a lookalike.
export function getDriverSupportProfile(id: string | undefined): DriverSupportProfile | null {
  const roster = drivers.find((driver) => driver.id === id);
  const detail = id ? getDriverDetail(id) : null;
  if (!roster || !detail) return null;
  const isMarcus = roster.id === "DR-08190";
  return {
    roster,
    detail,
    load: isMarcus
      ? { trackingId: "TRK-8832-A", origin: "Chicago, IL", departed: "Departed 08:00 AM", destination: "Detroit, MI", eta: "Expected 2:30 PM", path: CHICAGO_DETROIT, progress: 0.72 }
      : { trackingId: `TRK-${roster.id.slice(-4)}-B`, origin: "Houston, TX", departed: "Departed 07:15 AM", destination: "Dallas, TX", eta: "Expected 12:10 PM", path: HOUSTON_DALLAS, progress: 0.4 },
    incidents: buildDriverIncidents(roster.id),
  };
}

export interface DriverSupportState {
  /** Edits made from this view's "Edit" action (name/contact). */
  detailOverride?: Pick<DriverDetail, "name" | "contact">;
  reminderSent?: boolean;
  suspendedReason?: string;
  lastContact?: string;
}

// Session-only per-driver actions taken from this view (reminders, contact,
// suspension). TODO: POST /drivers/:id/reminders, /contact, /suspend.
const driverSupportStateStore = createStore<Record<string, DriverSupportState>>({});

export function useDriverSupportState(id: string): DriverSupportState {
  return useStore(driverSupportStateStore)[id] ?? {};
}

export function updateDriverSupportState(id: string, changes: DriverSupportState): void {
  driverSupportStateStore.set((prev) => ({ ...prev, [id]: { ...prev[id], ...changes } }));
}
