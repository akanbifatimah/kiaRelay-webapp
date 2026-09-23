import { Controller, useForm } from "react-hook-form";
import { ArrowRight, CircleCheck, Link2 } from "lucide-react";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import type { ClaimInvestigation } from "../claimInvestigation";
import { priorityLabels, type TicketPriority } from "../types";
import { OptionToggleGroup } from "./OptionToggleGroup";

const ESCALATION_TEAMS = ["Claims Adjusters (Tier 2)", "Legal & Risk", "Insurance Liaison", "Operations Leadership", "Finance — Settlements"];

export interface EscalateClaimValues {
  team: string;
  priority: TicketPriority;
  reason: string;
  note: string;
}

interface EscalateClaimModalProps {
  claim: ClaimInvestigation;
  onClose: () => void;
  onEscalate: (values: EscalateClaimValues) => void;
}

const PRIORITY_OPTIONS = (["low", "medium", "high", "critical"] as TicketPriority[]).map((value) => ({ value, label: priorityLabels[value] }));

export function EscalateClaimModal({ claim, onClose, onEscalate }: EscalateClaimModalProps) {
  const { control, handleSubmit } = useForm<EscalateClaimValues>({
    defaultValues: { team: "", priority: "medium", reason: "", note: "" },
  });

  return (
    <Modal
      title={
        <>
          <CircleCheck className="h-5 w-5 text-primary" />
          Escalate Claim - {claim.id}
        </>
      }
      subtitle={`Ticket #${claim.ticketId}`}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="escalate-claim-form" variant="dark">
            Confirm Escalation
            <ArrowRight className="h-4 w-4" />
          </Button>
        </>
      }
    >
      <form id="escalate-claim-form" onSubmit={handleSubmit(onEscalate)} className="flex flex-col gap-4">
        <FormField
          control={control}
          name="team"
          label="Destination Team"
          type="select"
          options={[{ value: "", label: "Select target division..." }, ...ESCALATION_TEAMS.map((value) => ({ value, label: value }))]}
          rules={{ required: "Choose a destination team." }}
        />
        <div className="flex flex-col gap-1.5">
          <span className="text-sm text-text-muted">Escalation Priority</span>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <OptionToggleGroup ariaLabel="Escalation priority" options={PRIORITY_OPTIONS} value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
        <FormField
          control={control}
          name="reason"
          label="Reason for Escalation"
          type="textarea"
          placeholder="Provide context for the receiving team..."
          rules={{ required: "Give the receiving team a reason." }}
        />
        <FormField control={control} name="note" label="Internal Agent Note (Optional)" type="textarea" placeholder="Notes visible only to support agents..." />
        <div className="flex gap-3 rounded-lg bg-bg p-4">
          <Link2 className="mt-0.5 h-4 w-4 shrink-0 text-text" />
          <div>
            <p className="text-sm font-semibold text-text">Traceability Active</p>
            <p className="text-xs text-text-muted">
              This ticket will remain linked to your agent profile post-escalation for quality assurance tracking.
            </p>
          </div>
        </div>
      </form>
    </Modal>
  );
}
