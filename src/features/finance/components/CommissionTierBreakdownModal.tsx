import { BadgePercent, Check } from "lucide-react";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { cn } from "../../../lib/cn";
import type { CommissionTier, CommissionOutlook } from "../revenueDetail";

interface CommissionTierBreakdownModalProps {
  tiers: CommissionTier[];
  outlook: CommissionOutlook;
  onClose: () => void;
}

export function CommissionTierBreakdownModal({ tiers, outlook, onClose }: CommissionTierBreakdownModalProps) {
  return (
    <Modal
      title={
        <>
          <BadgePercent className="h-5 w-5 text-primary" />
          Commission Tier Breakdown
        </>
      }
      onClose={onClose}
      footer={
        <Button type="button" variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-text-muted">{outlook.note}</p>
        <div className="flex flex-col gap-2">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg border p-3",
                tier.isCurrent ? "border-primary bg-tag-warning-bg" : "border-border",
              )}
            >
              <div>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-text">
                  {tier.name}
                  {tier.isCurrent && <Check className="h-3.5 w-3.5 text-primary" />}
                </p>
                <p className="text-xs text-text-muted">{tier.volumeRangeLabel}</p>
              </div>
              <p className="text-lg font-semibold text-text">{tier.ratePct}%</p>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
