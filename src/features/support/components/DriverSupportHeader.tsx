import { Link } from "react-router-dom";
import { Bell, Headset, IdCard, MoreHorizontal, Pencil, ShieldOff, Truck, Undo2 } from "lucide-react";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import type { DriverSupportProfile, DriverSupportState } from "../driverSupport";

interface DriverSupportHeaderProps {
  profile: DriverSupportProfile;
  state: DriverSupportState;
  onContact: () => void;
  onEdit: () => void;
  onRemind: () => void;
  onSuspend: () => void;
  onReinstate: () => void;
}

// Edit / Remind / Suspend are the "Action Buttons" spec from the Create New
// Claim screenshot — placed here per the user's confirmation (2026-09-23).
// Suspend is the one solid-red action; once suspended it flips to Reinstate.
export function DriverSupportHeader({ profile, state, onContact, onEdit, onRemind, onSuspend, onReinstate }: DriverSupportHeaderProps) {
  const { roster, detail } = profile;
  const isSuspended = Boolean(state.suspendedReason) || roster.status === "suspended";
  const onLoad = roster.status === "in-transit" || roster.status === "online";

  return (
    <Card className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4">
        <img src="/profile_img.png" alt={detail.name} className="h-16 w-16 rounded-full border border-border object-cover" />
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-text">{detail.name}</h1>
            {isSuspended ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-tag-danger-bg px-2 py-0.5 text-xs font-medium text-tag-danger-fg">
                <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                Suspended
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-info/30 bg-tag-info-bg px-2 py-0.5 text-xs font-medium text-tag-info-fg">
                <span className="h-1.5 w-1.5 rounded-full bg-info" />
                {onLoad ? "Active Load" : "Off Duty"}
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <IdCard className="h-3.5 w-3.5" />
              ID: {roster.id}
            </span>
            <span className="flex items-center gap-1">
              <Truck className="h-3.5 w-3.5" />
              {roster.vehicle} ({roster.plate})
            </span>
            {state.lastContact && <span>Last contacted: {state.lastContact}</span>}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 lg:items-end">
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/drivers/${roster.id}`}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-bg"
          >
            <MoreHorizontal className="h-4 w-4" />
            Details
          </Link>
          <Button variant="dark" onClick={onContact}>
            <Headset className="h-4 w-4" />
            Contact Driver
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
          <Button variant="secondary" size="sm" onClick={onRemind} disabled={state.reminderSent}>
            <Bell className="h-3.5 w-3.5" />
            {state.reminderSent ? "Reminded" : "Remind"}
          </Button>
          {isSuspended ? (
            <Button variant="secondary" size="sm" onClick={onReinstate}>
              <Undo2 className="h-3.5 w-3.5" />
              Reinstate
            </Button>
          ) : (
            <Button variant="danger" size="sm" onClick={onSuspend}>
              <ShieldOff className="h-3.5 w-3.5" />
              Suspend
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
