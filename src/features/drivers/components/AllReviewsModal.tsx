import { Star } from "lucide-react";
import { Modal } from "../../../components/Modal";
import { Avatar } from "../../../components/Avatar";
import type { PerformanceReview } from "../driverPerformanceDetail";

interface AllReviewsModalProps {
  driverName: string;
  reviews: PerformanceReview[];
  totalCount: number;
  onClose: () => void;
}

export function AllReviewsModal({ driverName, reviews, totalCount, onClose }: AllReviewsModalProps) {
  return (
    <Modal
      title={`${driverName}'s Reviews`}
      subtitle={`Showing ${reviews.length} of ${totalCount} total reviews`}
      size="xl"
      onClose={onClose}
    >
      <div className="flex flex-col gap-3">
        {reviews.map((review, index) => (
          <div key={`${review.reviewer}-${index}`} className="flex flex-col gap-2 rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar name={review.reviewer} size="sm" />
                <div>
                  <p className="text-sm font-medium text-text">{review.reviewer}</p>
                  <p className="text-xs text-text-muted">Order {review.orderRef}</p>
                </div>
              </div>
              <span className="flex items-center gap-0.5 text-warning">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-warning" />
                ))}
              </span>
            </div>
            <p className="text-sm text-text-muted">{review.text}</p>
          </div>
        ))}
      </div>
    </Modal>
  );
}
