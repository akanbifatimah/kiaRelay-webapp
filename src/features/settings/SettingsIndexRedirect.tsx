import { Navigate } from "react-router-dom";
import { firstSettingsPath, useCurrentUser } from "../access/permissions";

// /settings → the first Settings page this admin may open. The access rule
// for /settings itself (Settings module) runs first in AppShell, so reaching
// here with no permitted page only happens when e.g. Finance Settings is the
// sole page and its domain module was revoked — Company is then the fallback.
export function SettingsIndexRedirect() {
  const user = useCurrentUser();
  return <Navigate to={firstSettingsPath(user) ?? "/settings/company"} replace />;
}
