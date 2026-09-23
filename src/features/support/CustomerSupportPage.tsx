import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ConfirmModal } from "../../components/ConfirmModal";
import { useToast } from "../../components/toast/ToastContext";
import { getCustomerSupportProfile, updateCustomerSupportState, useCustomerSupportState } from "./customerSupport";
import { createTicket, ticketDetailHref, useTickets } from "./tickets";
import { SupportBackLink } from "./components/SupportBackLink";
import { SupportNotFound } from "./components/SupportNotFound";
import { CustomerSupportHeader } from "./components/CustomerSupportHeader";
import { ActiveDeliveriesCard } from "./components/ActiveDeliveriesCard";
import { RequesterTicketsCard } from "./components/RequesterTicketsCard";
import { AccountStatusCard, CustomerActivityCard, KeyLocationsCard } from "./components/CustomerSupportCards";
import { NewTicketModal } from "./components/NewTicketModal";

export function CustomerSupportPage() {
  const { customerId = "" } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const profile = useMemo(() => getCustomerSupportProfile(customerId), [customerId]);
  const state = useCustomerSupportState(customerId);
  const allTickets = useTickets();
  const [modal, setModal] = useState<"create" | "remind" | null>(null);

  if (!profile) return <SupportNotFound what="customer" id={customerId} />;

  const customerTickets = allTickets.filter((ticket) => ticket.requester?.kind === "customer" && ticket.requester.id === customerId);
  const openTickets = customerTickets.filter((ticket) => ticket.status !== "resolved");
  const { customer } = profile;

  return (
    <div className="flex flex-col gap-6">
      <SupportBackLink />
      <CustomerSupportHeader
        profile={profile}
        lifetimeTickets={profile.historicalTickets + customerTickets.length}
        openTickets={openTickets.length}
        onCreateTicket={() => setModal("create")}
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="flex min-w-0 flex-col gap-6">
          <ActiveDeliveriesCard deliveries={profile.deliveries} hub={profile.hub} />
          <div className="grid gap-6 md:grid-cols-2">
            <RequesterTicketsCard
              tickets={openTickets.slice(0, 3)}
              allHref={`/support/requesters/customer/${customerId}/tickets`}
              variant="customer"
              backLabel={customer.name}
            />
            <AccountStatusCard account={profile.account} reminderSent={state.reminderSent} onSendReminder={() => setModal("remind")} />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <KeyLocationsCard locations={profile.locations} />
          {/* The customer's existing Support & Audit Logs page already holds
              the full account trail — reused rather than a second timeline. */}
          <CustomerActivityCard activity={profile.activity} timelineHref={`/customers/${customer.accountType}/${customer.id}/support?tab=audit-log`} />
        </div>
      </div>

      {modal === "create" && (
        <NewTicketModal
          customer={customer.name}
          onClose={() => setModal(null)}
          onCreate={(values) => {
            const ticket = createTicket(values, { kind: "customer", id: customer.id, handler: "Support" });
            setModal(null);
            showToast("success", `${ticket.id} created for ${customer.name}.`);
            navigate(ticketDetailHref(ticket), { state: { from: `/support/customers/${customer.id}`, fromLabel: customer.name } });
          }}
        />
      )}
      {modal === "remind" && profile.account && (
        <ConfirmModal
          title="Send payment reminder?"
          message={`${profile.primaryContact} will be emailed a reminder for the ${profile.account.pastDue} past-due balance.`}
          confirmLabel="Send Reminder"
          onCancel={() => setModal(null)}
          onConfirm={() => {
            updateCustomerSupportState(customerId, { reminderSent: true });
            setModal(null);
            showToast("success", `Payment reminder sent to ${profile.contactEmail}.`);
          }}
        />
      )}
    </div>
  );
}
