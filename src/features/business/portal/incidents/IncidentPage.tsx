import { useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, CircleAlert } from "lucide-react";
import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
import { useToast } from "../../../../components/toast/ToastContext";
import { cn } from "../../../../lib/cn";
import { formatWhen } from "../../deliveries/display";
import { incidentTitle } from "../../deliveries/incidents";
import { formatMoney } from "../../deliveries/pricing";
import { addIncidentInfo } from "../../deliveries/portalIncidents";
import { orderPath } from "../paths";
import { usePortalAccount } from "../usePortalAccount";
import { usePortalIncidents } from "../usePortalIncidents";
import { AddInfoModal } from "./AddInfoModal";
import { IncidentStatusBadge } from "./IncidentStatusBadge";

// Incident detail (2026-10-01 design): "Incident reported" on arrival,
// details, "What we need" + Add Information, and the timeline — all read
// from the admin ticket/claim this report opened.
export function IncidentPage() {
  const { incidentId } = useParams<{ incidentId: string }>();
  const [params, setParams] = useSearchParams();
  const account = usePortalAccount();
  const { showToast } = useToast();
  const item = usePortalIncidents(account).find((i) => i.incident.id === incidentId);
  const [adding, setAdding] = useState(false);
  if (!account) return null;
  if (!item) return <Navigate to="/business/incidents" replace />;
  const { incident, view } = item;
  const photos = [...incident.photos, ...incident.responses.flatMap((r) => r.photos)];

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Link to="/business/incidents" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Incident Reports
      </Link>
      {params.get("submitted") && (
        <Card className="flex flex-col items-center gap-3 bg-sidebar p-8 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success"><Check className="h-6 w-6 text-white" strokeWidth={3} /></span>
          <h1 className="text-2xl font-bold text-white">Incident reported</h1>
          <p className="text-sm text-white/70">Your report has been sent to the KiaRelay operations team.</p>
          <p className="text-sm text-white">Incident ID <span className="font-semibold">#{incident.id}</span> · <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-sidebar">● Submitted</span></p>
          <div className="flex gap-2">
            {incident.orderId && <Link to={orderPath({ id: incident.orderId })} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Back to Delivery</Link>}
            <button type="button" onClick={() => setParams({})} className="rounded-md border border-white/30 px-4 py-2 text-sm font-medium text-white">View Incident</button>
          </div>
        </Card>
      )}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4">
          <Card className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h2 className="font-semibold text-text">Details</h2>
              <IncidentStatusBadge status={view.status} />
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs text-text-muted">Type</dt><dd className="font-medium text-text">{incidentTitle(incident)}</dd></div>
              <div><dt className="text-xs text-text-muted">Delivery</dt><dd>{incident.orderId ? <Link to={orderPath({ id: incident.orderId })} className="font-semibold text-primary hover:underline">{incident.orderId}</Link> : "N/A"}</dd></div>
              <div><dt className="text-xs text-text-muted">Reported</dt><dd className="font-medium text-text">{formatWhen(incident.createdAt)}</dd></div>
              <div><dt className="text-xs text-text-muted">{incident.claimAmount ? "Claimed" : "Urgency"}</dt><dd className="font-medium text-text">{incident.claimAmount ? formatMoney(incident.claimAmount) : incident.urgency === "urgent" ? "Urgent" : "Normal"}</dd></div>
            </dl>
            <div className="border-t border-border pt-2">
              <p className="text-xs text-text-muted">Your Description</p>
              <p className="text-sm text-text">{incident.description}</p>
            </div>
            {incident.responses.map((r) => (
              <p key={r.at} className="rounded-md bg-bg p-2 text-sm text-text"><span className="block text-xs text-text-muted">You added · {formatWhen(r.at)}</span>{r.text}</p>
            ))}
            {photos.length > 0 && (
              <div>
                <p className="mb-1 text-xs text-text-muted">Attached Photos ({photos.length})</p>
                <div className="flex flex-wrap gap-2">{photos.map((p) => <img key={p.uri} src={p.uri} alt={p.name} className="h-20 w-24 rounded-md object-cover" />)}</div>
              </div>
            )}
          </Card>
          {view.request && (
            <Card className="flex flex-col gap-3 border-danger/30 bg-danger/10">
              <h2 className="flex items-center gap-2 font-semibold text-danger"><CircleAlert className="h-4 w-4" /> What we need</h2>
              <p className="text-sm text-danger">{view.request}</p>
              <Button onClick={() => setAdding(true)} className="self-start">Add Information</Button>
            </Card>
          )}
        </div>
        <Card className="flex flex-col gap-3 self-start">
          <h2 className="font-semibold text-text">Timeline</h2>
          <ol className="flex flex-col gap-3">
            {view.timeline.map((entry, i) => (
              <li key={`${entry.label}-${i}`} className="flex gap-3">
                <span className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", entry.alert ? "bg-danger" : "bg-sidebar")} />
                <span className="text-sm">
                  <span className={cn("block font-semibold", entry.alert ? "text-danger" : "text-text")}>{entry.time}</span>
                  <span className="block text-text-muted">{entry.label}</span>
                  {entry.note && <span className="block text-xs text-text-muted">“{entry.note}”</span>}
                </span>
              </li>
            ))}
          </ol>
        </Card>
      </div>
      {adding && view.request && (
        <AddInfoModal
          request={view.request}
          onClose={() => setAdding(false)}
          onSend={(text, files) => {
            addIncidentInfo(incident, text, files, `${account.owner.firstName} ${account.owner.lastName}`);
            setAdding(false);
            showToast("success", "Sent to KiaRelay Operations.");
          }}
        />
      )}
    </div>
  );
}
