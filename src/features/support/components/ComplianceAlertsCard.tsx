import { AlertTriangle, BadgeCheck, CheckCircle2, IdCard } from "lucide-react";
import { Card } from "../../../components/Card";
import type { DriverDetail } from "../../drivers/driverDetails";

interface ComplianceAlertsCardProps {
  license: DriverDetail["license"];
  reminderSent?: boolean;
  onSendReminder: () => void;
}

// Driven by the driver's real license record (same data the Driver Profile's
// license banner reads) rather than the screenshot's sample "Medical Card"
// copy, so the two screens can't contradict each other. The medical card
// has no field in the driver model yet, so it only shows the passing state.
// TODO: add medical-card expiry to GET /drivers/:id and alert on it too.
export function ComplianceAlertsCard({ license, reminderSent, onSendReminder }: ComplianceAlertsCardProps) {
  const expiring = license.daysUntilExpiry <= 30;

  return (
    <Card className="flex flex-col gap-3">
      <h2 className="flex items-center gap-2 text-base font-semibold text-text">
        <AlertTriangle className="h-4 w-4 text-primary" />
        Compliance Alerts
      </h2>
      {expiring ? (
        <div className="flex gap-3 rounded-lg border border-danger/30 bg-tag-danger-bg/60 p-3">
          <IdCard className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
          <div>
            <p className="font-semibold text-text">{license.label} Expiring</p>
            <p className="text-xs text-text-muted">
              Expires {license.expiryDate} — in {license.daysUntilExpiry} days.
            </p>
            {reminderSent ? (
              <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-success">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Reminder sent
              </p>
            ) : (
              <button type="button" onClick={onSendReminder} className="mt-2 text-xs font-semibold text-danger hover:underline">
                Send Reminder
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex gap-3 rounded-lg border border-border bg-bg p-3">
          <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          <div>
            <p className="font-semibold text-text">{license.label}</p>
            <p className="text-xs text-text-muted">Valid through {license.expiryDate}</p>
          </div>
        </div>
      )}
      <div className="flex gap-3 rounded-lg border border-border bg-bg p-3">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
        <div>
          <p className="font-semibold text-text-muted">DOT Medical Card</p>
          <p className="text-xs text-text-muted">On file and current</p>
        </div>
      </div>
    </Card>
  );
}
