import { useRef, useState } from "react";
import { CheckCircle2, RefreshCw, Trash2, Upload, type LucideIcon } from "lucide-react";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { useToast } from "../../../components/toast/ToastContext";
import { cn } from "../../../lib/cn";
import type { UploadedDocument } from "../businessTypes";

const MAX_BYTES = 10 * 1024 * 1024;
/** Small files keep a data URL so admins can open them in the mock. Kept low
 * so three documents fit in localStorage (~5MB); larger files store name and
 * size only. TODO: upload to the API instead. */
const PREVIEW_BYTES = 300 * 1024;

const formatBytes = (bytes: number) => (bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)}MB` : `${Math.max(1, Math.round(bytes / 1024))}KB`);

const readDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

interface DocumentUploadTileProps {
  title: string;
  description: string;
  icon: LucideIcon;
  value?: UploadedDocument;
  onChange: (doc: UploadedDocument | undefined) => void;
  hasError?: boolean;
}

/** One "Business verification" document: Upload, then Replace / Remove (confirmed). */
export function DocumentUploadTile({ title, description, icon: Icon, value, onChange, hasError }: DocumentUploadTileProps) {
  const { showToast } = useToast();
  const input = useRef<HTMLInputElement>(null);
  const [confirmRemove, setConfirmRemove] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (file.size > MAX_BYTES) return showToast("error", "Upload a PDF or image under 10MB.");
    const dataUrl = file.size <= PREVIEW_BYTES ? await readDataUrl(file) : undefined;
    onChange({ name: file.name, size: file.size, mimeType: file.type, dataUrl });
  }

  return (
    <div className={cn("flex flex-col gap-3 rounded-(--radius-card) border bg-surface p-4", hasError ? "border-danger" : "border-border")}>
      <div className="flex gap-3">
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", value ? "bg-success/10 text-success" : "bg-primary/10 text-primary")}>
          {value ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-text">{title}</p>
          <p className="truncate text-sm text-text-muted">{value ? `Uploaded: ${value.name} (${formatBytes(value.size)})` : description}</p>
        </div>
      </div>
      <input ref={input} type="file" accept="application/pdf,image/*" hidden onChange={(event) => void handleFile(event.target.files?.[0]).finally(() => (event.target.value = ""))} />
      {value ? (
        <div className="flex gap-5 text-sm font-medium">
          <button type="button" onClick={() => input.current?.click()} className="flex items-center gap-1.5 text-text-muted hover:text-text">
            <RefreshCw className="h-4 w-4" />
            Replace
          </button>
          <button type="button" onClick={() => setConfirmRemove(true)} className="flex items-center gap-1.5 text-danger hover:underline">
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => input.current?.click()} className="flex h-10 items-center justify-center gap-2 rounded-lg bg-field text-sm font-semibold text-text hover:bg-border">
          <Upload className="h-4 w-4" />
          Upload
        </button>
      )}
      {confirmRemove && (
        <ConfirmModal
          title="Remove document?"
          message={`${value?.name} will be removed from your application.`}
          confirmLabel="Remove"
          tone="danger"
          onCancel={() => setConfirmRemove(false)}
          onConfirm={() => {
            onChange(undefined);
            setConfirmRemove(false);
          }}
        />
      )}
    </div>
  );
}
