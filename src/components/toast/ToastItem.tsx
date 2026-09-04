import { CheckCircle2, XCircle, X } from "lucide-react";
import { cn } from "../../lib/cn";
import type { ToastVariant } from "./ToastContext";

interface ToastItemProps {
  variant: ToastVariant;
  message: string;
  onDismiss: () => void;
}

const variantConfig: Record<ToastVariant, { border: string; icon: typeof CheckCircle2; iconColor: string }> = {
  success: { border: "border-l-success", icon: CheckCircle2, iconColor: "text-success" },
  error: { border: "border-l-danger", icon: XCircle, iconColor: "text-danger" },
};

export function ToastItem({ variant, message, onDismiss }: ToastItemProps) {
  const { border, icon: Icon, iconColor } = variantConfig[variant];

  return (
    <div
      role="status"
      className={cn(
        "flex w-80 items-start gap-3 rounded-lg border border-l-4 border-border bg-surface p-3 shadow-lg",
        border,
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0", iconColor)} />
      <p className="text-body flex-1 text-text">{message}</p>
      <button type="button" aria-label="Dismiss" onClick={onDismiss} className="text-text-muted hover:text-text">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
