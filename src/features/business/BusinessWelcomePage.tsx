import { Link, Navigate } from "react-router-dom";
import { Building2, MapPinned, ReceiptText, Users } from "lucide-react";
import { BUSINESS_BRAND } from "../../constants/brand";
import { AuthLayout } from "../auth/AuthLayout";
import { getBusinessSession } from "./businessAccounts";

const HIGHLIGHTS = [
  { icon: MapPinned, title: "Book and track deliveries", body: "Schedule shipments and follow every load in real time." },
  { icon: Users, title: "Your team, every branch", body: "Add branches and give your staff their own sign-ins." },
  { icon: ReceiptText, title: "Invoiced billing", body: "Pay on credit terms with one monthly invoice." },
];

// KiaRelay Business front door (2026-09-28), modelled on ColCare mobile's
// welcome → sign-in/sign-up split so neither form has to carry the other's
// links. Reached from the general WelcomePage at "/" and from the website's
// Log In menu.
export function BusinessWelcomePage() {
  if (getBusinessSession()) return <Navigate to="/business/account" replace />;

  return (
    <AuthLayout wide backTo="/">
      <div className="pb-6 text-center">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Building2 className="h-3.5 w-3.5" />
          {BUSINESS_BRAND}
        </p>
        <h1 className="mt-3 text-xl font-semibold text-text">Welcome to {BUSINESS_BRAND}</h1>
        <p className="text-body mt-1 text-text-muted">Company shipping, managed in one place.</p>
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

      {/* Links styled as buttons: Button renders a <button>, and these navigate. */}
      <div className="mt-8 flex flex-col gap-3">
        <Link
          to="/business/register"
          className="flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
        >
          Get Started
        </Link>
        <Link
          to="/business/login"
          className="flex items-center justify-center rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-bg"
        >
          I already have an account
        </Link>
      </div>
    </AuthLayout>
  );
}
