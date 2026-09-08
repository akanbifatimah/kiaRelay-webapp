import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./layout/AppShell";
import { RequireAuth } from "./RequireAuth";
import { RootErrorBoundary } from "./RootErrorBoundary";
import { NotFoundPage } from "./NotFoundPage";
import { LoginPage } from "../features/auth/LoginPage";
import { ForgotPasswordPage } from "../features/auth/ForgotPasswordPage";
import { VerifyCodePage } from "../features/auth/VerifyCodePage";
import { NewPasswordPage } from "../features/auth/NewPasswordPage";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { OrdersPage } from "../features/orders/OrdersPage";
import { DispatchPage } from "../features/dispatch/DispatchPage";
import { PlaceholderPage } from "../components/PlaceholderPage";

const placeholderRoutes = [
  { path: "customers", title: "Customer Management", subtitle: "Individual and company accounts, billing, invoices." },
  { path: "drivers", title: "Driver Management", subtitle: "Onboarding queue, profiles, and performance." },
  { path: "finance", title: "Financial Management", subtitle: "Ledger, payouts, refunds, and company invoicing." },
  { path: "marketing", title: "Marketing", subtitle: "Campaign and outreach management." },
  { path: "reports", title: "Reporting & Business Intelligence", subtitle: "Delivery, revenue, and performance reports." },
  { path: "support", title: "Support", subtitle: "Customer/driver support queue and escalations." },
];

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/verify-code", element: <VerifyCodePage /> },
  { path: "/reset-password", element: <NewPasswordPage /> },
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
