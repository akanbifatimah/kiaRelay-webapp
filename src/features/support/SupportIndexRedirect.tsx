import { Navigate } from "react-router-dom";
import { canAccessPath, useCurrentUser } from "../access/permissions";

// /support opens the first Support page this admin may use (TC-16): Support
// Department members land on their unit's queue, everyone else on
// Unassigned Tickets as before.
const CANDIDATES = ["/support/unassigned", "/support/queue", "/support/technical", "/support/claims"];

export function SupportIndexRedirect() {
  const user = useCurrentUser();
  const role = user?.role;
  const preferred = role === "lead-support" || role === "support-staff" ? "/support/queue" : role === "lead-tech" || role === "tech-staff" ? "/support/technical" : undefined;
  const target = preferred ?? CANDIDATES.find((path) => canAccessPath(user, path)) ?? "/support/claims";
  return <Navigate to={target} replace />;
}
