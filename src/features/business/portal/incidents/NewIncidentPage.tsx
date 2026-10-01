import { Controller, useForm, useWatch } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Truck } from "lucide-react";
import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
import { FormField } from "../../../../components/FormField";
import { PageHeader } from "../../../../components/PageHeader";
import { cn } from "../../../../lib/cn";
import { stageOf } from "../../deliveries/deliverySim";
import { STAGE_LABELS } from "../../deliveries/display";
import { INCIDENT_CATEGORIES, isClaimCategory } from "../../deliveries/incidents";
import { fileIncident } from "../../deliveries/portalIncidents";
import type { DeliveryPhoto } from "../../deliveries/deliveryTypes";
import type { IncidentUrgency } from "../../deliveries/incidentTypes";
import { PhotoUploadField } from "../booking/PhotoUploadField";
import { usePortalAccount } from "../usePortalAccount";
import { usePortalDeliveries } from "../usePortalData";

interface IncidentForm {
  orderId: string;
  category: string;
  categoryOther: string;
  description: string;
  urgency: IncidentUrgency;
  claimAmount: string;
  photos: DeliveryPhoto[];
}

const NONE = "none";

// Report an Incident — "Tell us what happened" (2026-10-01 design). The
// claimed amount for damage / missing items is a first-pass addition.
export function NewIncidentPage() {
  const account = usePortalAccount();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const orders = usePortalDeliveries(account);
  const preset = orders.find((o) => o.id === `#ORD-${params.get("order")}`);
  const { control, handleSubmit } = useForm<IncidentForm>({ mode: "onTouched", defaultValues: { orderId: preset?.id ?? "", category: "", categoryOther: "", description: "", urgency: "normal", claimAmount: "", photos: [] } });
  const category = useWatch({ control, name: "category" });
  if (!account) return null;

  const onSubmit = handleSubmit((v) => {
    const incident = fileIncident(account.id, account.company.legalName, {
      orderId: v.orderId === NONE ? "" : v.orderId,
      category: v.category,
      categoryOther: v.category === "Other" ? v.categoryOther.trim() : "",
      description: v.description.trim(),
      urgency: v.urgency,
      photos: v.photos,
      claimAmount: isClaimCategory(v.category) ? Number(v.claimAmount) || 0 : 0,
    });
    navigate(`/business/incidents/${incident.id}?submitted=1`, { replace: true });
  });

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link to="/business/incidents" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Incident Reports
      </Link>
      <PageHeader title="Tell us what happened" subtitle="Report and track issues that happen during your deliveries." />
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <Card className="grid gap-4 sm:grid-cols-2">
          {preset ? (
            <div className="flex flex-col gap-1 rounded-lg border border-border p-3 sm:col-span-2">
              <span className="flex items-center gap-2 text-sm font-semibold text-text"><Truck className="h-4 w-4" /> Delivery {preset.id}</span>
              <span className="text-xs text-success">● {STAGE_LABELS[stageOf(preset)]}</span>
            </div>
          ) : (
            <div className="sm:col-span-2">
              <FormField control={control} name="orderId" label="Delivery *" type="select" options={[{ value: "", label: "Select a delivery" }, ...orders.slice(0, 20).map((o) => ({ value: o.id, label: `${o.id} · ${o.dropoff.address.name || o.dropoff.address.city}` })), { value: NONE, label: "Not about a specific delivery" }]} rules={{ required: "Pick the delivery, or say it's not about one." }} />
            </div>
          )}
          <FormField control={control} name="category" label="Incident Category *" type="select" options={[{ value: "", label: "Select Incident Category" }, ...INCIDENT_CATEGORIES.map((c) => ({ value: c, label: c }))]} rules={{ required: "Choose a category." }} />
          <Controller
            control={control}
            name="urgency"
            render={({ field: { value, onChange } }) => (
              <div className="flex flex-col gap-1 text-sm">
                <span className="text-text-muted">Urgency</span>
                <div role="radiogroup" className="grid grid-cols-2 gap-1 rounded-md bg-bg p-1">
                  {(["normal", "urgent"] as const).map((u) => (
                    <button key={u} type="button" role="radio" aria-checked={value === u} onClick={() => onChange(u)} className={cn("rounded py-1.5 font-medium capitalize", value === u ? "bg-surface text-text shadow-sm" : "text-text-muted")}>{u}</button>
                  ))}
                </div>
              </div>
            )}
          />
          {category === "Other" && <FormField control={control} name="categoryOther" label="Specify Category *" placeholder="What kind of issue?" rules={{ required: "Tell us the kind of issue." }} />}
          {isClaimCategory(category) && <FormField control={control} name="claimAmount" label="Claimed Amount ($) *" type="number" placeholder="0.00" rules={{ validate: (v) => Number(v) > 0 || "Enter the value you're claiming." }} />}
          <div className="sm:col-span-2">
            <FormField control={control} name="description" label="What happened? *" type="textarea" placeholder="Briefly describe what happened..." rules={{ required: "Describe what happened.", minLength: { value: 10, message: "Add a little more detail." } }} />
          </div>
        </Card>
        <Card>
          <PhotoUploadField control={control} name="photos" title="Add evidence" />
        </Card>
        <Button type="submit" className="self-end">Submit Incident</Button>
      </form>
    </div>
  );
}
