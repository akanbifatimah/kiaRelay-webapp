import { createStore, useStore } from "../../../lib/createStore";
import type { IncidentReport } from "./incidentTypes";

// Customers' incident reports in this browser session (2026-10-01). Each
// one opened an admin support ticket (and a claim for damage / missing
// items); their status is read from those records (portalIncidents.ts).
// TODO: GET /incidents.
export const incidentsStore = createStore<IncidentReport[]>([]);

export const useAllIncidents = () => useStore(incidentsStore);
export const getIncidents = () => incidentsStore.get();

export function upsertIncident(incident: IncidentReport): void {
  incidentsStore.set((prev) => (prev.some((i) => i.id === incident.id) ? prev.map((i) => (i.id === incident.id ? incident : i)) : [incident, ...prev]));
}
