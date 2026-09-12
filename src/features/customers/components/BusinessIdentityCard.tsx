import { Mail, Phone, MapPin, CheckCircle2, Clock, Circle, XCircle } from "lucide-react";
import { Card } from "../../../components/Card";
import { cn } from "../../../lib/cn";
import type { CompanyVerificationDetail, ChecklistItemStatus } from "../companyVerification";

const checklistIcon: Record<ChecklistItemStatus, typeof CheckCircle2> = {
  verified: CheckCircle2,
  pending: Clock,
  "not-started": Circle,
  rejected: XCircle,
};

const checklistClasses: Record<ChecklistItemStatus, string> = {
  verified: "text-success",
  pending: "text-warning",
  "not-started": "text-text-muted",
  rejected: "text-danger",
};

const checklistLabels: Record<ChecklistItemStatus, string> = {
  verified: "Verified",
  pending: "Pending",
  "not-started": "Not Started",
  rejected: "Rejected",
};

export function BusinessIdentityCard({ detail }: { detail: CompanyVerificationDetail }) {
  return (
    <Card className="flex flex-col gap-5">
      <div>
        <h3 className="text-label mb-2 text-text-muted">Business Identity</h3>
        <p className="text-label text-text-muted">Company Legal Name</p>
        <p className="text-sm font-semibold text-text">{detail.companyLegalName}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-label text-text-muted">Entity Type</p>
          <p className="mt-1 text-sm text-text">{detail.entityType}</p>
        </div>
        <div>
          <p className="text-label text-text-muted">Jurisdiction</p>
          <p className="mt-1 text-sm text-text">{detail.jurisdiction}</p>
        </div>
      </div>

      <div>
        <p className="text-label text-text-muted">Contact Email</p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-text">
          <Mail className="h-3.5 w-3.5 shrink-0 text-text-muted" />
          {detail.contactEmail}
        </p>
      </div>
      <div>
        <p className="text-label text-text-muted">Phone Number</p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-text">
          <Phone className="h-3.5 w-3.5 shrink-0 text-text-muted" />
          {detail.phoneNumber}
        </p>
      </div>
      <div>
        <p className="text-label text-text-muted">Registered Address</p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-text">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-text-muted" />
          {detail.registeredAddress}
        </p>
      </div>

      <div className="border-t border-border pt-4">
        <h3 className="text-label mb-2 text-text-muted">Verification Checklist</h3>
        <div className="flex flex-col gap-2">
          {detail.checklist.map((item) => {
            const Icon = checklistIcon[item.status];
            return (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-text">
                  <Icon className={cn("h-4 w-4", checklistClasses[item.status])} />
                  {item.label}
                </span>
                <span className={cn("text-xs font-medium", checklistClasses[item.status])}>
                  {checklistLabels[item.status]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
