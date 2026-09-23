import { useState } from "react";
import { BadgeCheck, FileText, Maximize2 } from "lucide-react";
import { Card } from "../../../components/Card";
import type { ClaimInvestigation } from "../claimInvestigation";
import { EvidenceGpsTable, EvidencePhotos, EvidenceSignatureLog, EvidenceTabs, type EvidenceTab } from "./EvidencePanels";

const CARD_TAB_LABELS: Record<EvidenceTab, string> = { photos: "Delivery Photos", gps: "GPS Coordinates", signatures: "Signature Logs" };

interface ClaimEvidenceCardProps {
  claim: ClaimInvestigation;
  onOpenViewer: (tab: EvidenceTab) => void;
}

export function ClaimEvidenceCard({ claim, onOpenViewer }: ClaimEvidenceCardProps) {
  const [tab, setTab] = useState<EvidenceTab>("photos");

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <EvidenceTabs value={tab} labels={CARD_TAB_LABELS} onChange={setTab} />
        </div>
        <button
          type="button"
          onClick={() => onOpenViewer(tab)}
          className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          Open Viewer
        </button>
      </div>
      {claim.evidenceValidated && (
        <p className="flex items-center gap-1.5 text-sm font-medium text-success">
          <BadgeCheck className="h-4 w-4" />
          Evidence validated
        </p>
      )}
      {tab === "photos" && <EvidencePhotos photos={claim.photos} variant="card" onOpen={() => onOpenViewer("photos")} />}
      {tab === "gps" && <EvidenceGpsTable points={claim.gps} />}
      {tab === "signatures" && <EvidenceSignatureLog signatures={claim.signatures} />}
      {claim.attachments.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-border pt-3">
          <p className="text-label uppercase text-text-muted">Additional Evidence ({claim.attachments.length})</p>
          <ul className="flex flex-wrap gap-2">
            {claim.attachments.map((file) => (
              <li key={file.url}>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-text hover:border-primary/40 hover:text-primary"
                >
                  <FileText className="h-3.5 w-3.5" />
                  {file.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
