import { ArrowLeft, ScrollText, Download } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Button } from "../../components/Button";
import { AdjustmentStatusBadge } from "./components/AdjustmentStatusBadge";
import { FinancialImpactCard } from "./components/FinancialImpactCard";
import { RelatedRecordsCard } from "./components/RelatedRecordsCard";
import { AdjustmentReasonCard } from "./components/AdjustmentReasonCard";
import { AdjustmentActivityCard } from "./components/AdjustmentActivityCard";
import { getAdjustmentDetail } from "./adjustmentDetail";
import { downloadAdjustmentPdf } from "./downloadAdjustmentPdf";

export function AdjustmentDetailPage() {
  const { id } = useParams<{ id: string }>();

  const detail = id ? getAdjustmentDetail(id) : null;
  if (!detail) return <Navigate to="/finance/refunds" replace />;

  const { adjustment } = detail;

  return (
    <div className="flex flex-col gap-6">
      <Link to="/finance/refunds" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Refunds & Adjustments
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-label text-text-muted">Adjustment Detail</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h1 className="text-heading-1 text-text">{adjustment.id}</h1>
            <AdjustmentStatusBadge status={adjustment.status} />
          </div>
          <p className="text-body mt-1 text-text-muted">Managed by {detail.managedBy}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/customers/${detail.customerAccountType}/${detail.customerId}/support?tab=audit-log`}>
            <Button variant="secondary">
              <ScrollText className="h-4 w-4" />
              Audit Logs
            </Button>
          </Link>
          <Button onClick={() => downloadAdjustmentPdf(detail)}>
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-sm lg:col-span-2">
          <h3 className="text-label text-text-muted">Adjustment Information</h3>
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="text-label text-text-muted">Adjustment ID</p>
              <p className="text-text">{adjustment.id}</p>
            </div>
            <div>
              <p className="text-label text-text-muted">Type</p>
              <p className="capitalize text-text">{adjustment.type}</p>
            </div>
            <div>
              <p className="text-label text-text-muted">Status</p>
              <AdjustmentStatusBadge status={adjustment.status} />
            </div>
            <div>
              <p className="text-label text-text-muted">Created Date</p>
              <p className="text-text">{detail.createdLabel}</p>
            </div>
            <div>
              <p className="text-label text-text-muted">Processed Date</p>
              <p className="text-text">{detail.processedLabel}</p>
            </div>
            <div>
              <p className="text-label text-text-muted">Created By</p>
              <p className="text-text">{detail.managedBy}</p>
            </div>
          </div>
        </div>
        <FinancialImpactCard adjustment={adjustment} remainingCharge={detail.remainingCharge} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RelatedRecordsCard records={detail.relatedRecords} />
        <AdjustmentReasonCard reason={detail.reason} />
      </div>

      <AdjustmentActivityCard initialNotes={detail.notes} />
    </div>
  );
}
