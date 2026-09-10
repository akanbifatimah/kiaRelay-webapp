import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { StatTile } from "../../components/StatTile";
import { CustomerProfileHeader } from "./components/CustomerProfileHeader";
import { CustomerInfoCard } from "./components/CustomerInfoCard";
import { RecentOrdersCard } from "./components/RecentOrdersCard";
import { PaymentMethodsCard } from "./components/PaymentMethodsCard";
import { AccountVerificationCard } from "./components/AccountVerificationCard";
import { QuickActionsCard } from "./components/QuickActionsCard";
import { AccountGovernanceCard } from "./components/AccountGovernanceCard";
import { customers } from "./data";
import { getCustomerDetail } from "./customerDetails";

export function CustomerProfilePage() {
  const { accountType, id } = useParams<{ accountType: string; id: string }>();
  const customer = customers.find((c) => c.id === id);

  if (!customer) {
    return <Navigate to={`/customers/${accountType ?? "individual"}`} replace />;
  }

  const detail = getCustomerDetail(customer);
  const ordersHref = `/customers/${detail.accountType}/${detail.id}/orders`;
  const paymentsHref = `/customers/${detail.accountType}/${detail.id}/payments`;
  const supportHref = `/customers/${detail.accountType}/${detail.id}/support`;

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={`/customers/${detail.accountType}`}
        className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to {detail.accountType === "individual" ? "Individual" : "Company"} Customers
      </Link>

      <CustomerProfileHeader
        name={detail.name}
        status={detail.status}
        accountType={detail.accountType}
        joinedDate={detail.joinedDate}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile
          label="Total Orders"
          value={detail.totalOrders.toLocaleString()}
          accent="primary"
          delta={{ kind: "up", value: detail.ordersDelta }}
        />
        <StatTile label="Total Spent" value={detail.totalSpent} accent="neutral" />
        <StatTile label="AOV" value={detail.aov} accent="neutral" />
        <StatTile label="Preferred Type" value={detail.preferredType} accent="success" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <CustomerInfoCard
            fullName={detail.fullName}
            email={detail.email}
            emailVerified={detail.emailVerified}
            phone={detail.phone}
            phoneVerified={detail.phoneVerified}
            createdDate={detail.createdDate}
            lastActivity={detail.lastActivity}
          />
          <RecentOrdersCard orders={detail.recentOrders} viewAllHref={ordersHref} />
          <PaymentMethodsCard methods={detail.paymentMethods} />
        </div>
        <div className="flex flex-col gap-4">
          <AccountVerificationCard
            phoneVerifiedDate={detail.phoneVerifiedDate}
            emailVerifiedDate={detail.emailVerifiedDate}
            idVerifiedDate={detail.idVerifiedDate}
            fullyVerified={detail.fullyVerified}
          />
          <QuickActionsCard ordersHref={ordersHref} paymentsHref={paymentsHref} supportHref={supportHref} />
          <AccountGovernanceCard customerName={detail.name} creditTerms={detail.creditTerms} />
        </div>
      </div>
    </div>
  );
}
