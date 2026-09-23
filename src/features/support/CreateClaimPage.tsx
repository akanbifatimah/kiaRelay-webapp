import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CheckCircle2, Info, Link2, Search } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "../../components/Button";
import { ConfirmModal } from "../../components/ConfirmModal";
import { FormField } from "../../components/FormField";
import { useToast } from "../../components/toast/ToastContext";
import { claimCategoryLabels } from "./claimInvestigation";
import { claimsStore, nextClaimId, saveClaim } from "./claims";
import { buildClaimFromForm, EMPTY_CLAIM_FORM, formFromDraft, type CreateClaimValues } from "./buildNewClaim";
import { SupportBackLink } from "./components/SupportBackLink";
import { ClaimFormSection } from "./components/ClaimFormSection";
import { ClaimOrderLookup } from "./components/ClaimOrderLookup";
import { ClaimEvidenceFields } from "./components/ClaimEvidenceFields";

const CATEGORY_OPTIONS = [{ value: "", label: "Select an incident type..." }, ...Object.entries(claimCategoryLabels).map(([value, label]) => ({ value, label }))];

export function CreateClaimPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [params] = useSearchParams();
  const draft = claimsStore.get().find((claim) => claim.id === params.get("draft") && claim.status === "draft");
  // A draft keeps its id across saves; a brand-new claim reserves one on first save.
  const [claimId] = useState(() => draft?.id ?? nextClaimId());
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
  const { control, handleSubmit, setValue, getValues, formState } = useForm<CreateClaimValues>({
    defaultValues: draft ? formFromDraft(draft) : EMPTY_CLAIM_FORM,
  });

  function saveDraft() {
    saveClaim(buildClaimFromForm(claimId, getValues(), "draft"));
    showToast("success", `Draft ${claimId} saved — find it under Claims Management.`);
    navigate("/support/claims");
  }

  function create(values: CreateClaimValues) {
    saveClaim(buildClaimFromForm(claimId, values, "open"));
    showToast("success", `${claimId} created and opened for investigation.`);
    navigate(`/support/claims/${claimId}`, { replace: true, state: { from: "/support/claims", fromLabel: "Claims Management" } });
  }

  function cancel() {
    if (formState.isDirty) setIsConfirmingCancel(true);
    else navigate("/support/claims");
  }

  return (
    <div className="flex flex-col gap-6">
      <SupportBackLink />
      <PageHeader
        title={draft ? `Edit Draft ${draft.id}` : "Create New Claim"}
        subtitle="Initiate an operational claim for a logistics order. Please complete all information below."
      />
      <form id="create-claim-form" onSubmit={handleSubmit(create)} className="flex flex-col gap-6">
        <ClaimFormSection step={1} title="Identify Order" icon={Search}>
          <ClaimOrderLookup control={control} setValue={setValue} />
        </ClaimFormSection>
        <ClaimFormSection step={2} title="Claim Information" icon={Info}>
          <div className="grid gap-4 md:grid-cols-3">
            <FormField control={control} name="category" label="Claim Type" type="select" options={CATEGORY_OPTIONS} rules={{ required: "Choose a claim type." }} />
            <FormField control={control} name="incidentDate" label="Incident Date" type="date" rules={{ required: "Pick the incident date." }} />
            <FormField
              control={control}
              name="amount"
              label="Claimed Amount (USD)"
              type="number"
              placeholder="0.00"
              rules={{ validate: (value) => !value || Number(value) > 0 || "Amount must be greater than zero." }}
            />
          </div>
          <FormField
            control={control}
            name="description"
            label="Description / Statement"
            type="textarea"
            placeholder="Provide a detailed description of the incident for the investigation team..."
            rules={{ validate: (value) => String(value).trim().length >= 10 || "Describe the incident (at least 10 characters)." }}
          />
        </ClaimFormSection>
        <ClaimFormSection step={3} title="Evidence Association" icon={Link2}>
          <ClaimEvidenceFields control={control} onRejected={(message) => showToast("error", message)} />
        </ClaimFormSection>
      </form>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <Button type="button" variant="ghost" onClick={cancel}>
          Cancel
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={saveDraft}>
            Save as Draft
          </Button>
          <Button type="submit" form="create-claim-form">
            Create Claim
            <CheckCircle2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {isConfirmingCancel && (
        <ConfirmModal
          title="Discard this claim?"
          message="Everything you've entered will be lost. Save it as a draft instead if you want to come back to it."
          confirmLabel="Discard"
          tone="danger"
          onCancel={() => setIsConfirmingCancel(false)}
          onConfirm={() => navigate("/support/claims")}
        />
      )}
    </div>
  );
}
