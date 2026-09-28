import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../features/auth/authStorage";
import { WelcomePage } from "../features/auth/WelcomePage";

export function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    // The bare domain is everyone's front door, so it shows the general
    // welcome page (Business or Admin). Any deeper URL is a staff page, so it
    // goes to the admin login and returns there afterwards.
    if (location.pathname === "/") return <WelcomePage />;
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
