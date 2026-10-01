import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Headset, RotateCcw, Send, Truck } from "lucide-react";
import { Card } from "../../../../components/Card";
import { cn } from "../../../../lib/cn";
import { findDelivery } from "../../deliveries/deliveriesStore";
import { canReopen, canReply, customerState, orderStatusLine, stateDetail, topicLabel } from "../../deliveries/supportTickets";
import { orderPath } from "../paths";
import { usePortalAccount } from "../usePortalAccount";
import { reopenPortalTicket, replyToPortalTicket, usePortalTickets } from "./portalTickets";
import { TicketStateBadge } from "./TicketStateBadge";

// Ticket conversation (2026-10-01; the Support Chat design's layout, with
// staff instead of an assistant). Replies go onto the admin ticket; Reopen
// sends a resolved ticket back to In Progress; closed tickets are read-only.
export function TicketPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const account = usePortalAccount();
  const ticket = usePortalTickets(account).find((t) => t.id === ticketId);
  const end = useRef<HTMLDivElement>(null);
  const { control, handleSubmit, reset } = useForm<{ text: string }>({ defaultValues: { text: "" } });
  const count = ticket?.messages.length ?? 0;
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [count]);
  if (!account) return null;
  if (!ticket) return <Navigate to="/business/support" replace />;
  const order = ticket.orderId ? findDelivery(ticket.orderId) : undefined;
  const reopen = canReopen(ticket);

  const send = handleSubmit(({ text }) => {
    if (reopen) reopenPortalTicket(account, ticket.id, text);
    else if (text.trim()) replyToPortalTicket(account, ticket.id, text);
    reset({ text: "" });
  });

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <Link to="/business/support" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text"><ArrowLeft className="h-3.5 w-3.5" /> Back to Support Tickets</Link>
      <Card className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-text">{ticket.subject}</h1>
        <p className="text-xs text-text-muted">#{ticket.id} · {topicLabel(ticket.category)}</p>
        <div className="mt-1 flex items-center gap-2"><TicketStateBadge state={customerState(ticket)} /><span className="text-xs text-text-muted">{stateDetail(ticket)}</span></div>
      </Card>
      {order && (() => {
        const s = orderStatusLine(order);
        return (
          <Link to={orderPath(order)} className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-3 hover:border-primary">
            <span className="flex items-center justify-between text-sm font-semibold text-text"><span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-primary" /> Order {order.id}</span><span className="rounded bg-warning/10 px-2 py-0.5 text-[11px] text-warning">{s.label}</span></span>
            <span className="text-xs text-text-muted">{s.detail}</span>
          </Link>
        );
      })()}
      <Card className="flex max-h-[28rem] flex-col gap-3 overflow-y-auto">
        {ticket.messages.map((m) => {
          const mine = m.from === "customer";
          return (
            <div key={m.id} className={cn("flex max-w-[80%] flex-col gap-1", mine ? "items-end self-end" : "self-start")}>
              {!mine && <span className="flex items-center gap-1 text-[11px] text-text-muted"><Headset className="h-3 w-3" />{m.author} · KiaRelay Support</span>}
              <p className={cn("whitespace-pre-line rounded-2xl px-3 py-2 text-sm", mine ? "bg-primary text-primary-foreground" : "bg-bg text-text")}>{m.body}</p>
              <span className="text-[10px] text-text-muted">{m.timeLabel}</span>
            </div>
          );
        })}
        <div ref={end} />
      </Card>
      {canReply(ticket) ? (
        <form onSubmit={send} className="flex gap-2">
          <Controller control={control} name="text" render={({ field }) => <input {...field} aria-label="Message" placeholder={reopen ? "Tell us what's still wrong (optional)…" : "Type a message..."} className="flex-1 rounded-md border border-border px-3 py-2 text-sm" />} />
          <button type="submit" className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            {reopen ? <><RotateCcw className="h-4 w-4" /> Reopen</> : <><Send className="h-4 w-4" /> Send</>}
          </button>
        </form>
      ) : (
        <Link to="/business/support/new" className="self-center text-sm font-semibold text-primary hover:underline">Start a new ticket</Link>
      )}
    </div>
  );
}
