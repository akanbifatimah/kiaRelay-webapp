import { Navigate } from "react-router-dom";
import { Clock, MapPinned, ShieldCheck } from "lucide-react";
import { getBusinessSession } from "../business/businessAccounts";
import { AuthLayout } from "./AuthLayout";
import { GetStartedMenu } from "./GetStartedMenu";

const HIGHLIGHTS = [
  { icon: MapPinned, title: "Real-time tracking", body: "Follow every delivery from pickup to drop-off." },
  { icon: Clock, title: "On-demand and scheduled", body: "Express, freight, healthcare, and overnight loads." },
  { icon: ShieldCheck, title: "Vetted drivers", body: "Background-checked drivers and proof of delivery." },
];

// The web app's front door (2026-09-28): what a signed-out visitor sees at
// "/". Get Started branches to KiaRelay Business (/business) or the staff
// sign-in (/login). RequireAuth renders it in place of the dashboard, so the
// URL stays "/".
export function WelcomePage() {
  if (getBusinessSession()) return <Navigate to="/business/account" replace />;

  return (
    <AuthLayout wide>
      <div className="pb-6 text-center">
        <h1 className="text-xl font-semibold text-text">Welcome to KiaRelay</h1>
        <p className="text-body mt-1 text-text-muted">Connected logistics. Delivered.</p>
      </div>

      <ul className="flex flex-col gap-4">
        {HIGHLIGHTS.map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-text">{title}</p>
              <p className="text-sm text-text-muted">{body}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <GetStartedMenu />
      </div>
    </AuthLayout>
  );
}
