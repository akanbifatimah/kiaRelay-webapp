import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
import { FormField } from "../../../../components/FormField";
import { PageHeader } from "../../../../components/PageHeader";
import { cn } from "../../../../lib/cn";
import { TICKET_TOPICS } from "../../deliveries/supportTickets";
import type { DeliveryPhoto } from "../../deliveries/deliveryTypes";
import type { TicketCategory } from "../../deliveries/supportTicketTypes";
import { PhotoUploadField } from "../booking/PhotoUploadField";
import { usePortalAccount } from "../usePortalAccount";
import { usePortalDeliveries } from "../usePortalData";
import { openPortalTicket } from "./portalTickets";

interface TicketForm {
  category: TicketCategory | "";
  orderId: string;
  subject: string;
  body: string;
  urgency: "normal" | "urgent";
  photos: DeliveryPhoto[];
}

// New Ticket (2026-10-01): lands in admin Support as an unassigned ticket in
// the Customer queue (stage New); urgent ones are high priority.
export function NewTicketPage() {
  const account = usePortalAccount();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const orders = usePortalDeliveries(account);
  const preset = params.get("order") ? `#ORD-${params.get("order")}` : "";
  const { control, handleSubmit } = useForm<TicketForm>({ mode: "onTouched", defaultValues: { category: preset ? "delivery" : "", orderId: preset, subject: preset ? `Question about ${preset}` : "", body: "", urgency: "normal", photos: [] } });
  if (!account) return null;

  const onSubmit = handleSubmit((v) => {
    const id = openPortalTicket(account, { subject: v.subject, category: v.category as TicketCategory, urgent: v.urgency === "urgent", body: v.body, orderId: v.orderId || undefined, photos: v.photos });
    navigate(`/business/support/${id}`, { replace: true });
  });

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link to="/business/support" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Support Tickets
      </Link>
      <PageHeader title="New Ticket" subtitle="Tell us what's going on and a member of our support team will reply." />
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <Card className="grid gap-4 sm:grid-cols-2">
          <Controller
            control={control}
            name="category"
            rules={{ required: "Pick a topic." }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <fieldset className="flex flex-col gap-2 sm:col-span-2">
                <legend className="mb-2 text-sm text-text-muted">What do you need help with? *</legend>
                <div role="radiogroup" className="flex flex-wrap gap-2">
                  {TICKET_TOPICS.map((t) => (
                    <button key={t.category} type="button" role="radio" aria-checked={value === t.category} onClick={() => onChange(t.category)} className={cn("rounded-full border px-3.5 py-1.5 text-sm", value === t.category ? "border-primary bg-primary/10 font-semibold text-primary" : "border-border text-text hover:bg-bg")}>
                      {t.label}
                    </button>
                  ))}
                </div>
                {error?.message && <span className="text-xs text-danger">{error.message}</span>}
              </fieldset>
            )}
          />
          <FormField control={control} name="orderId" label="Related delivery (optional)" type="select" options={[{ value: "", label: "Not about a delivery" }, ...orders.slice(0, 20).map((o) => ({ value: o.id, label: `${o.id} · ${o.dropoff.address.name || o.dropoff.address.city}` }))]} />
          <FormField control={control} name="urgency" label="Urgency" type="select" options={[{ value: "normal", label: "Normal" }, { value: "urgent", label: "Urgent" }]} />
          <div className="sm:col-span-2">
            <FormField control={control} name="subject" label="Subject *" placeholder="A short summary" rules={{ required: "Add a subject." }} />
          </div>
          <div className="sm:col-span-2">
            <FormField control={control} name="body" label="Message *" type="textarea" placeholder="Tell us what's going on…" rules={{ required: "Write a message.", minLength: { value: 10, message: "Add a little more detail." } }} />
          </div>
        </Card>
        <Card>
          <PhotoUploadField control={control} name="photos" title="Photos (optional)" />
        </Card>
        <Button type="submit" className="self-end">Send to Support</Button>
      </form>
    </div>
  );
}
