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
import { CustomersListPage } from "../features/customers/CustomersListPage";
import { CustomerProfilePage } from "../features/customers/CustomerProfilePage";
import { CustomerOrderHistoryPage } from "../features/customers/CustomerOrderHistoryPage";
import { PaymentMethodsPage } from "../features/customers/PaymentMethodsPage";
import { SupportAuditLogPage } from "../features/customers/SupportAuditLogPage";
import { CompanyUsersBranchesPage } from "../features/customers/CompanyUsersBranchesPage";
import { CompanyVerificationPage } from "../features/customers/CompanyVerificationPage";
import { CompanyInvoicesPage } from "../features/customers/CompanyInvoicesPage";
import { InvoiceDetailPage } from "../features/customers/InvoiceDetailPage";
import { DriverOnboardingPage } from "../features/drivers/DriverOnboardingPage";
import { PlaceholderPage } from "../components/PlaceholderPage";

const placeholderRoutes = [
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
      {
        path: "customers/individual",
        element: <CustomersListPage accountType="individual" title="Individual Customers" subtitle="Manage individual accounts, verification, activity, and billing." />,
      },
      {
        path: "customers/company",
        element: <CustomersListPage accountType="company" title="Company Customers" subtitle="Manage business accounts, verification, activity, and billing." />,
      },
      { path: "customers/:accountType/:id", element: <CustomerProfilePage /> },
      { path: "customers/:accountType/:id/orders", element: <CustomerOrderHistoryPage /> },
      { path: "customers/:accountType/:id/payments", element: <PaymentMethodsPage /> },
      { path: "customers/:accountType/:id/support", element: <SupportAuditLogPage /> },
      { path: "customers/:accountType/:id/branches", element: <CompanyUsersBranchesPage /> },
      { path: "customers/:accountType/:id/verification", element: <CompanyVerificationPage /> },
      { path: "customers/:accountType/:id/invoices", element: <CompanyInvoicesPage /> },
      { path: "customers/:accountType/:id/invoices/:invoiceId", element: <InvoiceDetailPage /> },
      { path: "drivers", element: <DriverOnboardingPage /> },
      ...placeholderRoutes.map(({ path, title, subtitle }) => ({
        path,
        element: <PlaceholderPage title={title} subtitle={subtitle} />,
      })),
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
