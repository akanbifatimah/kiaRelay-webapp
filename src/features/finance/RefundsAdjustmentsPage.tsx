import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader";
import { FinanceStatTile } from "./components/FinanceStatTile";
import { AdjustmentsSection } from "./components/AdjustmentsSection";
import { adjustmentStats } from "./adjustments";

export function RefundsAdjustmentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Link to="/finance" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Finance
      </Link>

      <PageHeader
        title="Refunds & Adjustments"
        subtitle="Review financial adjustments resulting from claims, delivery issues and customer account activity."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {adjustmentStats.map((stat) => (
          <FinanceStatTile key={stat.type} {...stat} />
        ))}
      </div>

      <AdjustmentsSection />
    </div>
  );
}
