import { useState } from "react";
import { Star } from "lucide-react";
import { Avatar } from "../../../components/Avatar";
import { Button } from "../../../components/Button";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { useToast } from "../../../components/toast/ToastContext";
import type { DriverDetail } from "../driverDetails";

function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface DriverProfileHeaderProps {
  detail: DriverDetail;
  onEdit: () => void;
}

export function DriverProfileHeader({ detail, onEdit }: DriverProfileHeaderProps) {
  const { showToast } = useToast();
  const [isSuspending, setIsSuspending] = useState(false);

  return (
    <div className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-center gap-3">
        <Avatar name={detail.name} src="/profile_img.png" />
        <div>
          <p className="text-lg font-semibold text-text">{detail.name}</p>
          <p className="text-xs text-text-muted">{detail.id}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 font-medium text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Active
            </span>
            <span className="text-text-muted">{detail.lastActiveLabel}</span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-text-muted">
            <span className="font-medium text-text">{detail.reliabilityPct}% Reliable</span>
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              {detail.rating.toFixed(1)}
            </span>
            <span>{detail.deliveries.toLocaleString()} Deliveries</span>
            <span>{formatCurrency(detail.walletBalance)} Wallet</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Button type="button" variant="outline" onClick={onEdit}>
          Edit Profile
        </Button>
        <div className="flex items-center gap-3 text-xs">
          <button type="button" onClick={() => setIsSuspending(true)} className="font-medium text-danger hover:underline">
            Suspend
          </button>
          <button
            type="button"
            onClick={() => showToast("success", "Password reset link sent.")}
            className="font-medium text-text-muted hover:underline"
          >
            Reset
          </button>
        </div>
      </div>

      {isSuspending && (
        <ConfirmModal
          title="Suspend Driver"
          message={`Suspend ${detail.name}? They'll be unable to accept new deliveries until reinstated.`}
          confirmLabel="Suspend"
          tone="danger"
          onCancel={() => setIsSuspending(false)}
          onConfirm={() => {
            setIsSuspending(false);
            showToast("success", `${detail.name} was suspended.`);
          }}
        />
      )}
    </div>
  );
}
