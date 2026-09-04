import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./layout/AppShell";
import { RootErrorBoundary } from "./RootErrorBoundary";
import { NotFoundPage } from "./NotFoundPage";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { OrdersPage } from "../features/orders/OrdersPage";
import { PlaceholderPage } from "../components/PlaceholderPage";

// TODO: replace each entry with its real feature page as screens/requirements
// are provided (Dashboard and Orders have been built so far).
const placeholderRoutes = [
  { path: "dispatch", title: "Dispatch — Live Operations", subtitle: "Live map, order queue, and driver assignment." },
  { path: "customers", title: "Customer Management", subtitle: "Individual and company accounts, billing, invoices." },
  { path: "drivers", title: "Driver Management", subtitle: "Onboarding queue, profiles, and performance." },
  { path: "claims", title: "Claims Management", subtitle: "Open, in-review, and resolved claims." },
  { path: "pricing", title: "Pricing Configuration", subtitle: "Base rates, modifiers, tiers, and surge rules." },
  { path: "reports", title: "Reporting & Business Intelligence", subtitle: "Delivery, revenue, and performance reports." },
  { path: "optimization", title: "AI & Optimization", subtitle: "Dynamic pricing, matching, and forecasting." },
  { path: "security", title: "Security & Audit", subtitle: "Audit log and MFA policy." },
  { path: "settings", title: "Settings", subtitle: "Profile and notification preferences." },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    errorElement: <RootErrorBoundary />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "orders", element: <OrdersPage /> },
      ...placeholderRoutes.map(({ path, title, subtitle }) => ({
        path,
        element: <PlaceholderPage title={title} subtitle={subtitle} />,
      })),
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
