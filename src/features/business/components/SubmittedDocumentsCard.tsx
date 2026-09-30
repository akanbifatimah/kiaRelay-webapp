import { ExternalLink, FileSignature } from "lucide-react";
import { Card } from "../../../components/Card";
import { BUSINESS_DOCUMENTS } from "../businessDocuments";
import type { BusinessAccount } from "../businessTypes";

const formatBytes = (bytes: number) => (bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)}MB` : `${Math.max(1, Math.round(bytes / 1024))}KB`);

// The documents and optional credit application a KiaRelay Business account
// submitted at registration. Shown to the business on its account page and
// to admins reviewing the company's verification.
export function SubmittedDocumentsCard({ account, title = "Submitted documents" }: { account: BusinessAccount; title?: string }) {
  const credit = account.creditApplication;
  return (
    <Card className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-text">{title}</h2>
      <ul className="flex flex-col divide-y divide-border text-sm">
        {BUSINESS_DOCUMENTS.map((doc) => {
          const file = account.documents[doc.key];
          return (
            <li key={doc.key} className="flex items-center gap-3 py-2.5">
              <doc.icon className="h-4 w-4 shrink-0 text-text-muted" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-text">{doc.title}</p>
                <p className="truncate text-xs text-text-muted">{file ? `${file.name} · ${formatBytes(file.size)}` : "Not uploaded"}</p>
              </div>
              {file?.dataUrl ? (
                <a href={file.dataUrl} download={file.name} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  Open
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                // TODO: link to the stored file once documents upload to the API.
                file && <span className="text-xs text-text-muted">Preview after upload</span>
              )}
            </li>
          );
        })}
      </ul>
      <div className="flex items-start gap-3 rounded-lg bg-bg p-3 text-sm">
        <FileSignature className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />
        {credit ? (
          <p className="text-text">
            <span className="font-medium">Credit application (Net-30):</span> ${credit.requestedLimit.replace(/^\$/, "")} limit requested · ${credit.annualRevenue.replace(/^\$/, "")} annual revenue ·{" "}
            {credit.yearsInBusiness} yrs in business · Bank: {credit.bankName}
          </p>
        ) : (
          <p className="text-text-muted">No credit application. Standard billing.</p>
        )}
      </div>
    </Card>
  );
}
