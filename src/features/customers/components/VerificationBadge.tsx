import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { cn } from "../../../lib/cn";
import type { VerificationStatus } from "../data";

const config: Record<VerificationStatus, { icon: typeof CheckCircle2; color: string; label: string }> = {
  verified: { icon: CheckCircle2, color: "text-success", label: "Verified" },
  pending: { icon: Clock, color: "text-warning", label: "Pending" },
  failed: { icon: XCircle, color: "text-danger", label: "Failed" },
};

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const { icon: Icon, color, label } = config[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", color)}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
