import { useState } from "react";
import { Card } from "../../../components/Card";
import { Pagination } from "../../../components/Pagination";
import { IdVerificationReviewModal } from "../../../components/IdVerificationReviewModal";
import { DriverQueueTable } from "./DriverQueueTable";
import { driverApplications as initialApplications, getVerificationCase, type DriverApplication } from "../data";

// Moved from the old standalone DriverOnboardingPage — same behavior, now one
// tab of Driver Management instead of the whole page.
export function OnboardingQueueSection() {
  const [applications, setApplications] = useState<DriverApplication[]>(initialApplications);
  const [reviewing, setReviewing] = useState<DriverApplication | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const pageCount = Math.max(1, Math.ceil(applications.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = applications.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function updateStatus(id: string, status: DriverApplication["status"]) {
    setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status } : app)));
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-4">
        <DriverQueueTable rows={pageRows} onReview={setReviewing} />
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={applications.length}
          pageSize={pageSize}
          itemLabel="applications"
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </Card>

      {reviewing && (
        <IdVerificationReviewModal
          caseData={getVerificationCase(reviewing)}
          onClose={() => setReviewing(null)}
          onApprove={() => updateStatus(reviewing.id, "approved")}
          onReject={() => updateStatus(reviewing.id, "rejected")}
        />
      )}
    </div>
  );
}
