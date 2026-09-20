import { BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { Sparkline } from "../../../components/Sparkline";
import type { SegmentAnalysisEntry } from "../segmentAnalysis";

function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

export function SegmentAnalysisModal({ segments, onClose }: { segments: SegmentAnalysisEntry[]; onClose: () => void }) {
  return (
    <Modal
      size="lg"
      title={
        <>
          <BarChart3 className="h-5 w-5 text-primary" />
          Customer Segment Analysis
        </>
      }
      onClose={onClose}
      footer={
        <Button type="button" variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {segments.map((segment) => (
          <div key={segment.key} className="flex flex-col gap-3 rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-semibold text-text">{segment.label}</p>
              <p className="text-xs text-text-muted">6-month revenue trend</p>
            </div>
            <Sparkline data={segment.trend} />
            <div className="flex flex-col gap-1.5 border-t border-border pt-3">
              <p className="text-label text-text-muted">Top Customers</p>
              {segment.topCustomers.length === 0 ? (
                <p className="text-xs text-text-muted">No customers in this segment yet.</p>
              ) : (
                segment.topCustomers.map((customer) => (
                  <Link
                    key={customer.id}
                    to={`/customers/${customer.accountType}/${customer.id}`}
                    className="flex items-center justify-between text-sm hover:text-primary"
                  >
                    <span className="text-text">{customer.name}</span>
                    <span className="font-medium text-text-muted">{formatCurrency(customer.revenue)}</span>
                  </Link>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
