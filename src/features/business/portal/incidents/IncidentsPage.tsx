import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CirclePlus } from "lucide-react";
import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
import { DataTable, type Column } from "../../../../components/DataTable";
import { PageHeader } from "../../../../components/PageHeader";
import { cn } from "../../../../lib/cn";
import { formatWhen } from "../../deliveries/display";
import { INCIDENT_STATUS_LABELS, incidentTitle } from "../../deliveries/incidents";
import type { IncidentStatus } from "../../deliveries/incidentTypes";
import { usePortalAccount } from "../usePortalAccount";
import { usePortalIncidents, type PortalIncident } from "../usePortalIncidents";
import { IncidentStatusBadge } from "./IncidentStatusBadge";

type Filter = "all" | IncidentStatus;
const FILTERS: Filter[] = ["all", "action-required", "under-review", "submitted", "resolved"];

// Incident Reports (2026-10-01, from the mobile design adapted for
// customers): every report's status comes from the admin ticket/claim.
export function IncidentsPage() {
  const account = usePortalAccount();
  const navigate = useNavigate();
  const items = usePortalIncidents(account);
  const [filter, setFilter] = useState<Filter>("all");
  const rows = filter === "all" ? items : items.filter((i) => i.view.status === filter);

  const columns: Column<PortalIncident>[] = [
    { header: "Incident", accessor: ({ incident }) => <div><p className="font-semibold text-text">{incidentTitle(incident)}</p><p className="text-xs text-text-muted">Incident #{incident.id}</p></div> },
    { header: "Delivery", accessor: ({ incident }) => <span className="whitespace-nowrap">{incident.orderId || "N/A"}</span> },
    { header: "Urgency", accessor: ({ incident }) => <span className={incident.urgency === "urgent" ? "font-semibold text-danger" : "text-text-muted"}>{incident.urgency === "urgent" ? "Urgent" : "Normal"}</span> },
    { header: "Reported", accessor: ({ incident }) => <span className="whitespace-nowrap">{formatWhen(incident.createdAt)}</span> },
    { header: "Status", align: "right", accessor: ({ view }) => <IncidentStatusBadge status={view.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Incident Reports"
        subtitle="Report and track issues that happen during your deliveries."
        actions={
          <Button onClick={() => navigate("/business/incidents/new")} className="flex items-center gap-2">
            <CirclePlus className="h-4 w-4" /> Report an Incident
          </Button>
        }
      />
      <Card className="flex flex-col gap-4">
        <div role="tablist" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button key={f} type="button" role="tab" aria-selected={filter === f} onClick={() => setFilter(f)} className={cn("rounded-full border px-3.5 py-1 text-sm font-medium", filter === f ? "border-sidebar bg-sidebar text-white" : "border-border text-text hover:bg-bg")}>
              {f === "all" ? "All" : INCIDENT_STATUS_LABELS[f]}
              {f !== "all" && <span className="ml-1.5 text-xs opacity-70">{items.filter((i) => i.view.status === f).length}</span>}
            </button>
          ))}
        </div>
        <DataTable columns={columns} rows={rows} rowKey={({ incident }) => incident.id} onRowClick={({ incident }) => navigate(`/business/incidents/${incident.id}`)} />
        {rows.length === 0 && <p className="py-6 text-center text-sm text-text-muted">{items.length ? "No incidents with this status." : "No incidents reported. Smooth deliveries so far!"}</p>}
      </Card>
    </div>
  );
}
