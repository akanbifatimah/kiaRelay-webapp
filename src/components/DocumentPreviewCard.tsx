import { ImageIcon } from "lucide-react";

interface DocumentPreviewCardProps {
  src: string;
  alt: string;
  filename: string;
}

export function DocumentPreviewCard({ src, alt, filename }: DocumentPreviewCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-2">
      <img src={src} alt={alt} className="w-full rounded-md" />
      <span className="flex items-center gap-1.5 text-xs text-text-muted">
        <ImageIcon className="h-3.5 w-3.5" />
        {filename}
      </span>
    </div>
  );
}
