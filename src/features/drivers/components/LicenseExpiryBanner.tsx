import { AlertTriangle } from "lucide-react";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { useToast } from "../../../components/toast/ToastContext";
import type { DriverLicense } from "../driverDetails";

// First banner-style card in the app (no existing precedent) — a plain Card
// with a colored left border, per the "no hardcoded colors" rule (warning
// token, not a raw orange hex). TODO: "Renew Notification" has no real
// notification system to call yet.
export function LicenseExpiryBanner({ license }: { license: DriverLicense }) {
  const { showToast } = useToast();

  if (!license.urgent) return null;

  return (
    <Card className="flex flex-col gap-3 border-l-4 border-l-warning sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <div>
          <p className="text-sm font-semibold text-warning">Expires in {license.daysUntilExpiry} days</p>
          <p className="text-sm text-text">
            {license.label} — {license.expiryDate}
          </p>
        </div>
      </div>
      <Button
        variant="dark"
        size="sm"
        onClick={() => showToast("success", "Renewal notification sent.")}
      >
        Renew Notification
      </Button>
    </Card>
  );
}
