import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../features/auth/authStorage";

export function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    // The one sign-in page (LoginPage) sends admins back to the page they
    // asked for and business users to their account.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
