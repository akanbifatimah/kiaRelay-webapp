import { useRef, useState } from "react";
import { UploadCloud, FileImage, X } from "lucide-react";
import { cn } from "../../../lib/cn";

interface DocumentDropZoneProps {
  previewUrl: string | null;
  fileName?: string;
  onFileSelected: (file: File) => void;
  onRemove: () => void;
}

// Split out of AddDocumentModal.tsx once it passed the 150-line limit —
// owns its own drag state and file-input ref, since neither is needed
// outside this component.
export function DocumentDropZone({ previewUrl, fileName, onFileSelected, onRemove }: DocumentDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <span className="text-sm text-text-muted">File</span>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          const dropped = event.dataTransfer.files[0];
          if (dropped) onFileSelected(dropped);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "mt-1 flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border hover:bg-bg",
        )}
      >
        {previewUrl ? (
          <div className="flex w-full items-center gap-3">
            <img src={previewUrl} alt={fileName} className="h-16 w-24 rounded-md border border-border object-cover" />
            <div className="flex min-w-0 flex-1 flex-col items-start text-left">
              <span className="truncate text-sm font-medium text-text">{fileName}</span>
              <span className="text-xs text-text-muted">Click to replace</span>
            </div>
            <button
              type="button"
              aria-label="Remove file"
              onClick={(event) => {
                event.stopPropagation();
                onRemove();
              }}
              className="text-text-muted hover:text-danger"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <UploadCloud className="h-6 w-6 text-text-muted" />
            <span className="text-sm text-text">Upload document or drag & drop</span>
            <span className="inline-flex items-center gap-1 text-xs text-text-muted">
              <FileImage className="h-3 w-3" />
              PNG, JPG up to 10MB
            </span>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const selected = event.target.files?.[0];
          if (selected) onFileSelected(selected);
        }}
      />
    </div>
  );
}
