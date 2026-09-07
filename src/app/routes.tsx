import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./layout/AppShell";
import { RequireAuth } from "./RequireAuth";
import { RootErrorBoundary } from "./RootErrorBoundary";
import { NotFoundPage } from "./NotFoundPage";
import { LoginPage } from "../features/auth/LoginPage";
import { ForgotPasswordPage } from "../features/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "../features/auth/ResetPasswordPage";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { OrdersPage } from "../features/orders/OrdersPage";
import { DispatchPage } from "../features/dispatch/DispatchPage";
import { PlaceholderPage } from "../components/PlaceholderPage";

// TODO: replace each entry with its real feature page as screens/requirements
// are provided (Dashboard, Orders, and Dispatch have been built so far).
// Matches the sidebar as of the 2026-09-07 nav update — see Sidebar.tsx.
// "Marketing" isn't one of the PRD §9 admin modules; flagged for the user to
// confirm before it grows beyond a placeholder.
const placeholderRoutes = [
  { path: "customers", title: "Customer Management", subtitle: "Individual and company accounts, billing, invoices." },
  { path: "drivers", title: "Driver Management", subtitle: "Onboarding queue, profiles, and performance." },
  { path: "finance", title: "Financial Management", subtitle: "Ledger, payouts, refunds, and company invoicing." },
  { path: "marketing", title: "Marketing", subtitle: "Not yet scoped in the PRD — confirm requirements." },
  { path: "reports", title: "Reporting & Business Intelligence", subtitle: "Delivery, revenue, and performance reports." },
  { path: "support", title: "Support", subtitle: "Customer/driver support queue and escalations." },
];

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
  {
    path: "/",
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    errorElement: <RootErrorBoundary />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "dispatch", element: <DispatchPage /> },
      ...placeholderRoutes.map(({ path, title, subtitle }) => ({
        path,
        element: <PlaceholderPage title={title} subtitle={subtitle} />,
      })),
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
