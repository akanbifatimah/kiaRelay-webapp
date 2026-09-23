import { Link } from "react-router-dom";
import { FileClock } from "lucide-react";
import { Card } from "../../../components/Card";
import { cn } from "../../../lib/cn";
import { formatIncidentDate, type DriverIncident, type IncidentType } from "../driverIncidents";

const dotClasses: Record<IncidentType, string> = {
  safety: "bg-warning",
  equipment: "bg-text-muted",
  compliance: "bg-danger",
  delivery: "bg-info",
  onboarding: "bg-success",
};

// Shows the two most recent incidents plus the driver's onboarding (always
// the first event on record), matching the screenshot's three-item shape;
// "View Full Log" opens the full, filterable Incident Log page.
export function IncidentHistoryCard({ incidents, logHref }: { incidents: DriverIncident[]; logHref: string }) {
  const onboarding = incidents.find((incident) => incident.type === "onboarding");
  const shown = [...incidents.filter((incident) => incident.type !== "onboarding").slice(0, 2), ...(onboarding ? [onboarding] : [])];

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="flex items-center gap-2 text-base font-semibold text-text">
        <FileClock className="h-4 w-4" />
        Incident History
      </h2>
      <ol className="flex flex-col gap-5">
        {shown.map((incident, index) => (
          <li key={incident.id} className="relative flex gap-3">
            {index < shown.length - 1 && <span className="absolute left-[4px] top-4 h-[calc(100%+0.5rem)] w-px bg-border" />}
            <span className={cn("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", dotClasses[incident.type])} />
            <div className="min-w-0">
              <p className="text-xs uppercase text-text-muted">{formatIncidentDate(incident.daysAgo)}</p>
              <p className="font-semibold text-text">{incident.title}</p>
              {incident.type !== "onboarding" && <p className="text-xs text-text-muted">{incident.description}</p>}
              {incident.status === "resolved" && (
                <span className="text-label mt-1 inline-block rounded bg-tag-standard-bg px-1.5 py-0.5 uppercase text-tag-standard-fg">Resolved</span>
              )}
            </div>
          </li>
        ))}
      </ol>
      <Link to={logHref} className="rounded-lg border border-border py-2 text-center text-sm font-medium text-text hover:bg-bg">
        View Full Log
      </Link>
    </Card>
  );
}
