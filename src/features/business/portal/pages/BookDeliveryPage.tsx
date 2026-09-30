import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { Card } from "../../../../components/Card";
import { PageHeader } from "../../../../components/PageHeader";
import { useToast } from "../../../../components/toast/ToastContext";
import { findCustomer } from "../../../customers/data";
import { getCustomerDetail, paymentTermsLabel } from "../../../customers/customerDetails";
import { placeDelivery } from "../../deliveries/deliveryActions";
import { useSavedLocations } from "../../deliveries/deliveriesStore";
import { BookingAside } from "../booking/BookingAside";
import { LocationsStep } from "../booking/LocationsStep";
import { OptionsStep, type OptionsForm } from "../booking/OptionsStep";
import { PackageStep } from "../booking/PackageStep";
import type { PaymentOption } from "../booking/PaymentPicker";
import { startDraft, useBookingDraft } from "../bookingDraft";
import { orderPath } from "../paths";
import { canBook, usePortalAccount } from "../usePortalAccount";
import { portalBranches, portalTerms, usePortalDeliveries } from "../usePortalData";

/** "2026-10-01" + "10:00 AM" → local ISO time. */
function scheduledIso(day: string, slot: string): string {
  const [, h, m, ampm] = slot.match(/(\d+):(\d+)\s*(AM|PM)/) ?? [];
  const [y, mo, d] = day.split("-").map(Number);
  const hours = (Number(h) % 12) + (ampm === "PM" ? 12 : 0);
  return new Date(y, mo - 1, d, hours, Number(m)).toISOString();
}

// New Delivery (2026-09-30): the app's three booking screens as one desktop
// page — the step form on the left, route map and progress on the right.
export function BookDeliveryPage() {
  const account = usePortalAccount();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { draft, origin, version } = useBookingDraft();
  const saved = useSavedLocations(account?.id);
  const orders = usePortalDeliveries(account);
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const payments = useMemo<PaymentOption[]>(() => {
    if (!account) return [];
    const terms = portalTerms(account);
    const customer = findCustomer(account.id);
    const cards = customer ? getCustomerDetail(customer).paymentMethods.filter((m) => m.type === "card" && m.status === "verified") : [];
    return [
      { id: "invoice", kind: "invoice", title: "Bill to account", detail: `Invoice · ${paymentTermsLabel(terms.paymentTerms)}` },
      ...cards.map((c) => ({ id: c.id, kind: "card" as const, title: c.label, detail: c.detail })),
    ];
  }, [account]);
  if (!account) return null;

  if (!canBook(account)) {
    return (
      <Card className="mx-auto flex max-w-lg flex-col items-center gap-3 p-8 text-center">
        <Lock className="h-8 w-8 text-text-muted" />
        <h1 className="text-xl font-bold text-text">Booking opens after verification</h1>
        <p className="text-sm text-text-muted">Our team is reviewing your company's documents. We'll email you the moment you're approved.</p>
        <Link to="/business/company" className="text-sm font-medium text-primary hover:underline">View application status</Link>
      </Card>
    );
  }

  function confirm(values: OptionsForm) {
    if (!account) return;
    setPlacing(true);
    const payment = payments.find((p) => p.id === values.paymentId) ?? payments[0];
    const scheduledFor = values.speed === "scheduled" ? scheduledIso(values.day, values.slot) : "";
    const order = placeDelivery(account.id, account.owner, {
      ...draft,
      speed: values.speed,
      scheduledFor,
      extendedWait: values.extendedWait,
      branch: values.branch,
      payment: payment.kind === "invoice" ? { kind: "invoice", label: payment.detail } : { kind: "card", methodId: payment.id, label: payment.title },
    });
    setPlacing(false);
    startDraft();
    showToast("success", `Order ${order.id} confirmed — finding the best driver.`);
    navigate(orderPath(order));
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="New Delivery" subtitle="Book a pickup for your company. Every field matches the KiaRelay app." />
      {origin !== "new" && <p className="rounded-lg bg-info/10 px-4 py-2 text-sm text-info">Prefilled from {origin === "reorder" ? "a past delivery" : "a saved location"} — review before continuing.</p>}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div key={version}>
          {step === 0 && <LocationsStep draft={draft} saved={saved} orders={orders} onNext={() => setStep(1)} />}
          {step === 1 && <PackageStep draft={draft} onBack={() => setStep(0)} onNext={() => setStep(2)} />}
          {step === 2 && <OptionsStep draft={draft} branches={portalBranches(account)} payments={payments} placing={placing} onBack={() => setStep(1)} onConfirm={confirm} />}
        </div>
        <BookingAside draft={draft} step={step} />
      </div>
    </div>
  );
}
