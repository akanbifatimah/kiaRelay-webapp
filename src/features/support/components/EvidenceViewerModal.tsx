import { useState } from "react";
import { AlertTriangle, Download, Printer } from "lucide-react";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import type { ClaimInvestigation } from "../claimInvestigation";
import { EvidenceGpsTable, EvidencePhotos, EvidenceSignatureLog, EvidenceTabs, type EvidenceTab } from "./EvidencePanels";

const VIEWER_TAB_LABELS: Record<EvidenceTab, string> = { photos: "Photos", gps: "GPS Data", signatures: "Signatures" };

interface EvidenceViewerModalProps {
  claim: ClaimInvestigation;
  initialTab?: EvidenceTab;
  onClose: () => void;
  onPrint: () => void;
  onExport: () => void;
  onValidate: () => void;
}

export function EvidenceViewerModal({ claim, initialTab = "photos", onClose, onPrint, onExport, onValidate }: EvidenceViewerModalProps) {
  const [tab, setTab] = useState<EvidenceTab>(initialTab);

  return (
    <Modal
      title={
        <>
          <AlertTriangle className="h-5 w-5 text-primary" />
          Claim ID: #{claim.id}
        </>
      }
      subtitle={`${claim.serviceTag} • ${claim.type} • Assigned Dispatcher: ${claim.dispatcher}`}
      size="xl"
      onClose={onClose}
      footer={
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={onPrint}>
              <Printer className="h-3.5 w-3.5" />
              Print Report
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={onExport}>
              <Download className="h-3.5 w-3.5" />
              Export Media
            </Button>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={onValidate} disabled={claim.evidenceValidated}>
              {claim.evidenceValidated ? "Evidence Validated" : "Validate Evidence"}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <EvidenceTabs value={tab} labels={VIEWER_TAB_LABELS} onChange={setTab} />
        {tab === "photos" && <EvidencePhotos photos={claim.photos} variant="viewer" />}
        {tab === "gps" && <EvidenceGpsTable points={claim.gps} />}
        {tab === "signatures" && <EvidenceSignatureLog signatures={claim.signatures} />}
      </div>
    </Modal>
  );
}
