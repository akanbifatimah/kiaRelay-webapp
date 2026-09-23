import { Controller, useForm, useWatch } from "react-hook-form";
import { CheckCheck, CircleCheck } from "lucide-react";
import { Modal } from "../../../components/Modal";
import { FormField } from "../../../components/FormField";
import { formatUsd, type ClaimInvestigation } from "../claimInvestigation";
import { OptionToggleGroup } from "./OptionToggleGroup";

export type ClaimAdjustment = "none" | "refund" | "credit";

export interface ResolveClaimValues {
  determination: string;
  adjustment: ClaimAdjustment;
  amount: string;
}

interface ResolveClaimModalProps {
  claim: ClaimInvestigation;
  onClose: () => void;
  onResolve: (values: ResolveClaimValues) => void;
}

const ADJUSTMENT_OPTIONS: { value: ClaimAdjustment; label: string }[] = [
  { value: "none", label: "No Adjustment" },
  { value: "refund", label: "Refund" },
  { value: "credit", label: "Credit" },
];

function ContextItem({ label, value, tone }: { label: string; value: string; tone?: "success" }) {
  return (
    <div>
      <p className="text-xs text-text-muted">{label}</p>
      <p className={tone === "success" ? "text-sm font-medium text-success" : "text-sm font-medium text-text"}>{value}</p>
    </div>
  );
}

export function ResolveClaimModal({ claim, onClose, onResolve }: ResolveClaimModalProps) {
  const { control, handleSubmit } = useForm<ResolveClaimValues>({
    defaultValues: { determination: "", adjustment: "none", amount: "" },
  });
  const adjustment = useWatch({ control, name: "adjustment" });

  return (
    <Modal
      title={
        <>
          <CircleCheck className="h-5 w-5 text-primary" />
          Resolve Claim - {claim.id}
        </>
      }
      subtitle="FINAL OPERATIONAL ADJUDICATION"
      size="lg"
      onClose={onClose}
      footer={
        <div className="flex w-full items-center justify-between">
          <button type="button" onClick={onClose} className="px-2 text-sm font-medium text-text hover:underline">
            Cancel Adjudication
          </button>
          <button
            type="submit"
            form="resolve-claim-form"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <CheckCheck className="h-4 w-4" />
            Resolve Claim
          </button>
        </div>
      }
    >
      <form id="resolve-claim-form" onSubmit={handleSubmit(onResolve)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className="text-label uppercase text-text-muted">Claim Context</p>
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-bg p-4 sm:grid-cols-3">
            <ContextItem label="Claim ID" value={claim.id} />
            <ContextItem label="Type" value={claim.type} />
            <ContextItem label="Customer" value={claim.customer.name} />
            <ContextItem label="Order Ref" value={claim.order.ref} />
            <ContextItem label="Driver" value={claim.driver.name} />
            <ContextItem label="Policy Limit" value={formatUsd(claim.policyLimit)} tone="success" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <FormField
            control={control}
            name="determination"
            label="Internal Resolution Determination *"
            type="textarea"
            placeholder="Detail the internal findings, evidence validation, and reasoning for this final decision..."
            rules={{ required: "A determination is required before resolving." }}
          />
          <p className="text-xs italic text-text-muted">Note: This determination will be logged in the permanent audit trail.</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-text">Financial Adjustment Required?</p>
          <Controller
            name="adjustment"
            control={control}
            render={({ field }) => (
              <OptionToggleGroup ariaLabel="Financial adjustment" options={ADJUSTMENT_OPTIONS} value={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        {/* Only mounted for Refund/Credit, so its rules never block a
            "No Adjustment" submit (same pattern as SuspendAccountModal). */}
        {adjustment !== "none" && (
          <FormField
            control={control}
            name="amount"
            label={`${adjustment === "refund" ? "Refund" : "Credit"} Amount (USD) — max ${formatUsd(claim.policyLimit)}`}
            type="number"
            placeholder="0.00"
            rules={{
              required: "Enter an amount.",
              validate: (value) => {
                const amount = Number(value);
                if (!(amount > 0)) return "Amount must be greater than zero.";
                return amount <= claim.policyLimit || `Amount can't exceed the ${formatUsd(claim.policyLimit)} policy limit.`;
              },
            }}
          />
        )}
      </form>
    </Modal>
  );
}
