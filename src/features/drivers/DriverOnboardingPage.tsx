import { useState } from "react";
import { PageHeader } from "../../components/PageHeader";
import { Card } from "../../components/Card";
import { IdVerificationReviewModal } from "../../components/IdVerificationReviewModal";
import { DriverQueueTable } from "./components/DriverQueueTable";
import { driverApplications as initialApplications, getVerificationCase, type DriverApplication } from "./data";

// TODO: this is a minimal stand-in for the real onboarding queue (PRD
// §9.5 — background-check status, filters/export per the module's own
// requirements) until its own screens are provided. Wired up enough that
// each "pending" row's 3-dot menu launches the shared ID Verification
// Review modal, which is the piece that's actually designed.
export function DriverOnboardingPage() {
  const [applications, setApplications] = useState<DriverApplication[]>(initialApplications);
  const [reviewing, setReviewing] = useState<DriverApplication | null>(null);

  function updateStatus(id: string, status: DriverApplication["status"]) {
    setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, status } : app)));
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Driver Onboarding"
        subtitle="Review pending applications and background-check status."
      />

      <Card className="flex flex-col gap-4">
        <DriverQueueTable rows={applications} onReview={setReviewing} />
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
