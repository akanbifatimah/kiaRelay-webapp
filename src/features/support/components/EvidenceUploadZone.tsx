import { useRef, useState } from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import { cn } from "../../../lib/cn";
import { Tooltip } from "../../../components/Tooltip";
import type { ClaimAttachment } from "../claimInvestigation";

const ACCEPT = ".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg";
const MAX_BYTES = 10 * 1024 * 1024;

function formatSize(bytes: number): string {
  return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface EvidenceUploadZoneProps {
  value: ClaimAttachment[];
  onChange: (files: ClaimAttachment[]) => void;
  onRejected: (message: string) => void;
}

// Multi-file variant of drivers' single-image DocumentDropZone — claims can
// carry several PDFs/photos. Files stay in the browser as object URLs.
// TODO: upload to POST /claims/:id/attachments once storage exists.
export function EvidenceUploadZone({ value, onChange, onRejected }: EvidenceUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const accepted: ClaimAttachment[] = [];
    Array.from(list).forEach((file) => {
      if (!/\.(pdf|png|jpe?g)$/i.test(file.name)) return onRejected(`${file.name}: only PDF, PNG or JPG files are allowed.`);
      if (file.size > MAX_BYTES) return onRejected(`${file.name} is over the 10MB limit.`);
      accepted.push({ name: file.name, size: file.size, url: URL.createObjectURL(file) });
    });
    if (accepted.length) onChange([...value, ...accepted]);
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          addFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center gap-1 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border bg-bg hover:border-primary/40",
        )}
      >
        <UploadCloud className="h-5 w-5 text-text-muted" />
        <span className="text-sm font-medium text-text">Upload Additional Evidence</span>
        <span className="text-xs text-text-muted">Drag and drop or click to browse files (PDF, PNG, JPG · up to 10MB)</span>
      </div>
      <input ref={inputRef} type="file" multiple accept={ACCEPT} className="hidden" onChange={(event) => { addFiles(event.target.files); event.target.value = ""; }} />
      {value.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {value.map((file) => (
            <li key={file.url} className="flex items-center gap-3 rounded-md border border-border px-3 py-2 text-sm">
              <FileText className="h-4 w-4 shrink-0 text-text-muted" />
              <a href={file.url} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate text-text hover:text-primary hover:underline">
                {file.name}
              </a>
              <span className="text-xs text-text-muted">{formatSize(file.size)}</span>
              <Tooltip label={`Remove ${file.name}`}>
                <button type="button" aria-label={`Remove ${file.name}`} onClick={() => onChange(value.filter((item) => item.url !== file.url))} className="text-text-muted hover:text-danger">
                  <X className="h-4 w-4" />
                </button>
              </Tooltip>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
