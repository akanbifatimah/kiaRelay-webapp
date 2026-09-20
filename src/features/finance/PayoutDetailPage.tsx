import { useState } from "react";
import { ArrowLeft, Printer, LifeBuoy } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Button } from "../../components/Button";
import { useToast } from "../../components/toast/ToastContext";
import { PayoutRegisterStatusBadge } from "./components/PayoutRegisterStatusBadge";
import { PayoutDriverProfileCard } from "./components/PayoutDriverProfileCard";
import { PayoutSummaryCard } from "./components/PayoutSummaryCard";
import { IncludedDeliveriesTable } from "./components/IncludedDeliveriesTable";
import { CreatePayoutSupportTicketModal } from "./components/CreatePayoutSupportTicketModal";
import { payoutRegister } from "./driverPayoutsOverview";
import { getPayoutDetail } from "./payoutDetail";

export function PayoutDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);

  const payout = payoutRegister.find((p) => p.id === id);
  if (!payout) return <Navigate to="/finance/payouts" replace />;

  const detail = getPayoutDetail(payout);

  return (
    <div className="flex flex-col gap-6">
      <Link to="/finance/payouts" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Driver Payouts
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-heading-1 text-text">Payout {payout.id}</h1>
            <PayoutRegisterStatusBadge status={payout.status} />
          </div>
          <p className="text-body mt-1 text-text-muted">{payout.driverName} · {payout.completedDeliveries} deliveries</p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="dark" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Print Statement
          </Button>
          <Button type="button" variant="secondary" onClick={() => setIsCreatingTicket(true)}>
            <LifeBuoy className="h-4 w-4" />
            Support Ticket
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <PayoutDriverProfileCard detail={detail} />
        <div className="flex flex-col gap-4">
          <PayoutSummaryCard detail={detail} />
        </div>
      </div>

      <IncludedDeliveriesTable deliveries={detail.deliveries} />

      {isCreatingTicket && (
        <CreatePayoutSupportTicketModal
          payoutId={payout.id}
          onClose={() => setIsCreatingTicket(false)}
          onCreate={(ticketId) => showToast("success", `Support ticket ${ticketId} created for payout ${payout.id}.`)}
        />
      )}
    </div>
  );
}
