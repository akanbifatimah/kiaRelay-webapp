import { Link } from "react-router-dom";
import { Building2, Mail, TicketCheck, UserRound } from "lucide-react";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import type { CustomerSupportProfile } from "../customerSupport";

interface CustomerSupportHeaderProps {
  profile: CustomerSupportProfile;
  lifetimeTickets: number;
  openTickets: number;
  onCreateTicket: () => void;
}

function Meta({ label, icon: Icon, children }: { label: string; icon: typeof Mail; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-text-muted">{label}</p>
      <p className="mt-0.5 flex items-center gap-1.5 text-sm text-text">
        <Icon className="h-3.5 w-3.5 text-text-muted" />
        {children}
      </p>
    </div>
  );
}

export function CustomerSupportHeader({ profile, lifetimeTickets, openTickets, onCreateTicket }: CustomerSupportHeaderProps) {
  const { customer } = profile;
  return (
    <Card className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-border bg-bg text-text-muted">
          {customer.accountType === "company" ? <Building2 className="h-6 w-6" /> : <UserRound className="h-6 w-6" />}
        </span>
        <div className="flex flex-col gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold text-text">{customer.name}</h1>
              <span className="text-badge rounded bg-sidebar px-1.5 py-0.5 text-white">{profile.tier}</span>
            </div>
            <p className="text-sm text-text-muted">ID: {customer.id}</p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <Meta label="Primary Contact" icon={UserRound}>{profile.primaryContact}</Meta>
            <Meta label="Contact Info" icon={Mail}>
              <a href={`mailto:${profile.contactEmail}`} className="hover:text-primary hover:underline">{profile.contactEmail}</a>
            </Meta>
            <Meta label="Lifetime Tickets" icon={TicketCheck}>
              {lifetimeTickets} ({openTickets} Open)
            </Meta>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={onCreateTicket}>Create Ticket</Button>
        <Link
          to={`/customers/${customer.accountType}/${customer.id}`}
          className="inline-flex items-center rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-bg"
        >
          View Full Profile
        </Link>
      </div>
    </Card>
  );
}
