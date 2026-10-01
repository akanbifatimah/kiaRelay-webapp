import { Link } from "react-router-dom";
import { Mail, MessagesSquare, Phone } from "lucide-react";
import { Card } from "../../../../components/Card";
import { PageHeader } from "../../../../components/PageHeader";
import { DEMURRAGE } from "../../deliveries/deliveryOptions";
import { DRIVER_RELAY_PHONE } from "../delivery/DriverBits";

const SUPPORT_EMAIL = "support@kiarelay.com";

const FAQS: [string, string][] = [
  ["How is a delivery priced?", "Distance, weight, speed and handling needs (HazMat, liftgate, equipment) set the price. You see the full breakdown before you confirm."],
  ["What is demurrage?", `The first ${DEMURRAGE.freeMinutes} minutes of waiting at a stop are free. After that, waiting is billed at $${DEMURRAGE.hourlyRate}/hour.`],
  ["Can we cancel?", "Yes — free of charge any time before pickup, from the delivery's page."],
  ["When are invoices due?", "Each delivery posts to your account when it's delivered and is invoiced on your billing cycle, due on your net terms. Pay from Invoices & Statements."],
  ["How do we report damage or a delay?", "Open the order and choose Report an Incident (or use Incident Reports). Add photos; Operations replies on the report."],
  ["Can teammates book too?", "Yes. Add them under Team & Branches and pick the branch their deliveries bill to."],
];

// Help & FAQ (2026-09-30, no design — first pass). Support itself is staff-
// handled tickets (/business/support); there is no AI assistant.
// TODO: pull FAQs from the Knowledge Base the admin Support module edits.
export function HelpPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Help & FAQ" subtitle="We're here 24/7 for anything on the road." />
      <Link to="/business/support" className="flex items-center gap-4 rounded-xl bg-sidebar p-5 hover:opacity-95">
        <MessagesSquare className="h-6 w-6 text-white" />
        <span className="flex-1">
          <span className="block font-semibold text-white">Contact Support</span>
          <span className="block text-sm text-white/70">Open a ticket — our support team replies in your Support Tickets.</span>
        </span>
        <span className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">New Ticket</span>
      </Link>
      <div className="grid gap-4 sm:grid-cols-2">
        <a href={`tel:${DRIVER_RELAY_PHONE}`} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-5 hover:border-primary">
          <Phone className="h-5 w-5 text-primary" />
          <span><span className="block font-semibold text-text">Call us</span><span className="text-sm text-text-muted">{DRIVER_RELAY_PHONE}</span></span>
        </a>
        <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-5 hover:border-primary">
          <Mail className="h-5 w-5 text-primary" />
          <span><span className="block font-semibold text-text">Email support</span><span className="text-sm text-text-muted">{SUPPORT_EMAIL}</span></span>
        </a>
      </div>
      <Card className="flex flex-col divide-y divide-border p-0">
        {FAQS.map(([q, a]) => (
          <details key={q} className="group px-5 py-4">
            <summary className="cursor-pointer list-none font-semibold text-text marker:hidden">{q}</summary>
            <p className="mt-2 text-sm text-text-muted">{a}</p>
          </details>
        ))}
      </Card>
    </div>
  );
}
