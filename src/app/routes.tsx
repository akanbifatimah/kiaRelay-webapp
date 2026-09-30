import { createBrowserRouter, Navigate } from "react-router-dom";
import { BusinessRegisterPage } from "../features/business/BusinessRegisterPage";
import { BusinessAccountPage } from "../features/business/BusinessAccountPage";
import { PortalShell } from "../features/business/portal/PortalShell";
import { PortalDashboardPage } from "../features/business/portal/pages/PortalDashboardPage";
import { BookDeliveryPage } from "../features/business/portal/pages/BookDeliveryPage";
import { DeliveriesPage } from "../features/business/portal/pages/DeliveriesPage";
import { DeliveryPage } from "../features/business/portal/pages/DeliveryPage";
import { PortalInvoicesPage } from "../features/business/portal/pages/PortalInvoicesPage";
import { PortalInvoicePage } from "../features/business/portal/pages/PortalInvoicePage";
import { SpendPage } from "../features/business/portal/pages/SpendPage";
import { TeamPage } from "../features/business/portal/pages/TeamPage";
import { LocationsPage } from "../features/business/portal/pages/LocationsPage";
import { HelpPage } from "../features/business/portal/pages/HelpPage";
import { AppShell } from "./layout/AppShell";
import { BUSINESS_BRAND } from "../constants/brand";
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
import { DriverManagementPage } from "../features/drivers/DriverManagementPage";
import { DriverProfilePage } from "../features/drivers/DriverProfilePage";
import { FinancePage } from "../features/finance/FinancePage";
import { RevenuePage } from "../features/finance/RevenuePage";
import { TransactionDetailPage } from "../features/finance/TransactionDetailPage";
import { RefundsAdjustmentsPage } from "../features/finance/RefundsAdjustmentsPage";
import { AdjustmentDetailPage } from "../features/finance/AdjustmentDetailPage";
import { FinanceCompanyInvoicesPage } from "../features/finance/FinanceCompanyInvoicesPage";
import { FinanceInvoicePage } from "../features/finance/FinanceInvoicePage";
import { DriverPayoutsOverviewPage } from "../features/finance/DriverPayoutsOverviewPage";
import { PayoutDetailPage } from "../features/finance/PayoutDetailPage";
import { PayoutSchedulesPage } from "../features/finance/PayoutSchedulesPage";
import { AssignDriversToSchedulePage } from "../features/finance/AssignDriversToSchedulePage";
import { MarketingDashboardPage } from "../features/marketing/MarketingDashboardPage";
import { CampaignsPage } from "../features/marketing/CampaignsPage";
import { EmailsListPage } from "../features/marketing/EmailsListPage";
import { CreateEmailPage } from "../features/marketing/CreateEmailPage";
import { EmailPreviewPage } from "../features/marketing/EmailPreviewPage";
import { EmailResultsPage } from "../features/marketing/EmailResultsPage";
import { NewslettersListPage } from "../features/marketing/NewslettersListPage";
import { CreateNewsletterPage } from "../features/marketing/CreateNewsletterPage";
import { NewsletterPerformancePage } from "../features/marketing/NewsletterPerformancePage";
import { NewsletterPreviewPage } from "../features/marketing/NewsletterPreviewPage";
import { TemplatesLibraryPage } from "../features/marketing/TemplatesLibraryPage";
import { CreateTemplatePage } from "../features/marketing/CreateTemplatePage";
import { UnassignedTicketsPage } from "../features/support/UnassignedTicketsPage";
import { SupportQueuePage } from "../features/support/SupportQueuePage";
import { TechnicalQueuePage } from "../features/support/TechnicalQueuePage";
import { SupportIndexRedirect } from "../features/support/SupportIndexRedirect";
import { MyTicketsPage } from "../features/support/MyTicketsPage";
import { TeamMonitoringPage } from "../features/support/TeamMonitoringPage";
import { TicketWorkspacePage } from "../features/support/TicketWorkspacePage";
import { ClaimInvestigationPage } from "../features/support/ClaimInvestigationPage";
import { ClaimsManagementPage } from "../features/support/ClaimsManagementPage";
import { CreateClaimPage } from "../features/support/CreateClaimPage";
import { DriverSupportPage } from "../features/support/DriverSupportPage";
import { DriverIncidentLogPage } from "../features/support/DriverIncidentLogPage";
import { CustomerSupportPage } from "../features/support/CustomerSupportPage";
import { RequesterTicketsPage } from "../features/support/RequesterTicketsPage";
import { KnowledgeBasePage } from "../features/support/KnowledgeBasePage";
import { ArticleEditorPage } from "../features/support/ArticleEditorPage";
import { ArticleDetailPage } from "../features/support/ArticleDetailPage";
import { ReportsDashboardPage } from "../features/reports/ReportsDashboardPage";
import { RevenueReportsPage } from "../features/reports/RevenueReportsPage";
import { CustomerPerformancePage } from "../features/reports/CustomerPerformancePage";
import { DriverPerformanceReportPage } from "../features/reports/DriverPerformanceReportPage";
import { ClaimsAnalyticsPage } from "../features/reports/ClaimsAnalyticsPage";
import { UserManagementPage } from "../features/users/UserManagementPage";
import { AuditLogPage } from "../features/users/AuditLogPage";
import { SettingsIndexRedirect } from "../features/settings/SettingsIndexRedirect";
import { CompanySettingsPage } from "../features/settings/CompanySettingsPage";
import { FinanceSettingsPage } from "../features/settings/FinanceSettingsPage";
import { OperationsSettingsPage } from "../features/settings/OperationsSettingsPage";
import { MarketingSettingsPage } from "../features/settings/MarketingSettingsPage";
import { MyAccountPage } from "../features/account/MyAccountPage";
import { HelpCenterPage } from "../features/help/HelpCenterPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/verify-code", element: <VerifyCodePage /> },
  { path: "/reset-password", element: <NewPasswordPage /> },
  // KiaRelay Business registration and account (TC-15) — outside the admin
  // shell, with their own session. Sign-in and password reset are the shared
  // /login and /forgot-password (2026-09-29); the old business-only URLs
  // redirect there so existing links keep working.
  { path: "/business/register", element: <BusinessRegisterPage /> },
  { path: "/business/login", element: <Navigate to="/login" replace /> },
  { path: "/business/forgot-password", element: <Navigate to="/forgot-password" replace /> },
  // The portal (2026-09-30) replaces the single account page; its old URL
  // lands on Company, which carries the verification status.
  { path: "/business/account", element: <Navigate to="/business/company" replace /> },
  {
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
      { path: "team", element: <TeamPage /> },
      { path: "locations", element: <LocationsPage /> },
      { path: "company", element: <BusinessAccountPage /> },
      { path: "help", element: <HelpPage /> },
    ],
  },
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
        element: <CustomersListPage accountType="company" title={`${BUSINESS_BRAND} Customers`} subtitle={`Manage ${BUSINESS_BRAND} company accounts, verification, activity, and billing.`} />,
      },
      { path: "customers/:accountType/:id", element: <CustomerProfilePage /> },
      { path: "customers/:accountType/:id/orders", element: <CustomerOrderHistoryPage /> },
      { path: "customers/:accountType/:id/payments", element: <PaymentMethodsPage /> },
      { path: "customers/:accountType/:id/support", element: <SupportAuditLogPage /> },
      { path: "customers/:accountType/:id/branches", element: <CompanyUsersBranchesPage /> },
      { path: "customers/:accountType/:id/verification", element: <CompanyVerificationPage /> },
      { path: "customers/:accountType/:id/invoices", element: <CompanyInvoicesPage /> },
      { path: "customers/:accountType/:id/invoices/:invoiceId", element: <InvoiceDetailPage /> },
      { path: "drivers", element: <DriverManagementPage /> },
      { path: "drivers/:id", element: <DriverProfilePage /> },
      { path: "finance", element: <FinancePage /> },
      { path: "finance/revenue", element: <RevenuePage /> },
      { path: "finance/transactions/:id", element: <TransactionDetailPage /> },
      { path: "finance/refunds", element: <RefundsAdjustmentsPage /> },
      { path: "finance/refunds/:id", element: <AdjustmentDetailPage /> },
      { path: "finance/invoices", element: <FinanceCompanyInvoicesPage /> },
      { path: "finance/invoices/:id", element: <FinanceInvoicePage /> },
      { path: "finance/payouts", element: <DriverPayoutsOverviewPage /> },
      { path: "finance/payouts/:id", element: <PayoutDetailPage /> },
      { path: "finance/payout-schedules", element: <PayoutSchedulesPage /> },
      { path: "finance/payout-schedules/:scheduleId/assign", element: <AssignDriversToSchedulePage /> },
      { path: "marketing", element: <MarketingDashboardPage /> },
      { path: "marketing/campaigns", element: <CampaignsPage /> },
      { path: "marketing/emails", element: <EmailsListPage /> },
      { path: "marketing/emails/new", element: <CreateEmailPage /> },
      { path: "marketing/emails/:id/preview", element: <EmailPreviewPage /> },
      { path: "marketing/emails/:id/results", element: <EmailResultsPage /> },
      { path: "marketing/newsletters", element: <NewslettersListPage /> },
      { path: "marketing/newsletters/new", element: <CreateNewsletterPage /> },
      { path: "marketing/newsletters/:id/preview", element: <NewsletterPreviewPage /> },
      { path: "marketing/newsletters/:id", element: <NewsletterPerformancePage /> },
      { path: "marketing/templates", element: <TemplatesLibraryPage /> },
      { path: "marketing/templates/new", element: <CreateTemplatePage /> },
      { path: "support", element: <SupportIndexRedirect /> },
      { path: "support/queue", element: <SupportQueuePage /> },
      { path: "support/technical", element: <TechnicalQueuePage /> },
      { path: "support/unassigned", element: <UnassignedTicketsPage /> },
      { path: "support/my-tickets", element: <MyTicketsPage /> },
      { path: "support/team", element: <TeamMonitoringPage /> },
      { path: "support/tickets/:id", element: <TicketWorkspacePage /> },
      { path: "support/claims", element: <ClaimsManagementPage /> },
      { path: "support/claims/new", element: <CreateClaimPage /> },
      { path: "support/claims/:id", element: <ClaimInvestigationPage /> },
      { path: "support/drivers/:driverId", element: <DriverSupportPage /> },
      { path: "support/drivers/:driverId/incidents", element: <DriverIncidentLogPage /> },
      { path: "support/customers/:customerId", element: <CustomerSupportPage /> },
      { path: "support/requesters/:kind/:id/tickets", element: <RequesterTicketsPage /> },
      { path: "support/knowledge-base", element: <KnowledgeBasePage /> },
      { path: "support/knowledge-base/new", element: <ArticleEditorPage /> },
      { path: "support/knowledge-base/:id", element: <ArticleDetailPage /> },
      { path: "support/knowledge-base/:id/edit", element: <ArticleEditorPage /> },
      { path: "reports", element: <ReportsDashboardPage /> },
      { path: "reports/revenue", element: <RevenueReportsPage /> },
      { path: "reports/customers", element: <CustomerPerformancePage /> },
      { path: "reports/drivers", element: <DriverPerformanceReportPage /> },
      { path: "reports/claims", element: <ClaimsAnalyticsPage /> },
      // Access to everything below (and above) is enforced centrally in
      // AppShell via features/access/permissions.ts.
      { path: "users", element: <UserManagementPage /> },
      { path: "users/audit-log", element: <AuditLogPage /> },
      { path: "settings", element: <SettingsIndexRedirect /> },
      { path: "settings/company", element: <CompanySettingsPage /> },
      { path: "settings/finance", element: <FinanceSettingsPage /> },
      { path: "settings/operations", element: <OperationsSettingsPage /> },
      { path: "settings/marketing", element: <MarketingSettingsPage /> },
      { path: "account", element: <MyAccountPage /> },
      { path: "help", element: <HelpCenterPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
