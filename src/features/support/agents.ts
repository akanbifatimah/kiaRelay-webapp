import type { SupportAgent } from "./types";

/** The signed-in admin (matches TopHeader's "Alex Mercer"). "My Tickets" are
 * the tickets assigned to this id. TODO: read from the real session once
 * POST /auth/login returns a user profile. */
export const CURRENT_AGENT_ID = "agt-alex";

export const SUPPORT_TEAMS = [
  "Driver Support (Level 2)",
  "Customer Success",
  "Billing & Finance",
  "Technical Support",
  "Claims & Compliance",
];

const PHOTO = "/profile_img.png";

// TODO: replace with GET /support/agents (availability + live workload
// counts) once the Support module API exists. Photos reuse the same
// placeholder as TopHeader/Orders — there's no real per-agent photo yet.
export const supportAgents: SupportAgent[] = [
  { id: CURRENT_AGENT_ID, name: "Alex Mercer", role: "Fleet Admin", team: "Driver Support (Level 2)", avatar: PHOTO, availability: "online", openTickets: 12, slaAtRisk: 1, breached: 0, resolvedToday: 9 },
  { id: "agt-sarah-w", name: "Sarah Williams", role: "Senior Driver Support", team: "Driver Support (Level 2)", avatar: PHOTO, availability: "online", openTickets: 12, slaAtRisk: 2, breached: 0, resolvedToday: 17 },
  { id: "agt-marcus", name: "Marcus King", role: "Dispatch Specialist", team: "Driver Support (Level 2)", availability: "online", openTickets: 5, slaAtRisk: 0, breached: 0, resolvedToday: 11 },
  { id: "agt-david", name: "David Chen", role: "L3 Network Engineer", team: "Technical Support", avatar: PHOTO, availability: "away", openTickets: 5, slaAtRisk: 0, breached: 0, resolvedToday: 31 },
  { id: "agt-sarah-j", name: "Sarah Jenkins", role: "Customer Success Lead", team: "Customer Success", avatar: PHOTO, availability: "online", openTickets: 14, slaAtRisk: 1, breached: 3, resolvedToday: 22 },
  { id: "agt-michael", name: "Michael Rodriguez", role: "Support Specialist", team: "Customer Success", availability: "high-load", openTickets: 28, slaAtRisk: 1, breached: 2, resolvedToday: 15 },
  { id: "agt-maria", name: "Maria Rodriguez", role: "Server Admin", team: "Technical Support", availability: "high-load", openTickets: 19, slaAtRisk: 3, breached: 1, resolvedToday: 8 },
  { id: "agt-james", name: "James Brennan", role: "Claims Reviewer", team: "Claims & Compliance", avatar: PHOTO, availability: "online", openTickets: 9, slaAtRisk: 0, breached: 0, resolvedToday: 6 },
  { id: "agt-priya", name: "Priya Nair", role: "Compliance Analyst", team: "Claims & Compliance", availability: "online", openTickets: 7, slaAtRisk: 1, breached: 0, resolvedToday: 12 },
  { id: "agt-owen", name: "Owen Hughes", role: "Billing Specialist", team: "Billing & Finance", availability: "online", openTickets: 11, slaAtRisk: 0, breached: 0, resolvedToday: 14 },
  { id: "agt-lena", name: "Lena Park", role: "Finance Analyst", team: "Billing & Finance", availability: "away", openTickets: 4, slaAtRisk: 0, breached: 0, resolvedToday: 10 },
  { id: "agt-tomas", name: "Tomas Silva", role: "Technical Support", team: "Technical Support", availability: "offline", openTickets: 0, slaAtRisk: 0, breached: 0, resolvedToday: 5 },
  { id: "agt-nina", name: "Nina Patel", role: "On Break", team: "Driver Support (Level 2)", avatar: PHOTO, availability: "offline", openTickets: 3, slaAtRisk: 0, breached: 0, resolvedToday: 7 },
];

export function getAgent(id: string | undefined): SupportAgent | undefined {
  return supportAgents.find((agent) => agent.id === id);
}
