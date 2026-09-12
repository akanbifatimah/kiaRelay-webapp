import { Link } from "react-router-dom";
import { Card } from "../../../components/Card";
import { cn } from "../../../lib/cn";
import type { VerificationHistoryEntry } from "../companyVerification";

interface VerificationHistoryCardProps {
  entries: VerificationHistoryEntry[];
  auditLogHref: string;
}

// "View Full Log" links into the Support & Audit Logs page's existing
// Audit Log tab (`?tab=audit-log`) rather than a new page — verification
// events are just one kind of admin action on this account, and that tab
// already shows the full trail.
export function VerificationHistoryCard({ entries, auditLogHref }: VerificationHistoryCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">Verification History</h3>
        <Link to={auditLogHref} className="text-sm font-medium text-primary hover:underline">
          View Full Log
        </Link>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-text-muted">No verification activity yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => (
            <div key={entry.id} className="flex gap-3">
              <span
                className={cn(
                  "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                  entry.tone === "success" ? "bg-success" : "bg-warning",
                )}
              />
              <div>
                <p className="text-sm text-text">{entry.description}</p>
                <p className="text-xs text-text-muted">{entry.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
