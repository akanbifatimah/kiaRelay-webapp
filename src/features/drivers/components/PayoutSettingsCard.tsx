import { useState } from "react";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { useToast } from "../../../components/toast/ToastContext";
import { UpdateTaxInfoModal } from "./UpdateTaxInfoModal";
import type { DriverPayoutSettings } from "../driverPayoutHistory";

interface PayoutSettingsCardProps {
  settings: DriverPayoutSettings;
  driverName: string;
  onConfigureCycle: () => void;
}

export function PayoutSettingsCard({ settings, driverName, onConfigureCycle }: PayoutSettingsCardProps) {
  const { showToast } = useToast();
  const [isRequestingEarly, setIsRequestingEarly] = useState(false);
  const [isUpdatingTaxInfo, setIsUpdatingTaxInfo] = useState(false);

  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-label text-text-muted">Payout Settings</h3>
      <div className="flex flex-col gap-3 text-sm">
        <div>
          <p className="text-label text-text-muted">Method</p>
          <p className="text-text">{settings.method}</p>
        </div>
        <div>
          <p className="text-label text-text-muted">Cycle</p>
          <p className="text-text">{settings.cycle}</p>
        </div>
        <div>
          <p className="text-label text-text-muted">Next Payout</p>
          <p className="text-text">{settings.nextPayoutDate}</p>
        </div>
      </div>
      <Button onClick={() => setIsRequestingEarly(true)}>Request Early Payout</Button>
      <Button variant="outline" onClick={onConfigureCycle}>
        Configure Payout Cycle
      </Button>
      <Button variant="secondary" onClick={() => setIsUpdatingTaxInfo(true)}>
        Update Tax Info
      </Button>

      {isRequestingEarly && (
        <ConfirmModal
          title="Request Early Payout"
          message={`Release ${driverName}'s pending earnings ahead of the regular payout cycle? This moves funds immediately and cannot be undone.`}
          confirmLabel="Request Early Payout"
          onCancel={() => setIsRequestingEarly(false)}
          onConfirm={() => {
            setIsRequestingEarly(false);
            showToast("success", "Early payout requested.");
          }}
        />
      )}

      {isUpdatingTaxInfo && (
        <UpdateTaxInfoModal
          driverName={driverName}
          onClose={() => setIsUpdatingTaxInfo(false)}
          onSave={() => showToast("success", "Tax info updated.")}
        />
      )}
    </Card>
  );
}
