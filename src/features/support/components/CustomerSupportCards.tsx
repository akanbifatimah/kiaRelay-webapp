import { Link } from "react-router-dom";
import { Building, CheckCircle2, Mail, MapPin } from "lucide-react";
import { Card } from "../../../components/Card";
import { cn } from "../../../lib/cn";
import type { CustomerSupportProfile } from "../customerSupport";

interface AccountStatusCardProps {
  account: CustomerSupportProfile["account"];
  reminderSent?: boolean;
  onSendReminder: () => void;
}

export function AccountStatusCard({ account, reminderSent, onSendReminder }: AccountStatusCardProps) {
  if (!account) {
    return (
      <Card className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-text">Account Status</h2>
        <p className="text-sm text-text-muted">Pay-as-you-go — charged at time of booking. No invoices or balances to track.</p>
      </Card>
    );
  }
  const { hasPastDue } = account;
  return (
    <Card className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-text">Account Status</h2>
      <div className={cn("rounded-lg border p-4", hasPastDue ? "border-danger/30 bg-tag-danger-bg/50" : "border-border bg-bg")}>
        <p className="text-sm font-semibold text-text">Past Due Balance</p>
        <p className={cn("mt-1 text-3xl font-bold", hasPastDue ? "text-danger" : "text-text")}>{account.pastDue}</p>
        <p className="mt-2 text-xs text-text-muted">{account.pastDueNote}</p>
      </div>
      <div className="flex justify-between border-b border-border pb-2 text-sm">
        <span className="text-text-muted">Next Invoice</span>
        <span className="font-semibold text-text">{account.nextInvoice}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-text-muted">Payment Terms</span>
        <span className="font-semibold text-text">{account.paymentTerms}</span>
      </div>
      {hasPastDue &&
        (reminderSent ? (
          <p className="flex items-center justify-center gap-1.5 rounded-lg bg-success/10 py-2 text-sm font-medium text-success">
            <CheckCircle2 className="h-4 w-4" />
            Reminder sent
          </p>
        ) : (
          <button
            type="button"
            onClick={onSendReminder}
            className="flex items-center justify-center gap-2 rounded-lg border border-border bg-bg py-2 text-sm font-medium text-text hover:bg-border/40"
          >
            <Mail className="h-4 w-4" />
            Send Reminder
          </button>
        ))}
    </Card>
  );
}

export function KeyLocationsCard({ locations }: { locations: CustomerSupportProfile["locations"] }) {
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-text">Key Locations</h2>
      {locations.map((location) => (
        <div key={location.name} className="flex gap-3">
          {location.kind === "hq" ? <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-text" /> : <Building className="mt-0.5 h-4 w-4 shrink-0 text-text" />}
          <div>
            <p className="text-sm font-semibold text-text">{location.name}</p>
            <p className="text-xs text-text-muted">{location.address}</p>
          </div>
        </div>
      ))}
    </Card>
  );
}

export function CustomerActivityCard({ activity, timelineHref }: { activity: CustomerSupportProfile["activity"]; timelineHref: string }) {
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-text">Recent Activity</h2>
      <ol className="flex flex-col gap-5">
        {activity.map((item, index) => (
          <li key={`${item.title}-${index}`} className="relative flex gap-3">
            {index < activity.length - 1 && <span className="absolute left-[4px] top-4 h-[calc(100%+0.5rem)] w-px bg-border" />}
            <span className={cn("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", item.tone === "primary" ? "bg-primary" : "bg-border")} />
            <div>
              <p className="text-sm font-semibold text-text">{item.title}</p>
              <p className="text-xs text-text-muted">{item.detail}</p>
              <p className="text-xs text-text-muted">{item.time}</p>
            </div>
          </li>
        ))}
      </ol>
      <Link to={timelineHref} className="rounded-lg border border-border py-2 text-center text-sm font-medium text-text hover:bg-bg">
        View Full Timeline
      </Link>
    </Card>
  );
}
