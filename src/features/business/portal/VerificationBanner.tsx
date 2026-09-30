import { Link } from "react-router-dom";
import { Clock, ShieldAlert } from "lucide-react";
import type { BusinessAccount } from "../businessAccounts";

/** Shown across the portal until KiaRelay approves the company. */
export function VerificationBanner({ account }: { account: BusinessAccount }) {
  if (account.status === "verified") return null;
  const rejected = account.status === "rejected";
  const Icon = rejected ? ShieldAlert : Clock;
  return (
    <div className={rejected ? "flex items-center gap-3 border-b border-danger/20 bg-danger/10 px-4 py-2.5 sm:px-6" : "flex items-center gap-3 border-b border-warning/20 bg-warning/10 px-4 py-2.5 sm:px-6"}>
      <Icon className={rejected ? "h-4 w-4 shrink-0 text-danger" : "h-4 w-4 shrink-0 text-warning"} />
      <p className="flex-1 text-sm text-text">
        {rejected
          ? "Your verification needs attention — some details didn't match. Booking stays locked until it's resolved."
          : `Application ${account.reference} is under review. You can explore the portal; booking opens once you're approved.`}
      </p>
      <Link to="/business/company" className="text-sm font-medium text-primary hover:underline">
        View status
      </Link>
    </div>
  );
}
