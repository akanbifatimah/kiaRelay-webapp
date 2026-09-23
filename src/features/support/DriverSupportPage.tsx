import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ConfirmModal } from "../../components/ConfirmModal";
import { useToast } from "../../components/toast/ToastContext";
import { EditDriverProfileModal } from "../drivers/components/EditDriverProfileModal";
import { getDriverSupportProfile, updateDriverSupportState, useDriverSupportState } from "./driverSupport";
import { useTickets } from "./tickets";
import { SupportBackLink } from "./components/SupportBackLink";
import { SupportNotFound } from "./components/SupportNotFound";
import { DriverSupportHeader } from "./components/DriverSupportHeader";
import { LoadTrackingCard } from "./components/LoadTrackingCard";
import { ComplianceAlertsCard } from "./components/ComplianceAlertsCard";
import { RequesterTicketsCard } from "./components/RequesterTicketsCard";
import { IncidentHistoryCard } from "./components/IncidentHistoryCard";
import { ContactDriverModal, type ContactChannel } from "./components/ContactDriverModal";
import { SuspendDriverModal } from "./components/SuspendDriverModal";

type OpenModal = "contact" | "edit" | "remind" | "suspend" | "reinstate" | null;

const channelLabels: Record<ContactChannel, string> = { call: "Call", sms: "SMS", "in-app": "In-app message" };

export function DriverSupportPage() {
  const { driverId = "" } = useParams();
  const { showToast } = useToast();
  const profile = useMemo(() => getDriverSupportProfile(driverId), [driverId]);
  const state = useDriverSupportState(driverId);
  const allTickets = useTickets();
  const [modal, setModal] = useState<OpenModal>(null);
  const close = () => setModal(null);

  if (!profile) return <SupportNotFound what="driver" id={driverId} />;

  const detail = state.detailOverride ? { ...profile.detail, ...state.detailOverride } : profile.detail;
  const merged = { ...profile, detail };
  const openTickets = allTickets.filter(
    (ticket) => ticket.requester?.kind === "driver" && ticket.requester.id === driverId && ticket.status !== "resolved",
  );
  const stamp = () => new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

  return (
    <div className="flex flex-col gap-6">
      <SupportBackLink />
      <DriverSupportHeader
        profile={merged}
        state={state}
        onContact={() => setModal("contact")}
        onEdit={() => setModal("edit")}
        onRemind={() => setModal("remind")}
        onSuspend={() => setModal("suspend")}
        onReinstate={() => setModal("reinstate")}
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="flex min-w-0 flex-col gap-6">
          <LoadTrackingCard load={profile.load} />
          <RequesterTicketsCard
            tickets={openTickets}
            allHref={`/support/requesters/driver/${driverId}/tickets`}
            variant="driver"
            backLabel={detail.name}
          />
        </div>
        <div className="flex flex-col gap-6">
          <ComplianceAlertsCard license={detail.license} reminderSent={state.reminderSent} onSendReminder={() => setModal("remind")} />
          <IncidentHistoryCard incidents={profile.incidents} logHref={`/support/drivers/${driverId}/incidents`} />
        </div>
      </div>

      {modal === "contact" && (
        <ContactDriverModal
          driverName={detail.name}
          phone={detail.contact.phone}
          onClose={close}
          onContact={(channel, summary) => {
            updateDriverSupportState(driverId, { lastContact: `${channelLabels[channel]} · ${stamp()}` });
            close();
            showToast("success", channel === "call" ? `Call logged: ${summary}.` : `${channelLabels[channel]} sent to ${detail.name}.`);
          }}
        />
      )}
      {modal === "edit" && (
        <EditDriverProfileModal
          detail={detail}
          onClose={close}
          onSave={(updates) => {
            updateDriverSupportState(driverId, { detailOverride: updates });
            close();
            showToast("success", `${updates.name}'s profile updated.`);
          }}
        />
      )}
      {modal === "remind" && (
        <ConfirmModal
          title="Send compliance reminder?"
          message={`${detail.name} will get a push notification and SMS to renew their ${detail.license.label} (expires ${detail.license.expiryDate}).`}
          confirmLabel="Send Reminder"
          onCancel={close}
          onConfirm={() => {
            updateDriverSupportState(driverId, { reminderSent: true });
            close();
            showToast("success", `Reminder sent to ${detail.name}.`);
          }}
        />
      )}
      {modal === "suspend" && (
        <SuspendDriverModal
          driverName={detail.name}
          onClose={close}
          onSuspend={(reason) => {
            updateDriverSupportState(driverId, { suspendedReason: reason });
            close();
            showToast("success", `${detail.name} suspended.`);
          }}
        />
      )}
      {modal === "reinstate" && (
        <ConfirmModal
          title={`Reinstate ${detail.name}?`}
          message="They'll be eligible for new loads again immediately."
          confirmLabel="Reinstate"
          onCancel={close}
          onConfirm={() => {
            updateDriverSupportState(driverId, { suspendedReason: undefined });
            close();
            showToast("success", `${detail.name} reinstated.`);
          }}
        />
      )}
    </div>
  );
}
