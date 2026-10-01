import type { RouteObject } from "react-router-dom";
import { RootErrorBoundary } from "../../../app/RootErrorBoundary";
import { BusinessAccountPage } from "../BusinessAccountPage";
import { PortalShell } from "./PortalShell";
import { PortalDashboardPage } from "./pages/PortalDashboardPage";
import { BookDeliveryPage } from "./pages/BookDeliveryPage";
import { DeliveriesPage } from "./pages/DeliveriesPage";
import { DeliveryPage } from "./pages/DeliveryPage";
import { PortalInvoicesPage } from "./pages/PortalInvoicesPage";
import { PortalInvoicePage } from "./pages/PortalInvoicePage";
import { SpendPage } from "./pages/SpendPage";
import { TeamPage } from "./pages/TeamPage";
import { LocationsPage } from "./pages/LocationsPage";
import { HelpPage } from "./pages/HelpPage";
import { Navigate } from "react-router-dom";
import { SettingsPage } from "./settings/SettingsPage";
import { NotificationSettingsPage, PaymentSettingsPage, PersonalSettingsPage, VerificationSettingsPage } from "./settings/SettingsSubPages";
import { PasswordSettingsPage } from "./settings/PasswordSettingsPage";
import { CloseAccountPage } from "./settings/CloseAccountPage";
import { IncidentsPage } from "./incidents/IncidentsPage";
import { NewIncidentPage } from "./incidents/NewIncidentPage";
import { IncidentPage } from "./incidents/IncidentPage";

// KiaRelay Business portal routes (2026-09-30), split out of app/routes.tsx.
// The shell checks the business session; every page lives under /business.
export const portalRoutes: RouteObject = {
  path: "/business",
  element: <PortalShell />,
  errorElement: <RootErrorBoundary />,
  children: [
    { index: true, element: <PortalDashboardPage /> },
    { path: "book", element: <BookDeliveryPage /> },
    { path: "deliveries", element: <DeliveriesPage /> },
    { path: "deliveries/:orderNo", element: <DeliveryPage /> },
    { path: "invoices", element: <PortalInvoicesPage /> },
    { path: "invoices/:invoiceId", element: <PortalInvoicePage /> },
    { path: "spend", element: <SpendPage /> },
    { path: "incidents", element: <IncidentsPage /> },
    { path: "incidents/new", element: <NewIncidentPage /> },
    { path: "incidents/:incidentId", element: <IncidentPage /> },
    { path: "team", element: <TeamPage /> },
    { path: "locations", element: <LocationsPage /> },
    { path: "company", element: <BusinessAccountPage /> },
    { path: "help", element: <HelpPage /> },
    { path: "me", element: <Navigate to="/business/settings" replace /> },
    { path: "settings", element: <SettingsPage /> },
    { path: "settings/personal", element: <PersonalSettingsPage /> },
    { path: "settings/verification", element: <VerificationSettingsPage /> },
    { path: "settings/notifications", element: <NotificationSettingsPage /> },
    { path: "settings/payment-methods", element: <PaymentSettingsPage /> },
    { path: "settings/password", element: <PasswordSettingsPage /> },
    { path: "settings/close", element: <CloseAccountPage /> },
  ],
};
