import { useState } from "react";
import { Star } from "lucide-react";
import { Card } from "../../../components/Card";
import { Avatar } from "../../../components/Avatar";
import { AllReviewsModal } from "./AllReviewsModal";
import { getAllReviews, type PerformanceReview } from "../driverPerformanceDetail";

interface CustomerFeedbackCardProps {
  driverId: string;
  driverName: string;
  reviews: PerformanceReview[];
  totalCount: number;
}

export function CustomerFeedbackCard({ driverId, driverName, reviews, totalCount }: CustomerFeedbackCardProps) {
  const [isViewingAll, setIsViewingAll] = useState(false);

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-label text-text-muted">Recent Customer Feedback</h3>
        <button
          type="button"
          onClick={() => setIsViewingAll(true)}
          className="text-xs font-medium text-primary hover:underline"
        >
          View All Reviews
        </button>
      </div>
      {reviews.length === 0 ? (
        <p className="py-6 text-center text-sm text-text-muted">No reviews yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {reviews.map((review) => (
            <div key={review.reviewer} className="flex flex-col gap-2 rounded-lg border border-border p-3">
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
              <p className="text-xs text-text-muted">{review.text}</p>
            </div>
          ))}
        </div>
      )}

      {isViewingAll && (
        <AllReviewsModal
          driverName={driverName}
          reviews={getAllReviews(driverId)}
          totalCount={totalCount}
          onClose={() => setIsViewingAll(false)}
        />
      )}
    </Card>
  );
}
