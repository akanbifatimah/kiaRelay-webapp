import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader";
import { FinanceStatTile } from "./components/FinanceStatTile";
import { CompanyInvoicesSection } from "./components/CompanyInvoicesSection";
import { companyInvoiceStats } from "./companyInvoicesOverview";

export function FinanceCompanyInvoicesPage() {
  return (
    <div className="flex flex-col gap-6">
      <Link to="/finance" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Finance
      </Link>

      <PageHeader title="Company Invoices" subtitle="Track invoicing across every company account on the platform." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {companyInvoiceStats.map((stat) => (
          <FinanceStatTile key={stat.type} {...stat} />
        ))}
      </div>

      <CompanyInvoicesSection />
    </div>
  );
}
