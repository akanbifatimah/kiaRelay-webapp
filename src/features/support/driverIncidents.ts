export type IncidentType = "safety" | "equipment" | "compliance" | "delivery" | "onboarding";
export type IncidentStatus = "resolved" | "open" | "info";

export interface DriverIncident {
  id: string;
  daysAgo: number;
  title: string;
  description: string;
  type: IncidentType;
  status: IncidentStatus;
  reportedBy: string;
}

export const incidentTypeLabels: Record<IncidentType, string> = {
  safety: "Safety",
  equipment: "Equipment",
  compliance: "Compliance",
  delivery: "Delivery",
  onboarding: "Onboarding",
};

export const incidentStatusLabels: Record<IncidentStatus, string> = {
  resolved: "Resolved",
  open: "Open",
  info: "Info",
};

type Template = [title: string, description: string, type: IncidentType, reportedBy: string];

const templates: Template[] = [
  ["Safety Breach - Speeding", "Telematics recorded 15mph over limit in construction zone.", "safety", "Telematics"],
  ["Minor Equipment Damage", "Scraped trailer skirt at distribution center loading dock.", "equipment", "Dock Supervisor"],
  ["Hard Braking Event", "Harsh deceleration flagged on I-80 eastbound; no collision.", "safety", "Telematics"],
  ["Late Delivery", "Arrived 42 minutes past window due to weigh-station backup.", "delivery", "Dispatch"],
  ["HOS Warning", "Approached 11-hour driving limit; rest break logged in time.", "compliance", "ELD"],
  ["Tire Pressure Alert", "Rear-left tire pressure below threshold; serviced at next stop.", "equipment", "Fleet Maint."],
  ["POD Photo Missing", "Proof-of-delivery photo not captured; recipient signature on file.", "delivery", "Support"],
  ["Pre-trip Inspection Skipped", "DVIR not submitted before first dispatch of the day.", "compliance", "Safety Officer"],
];

function atDaysAgo(n: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date;
}

export function formatIncidentDate(daysAgo: number): string {
  return atDaysAgo(daysAgo).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

// TODO: replace with GET /drivers/:id/incidents once the Driver Management /
// Compliance API exists. Deterministic per driver (seeded from the id) so a
// driver's history is stable across visits; always ends with the driver's
// onboarding, since that's the first event on any driver's record.
export function buildDriverIncidents(driverId: string, count = 18): DriverIncident[] {
  const seed = Number(driverId.replace(/\D/g, "")) || 1;
  const incidents = Array.from({ length: count }, (_, i) => {
    const [title, description, type, reportedBy] = templates[(seed + i) % templates.length];
    const daysAgo = 3 + i * 17 + ((seed + i * 7) % 9);
    return {
      id: `INC-${String(seed).slice(-3)}${String(i + 1).padStart(2, "0")}`,
      daysAgo,
      title,
      description,
      type,
      status: (i === 0 ? "open" : "resolved") as IncidentStatus,
      reportedBy,
    };
  });
  const onboardedDaysAgo = incidents[incidents.length - 1].daysAgo + 30;
  return [
    ...incidents,
    { id: `INC-${String(seed).slice(-3)}00`, daysAgo: onboardedDaysAgo, title: "Onboarding Completed", description: "Background check, drug screen and orientation passed.", type: "onboarding", status: "info", reportedBy: "HR" },
  ];
}

function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function exportIncidentsToCsv(driverName: string, incidents: DriverIncident[]): void {
  const header = ["ID", "Date", "Type", "Title", "Description", "Status", "Reported By"];
  const lines = incidents.map((incident) =>
    [incident.id, formatIncidentDate(incident.daysAgo), incidentTypeLabels[incident.type], incident.title, incident.description, incidentStatusLabels[incident.status], incident.reportedBy]
      .map(csvCell)
      .join(","),
  );
  const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${driverName.toLowerCase().replace(/\s+/g, "-")}-incidents.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
