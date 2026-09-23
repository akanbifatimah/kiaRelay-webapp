import { supportAgents } from "./agents";
import type { AgentAvailability, SupportAgent } from "./types";

export const availabilityLabels: Record<AgentAvailability, string> = {
  online: "Online",
  "high-load": "High Load",
  away: "Away",
  offline: "Offline",
};

export type WorkloadSortKey = "name" | "openTickets" | "slaAtRisk" | "breached" | "resolvedToday" | "availability";

const availabilityRank: Record<AgentAvailability, number> = { "high-load": 0, online: 1, away: 2, offline: 3 };

// TODO: replace with GET /support/team/workload (polled or pushed over a
// websocket — the page's "Live Data" pill implies real-time) once the
// Support module API exists.
export const teamWorkload: SupportAgent[] = supportAgents;

export function sortWorkload(rows: SupportAgent[], key: WorkloadSortKey, direction: "asc" | "desc"): SupportAgent[] {
  const sign = direction === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    if (key === "name") return a.name.localeCompare(b.name) * sign;
    if (key === "availability") return (availabilityRank[a.availability] - availabilityRank[b.availability]) * sign;
    return (a[key] - b[key]) * sign;
  });
}

function csvCell(value: string | number): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function exportWorkloadToCsv(rows: SupportAgent[]): void {
  const header = ["Agent", "Role", "Team", "Open Tickets", "At Risk", "Breached", "Resolved Today", "Status"];
  const lines = rows.map((agent) =>
    [agent.name, agent.role, agent.team, agent.openTickets, agent.slaAtRisk, agent.breached, agent.resolvedToday, availabilityLabels[agent.availability]]
      .map(csvCell)
      .join(","),
  );
  const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `team-workload-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
