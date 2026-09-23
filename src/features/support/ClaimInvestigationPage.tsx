import { useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "../../components/toast/ToastContext";
import type { ClaimInvestigation } from "./claimInvestigation";
import { saveClaim, useClaim } from "./claims";
import { escalateClaim, moveToReview, resolveClaim, validateEvidence } from "./claimActions";
import { exportEvidenceMedia, printEvidenceReport } from "./printEvidenceReport";
import { SupportBackLink } from "./components/SupportBackLink";
import { SupportNotFound } from "./components/SupportNotFound";
import { ClaimHeader } from "./components/ClaimHeader";
import { ClaimSummaryCard } from "./components/ClaimSummaryCard";
import { ClaimEvidenceCard } from "./components/ClaimEvidenceCard";
import { RelatedAssetsCard } from "./components/RelatedAssetsCard";
import { ClaimTimelineCard } from "./components/ClaimTimelineCard";
import { SimilarIncidentsCard } from "./components/SimilarIncidentsCard";
import { EvidenceViewerModal } from "./components/EvidenceViewerModal";
import { ResolveClaimModal } from "./components/ResolveClaimModal";
import { EscalateClaimModal } from "./components/EscalateClaimModal";
import { EditClaimSummaryModal } from "./components/EditClaimSummaryModal";
import type { EvidenceTab } from "./components/EvidencePanels";

type OpenModal = { kind: "viewer"; tab: EvidenceTab } | { kind: "resolve" } | { kind: "escalate" } | { kind: "edit" } | null;

export function ClaimInvestigationPage() {
  const { id = "" } = useParams();
  const { showToast } = useToast();
  const claim = useClaim(id);
  const [modal, setModal] = useState<OpenModal>(null);
  const close = () => setModal(null);

  if (!claim) return <SupportNotFound what="claim" id={id} />;

  // Writes to the session claims store (see claimActions.ts for the TODOs).
  function apply(next: ClaimInvestigation, message: string) {
    saveClaim(next);
    close();
    showToast("success", message);
  }

  return (
    <div className="flex flex-col gap-6">
      <SupportBackLink />
      <ClaimHeader
        claim={claim}
        onMoveToReview={() => apply(moveToReview(claim), `${claim.id} moved to In Review.`)}
        onResolve={() => setModal({ kind: "resolve" })}
        onEscalate={() => setModal({ kind: "escalate" })}
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="flex min-w-0 flex-col gap-6">
          <ClaimSummaryCard claim={claim} onEdit={() => setModal({ kind: "edit" })} />
          <ClaimEvidenceCard claim={claim} onOpenViewer={(tab) => setModal({ kind: "viewer", tab })} />
        </div>
        <div className="flex flex-col gap-6">
          <RelatedAssetsCard claim={claim} />
          <ClaimTimelineCard entries={claim.timeline} />
        </div>
      </div>
      <SimilarIncidentsCard incidents={claim.similarIncidents} />

      {modal?.kind === "viewer" && (
        <EvidenceViewerModal
          claim={claim}
          initialTab={modal.tab}
          onClose={close}
          onPrint={() => printEvidenceReport(claim)}
          onExport={() => {
            if (claim.photos.length === 0) return showToast("error", "This claim has no photos to export.");
            exportEvidenceMedia(claim);
            showToast("success", `Downloading ${claim.photos.length} evidence files.`);
          }}
          onValidate={() => apply(validateEvidence(claim), "Evidence validated and logged to the claim timeline.")}
        />
      )}
      {modal?.kind === "resolve" && (
        <ResolveClaimModal claim={claim} onClose={close} onResolve={(values) => apply(resolveClaim(claim, values), `${claim.id} resolved.`)} />
      )}
      {modal?.kind === "escalate" && (
        <EscalateClaimModal
          claim={claim}
          onClose={close}
          onEscalate={(values) => apply(escalateClaim(claim, values), `${claim.id} escalated to ${values.team}.`)}
        />
      )}
      {modal?.kind === "edit" && (
        <EditClaimSummaryModal
          claim={claim}
          onClose={close}
          onSave={(values) =>
            apply(
              { ...claim, incidentDescription: values.incidentDescription.trim(), internalNotes: values.internalNotes.trim() },
              "Claim summary updated.",
            )
          }
        />
      )}
    </div>
  );
}
