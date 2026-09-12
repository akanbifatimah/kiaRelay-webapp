import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { IdVerificationReviewModal } from "../../../components/IdVerificationReviewModal";
import { CompanyProfileHeader } from "./CompanyProfileHeader";
import { CompanyStatsRow } from "./CompanyStatsRow";
import { CompanyBusinessInfoCard } from "./CompanyBusinessInfoCard";
import { CompanyBillingConfigCard } from "./CompanyBillingConfigCard";
import { CompanyManagementGrid } from "./CompanyManagementGrid";
import { CompanyRecentActivityCard } from "./CompanyRecentActivityCard";
import { getCompanyOverview, type CompanyBillingConfig } from "../companyOverview";
import { getCustomerVerificationCase } from "../identityVerification";
import type { CustomerDetail } from "../customerDetails";
import type { Customer } from "../data";

interface CompanyDashboardProps {
  customer: Customer;
  detail: CustomerDetail;
  ordersHref: string;
  supportHref: string;
  usersBranchesHref: string;
  invoicesHref: string;
}

export function CompanyDashboard({
  customer,
  detail,
  ordersHref,
  supportHref,
  usersBranchesHref,
  invoicesHref,
}: CompanyDashboardProps) {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [overview, setOverview] = useState(() => getCompanyOverview(detail));

  function handleBillingConfigUpdate(billingConfig: CompanyBillingConfig) {
    setOverview((prev) => ({ ...prev, billingConfig }));
  }

  return (
    <div className="flex flex-col gap-4">
      <Link
        to={`/customers/${detail.accountType}`}
        className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Company Customers
      </Link>

      <CompanyProfileHeader
        name={detail.name}
        registrationNumber={detail.registrationNumber}
        industry={detail.industry}
        location={detail.location}
        recentOrders={detail.recentOrders}
      />

      <CompanyStatsRow
        totalDeliveries={detail.totalOrders}
        deliveriesDelta={detail.ordersDelta}
        activeDeliveries={overview.activeDeliveries}
        pendingDeliveries={overview.pendingDeliveries}
      />

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <CompanyBusinessInfoCard info={overview.businessInfo} />
        <CompanyBillingConfigCard
          config={overview.billingConfig}
          invoicesHref={invoicesHref}
          onUpdate={handleBillingConfigUpdate}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <CompanyManagementGrid
          ordersHref={ordersHref}
          invoicesHref={invoicesHref}
          supportHref={supportHref}
          usersBranchesHref={usersBranchesHref}
          onVerifyApplication={() => setIsVerifying(true)}
        />
        <CompanyRecentActivityCard activity={overview.recentActivity} />
      </div>

      {isVerifying && (
        <IdVerificationReviewModal
          caseData={getCustomerVerificationCase(customer)}
          onClose={() => setIsVerifying(false)}
          onApprove={() => navigate(`/customers/${detail.accountType}/${detail.id}/verification`)}
        />
      )}
    </div>
  );
}
