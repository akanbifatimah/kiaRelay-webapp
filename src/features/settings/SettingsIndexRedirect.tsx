import { Navigate } from "react-router-dom";
import { firstSettingsPath, useCurrentUser } from "../access/permissions";

// /settings → the first Settings page this admin may open. AppShell's rule
// for /settings already requires at least one area module, so the fallback
// only guards against the page list and rules drifting apart.
export function SettingsIndexRedirect() {
  const user = useCurrentUser();
  return <Navigate to={firstSettingsPath(user) ?? "/"} replace />;
}
