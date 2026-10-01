import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { Bot, Headset, Send, Truck } from "lucide-react";
import { Card } from "../../../../components/Card";
import { Tooltip } from "../../../../components/Tooltip";
import { cn } from "../../../../lib/cn";
import { getDeliveries } from "../../deliveries/deliveriesStore";
import { orderStatusLine, QUICK_REPLIES, type SupportMessage } from "../../deliveries/supportBot";
import type { BusinessAccount } from "../../businessAccounts";
import { orderPath } from "../paths";
import { escalateChat, sendChat, useSupportChat } from "./supportChat";

const ACTIONS = { claim: { label: "Report an Incident", to: "/business/incidents/new" }, track: { label: "My Deliveries", to: "/business/deliveries" }, billing: { label: "Invoices & Statements", to: "/business/invoices" } };

function Bubble({ message }: { message: SupportMessage }) {
  if (message.from === "system") return <p className="self-center rounded-full bg-bg px-3 py-1 text-xs text-text-muted">{message.text}</p>;
  const order = message.orderCard ? getDeliveries().find((o) => o.id === message.orderCard) : undefined;
  if (order) {
    const s = orderStatusLine(order);
    return (
      <Link to={orderPath(order)} className="ml-8 flex max-w-sm flex-col gap-2 rounded-lg border border-border bg-surface p-3 hover:border-primary">
        <span className="flex items-center justify-between text-sm font-semibold text-text"><span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-primary" /> Order {order.id}</span><span className="rounded bg-warning/10 px-2 py-0.5 text-[11px] text-warning">{s.label}</span></span>
        <span className="text-xs text-text-muted">{s.detail}</span>
        <span className="h-1.5 overflow-hidden rounded-full bg-bg"><span className="block h-1.5 rounded-full bg-primary" style={{ width: `${Math.round(s.progress * 100)}%` }} /></span>
        <span className="flex justify-between text-[11px] text-text-muted"><span>Origin: {order.pickup.address.city}</span><span>Dest: {order.dropoff.address.city}</span></span>
      </Link>
    );
  }
  const mine = message.from === "customer";
  return (
    <div className={cn("flex max-w-[80%] flex-col gap-1", mine ? "self-end items-end" : "self-start")}>
      {!mine && <span className="flex items-center gap-1 text-[11px] text-text-muted"><Bot className="h-3 w-3" />{message.from === "agent" ? "Support Agent" : "KiaRelay Support"}</span>}
      <p className={cn("rounded-2xl px-3 py-2 text-sm", mine ? "bg-primary text-primary-foreground" : "bg-bg text-text")}>{message.text}</p>
      {message.actions?.map((a) => <Link key={a} to={ACTIONS[a].to} className="rounded-full border border-primary px-3 py-0.5 text-xs font-semibold text-primary">{ACTIONS[a].label}</Link>)}
    </div>
  );
}

/** Support Chat (2026-10-01 design) as a panel on the portal's Help page. */
export function SupportChatPanel({ account }: { account: BusinessAccount }) {
  const { messages, escalated } = useSupportChat(account);
  const { control, handleSubmit, reset } = useForm<{ text: string }>({ defaultValues: { text: "" } });
  const end = useRef<HTMLDivElement>(null);
  // Block body on purpose: newer Chrome returns a Promise from scrollIntoView,
  // and an effect must return nothing or a cleanup function.
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);
  const send = handleSubmit(({ text }) => {
    if (!text.trim()) return;
    sendChat(account, text);
    reset({ text: "" });
  });

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-text">Support Chat</h2>
        {!escalated && (
          <button type="button" onClick={() => escalateChat(account)} className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-text hover:bg-bg">
            <Headset className="h-3.5 w-3.5" /> Escalate to Human Agent
          </button>
        )}
      </div>
      <div className="flex h-96 flex-col gap-3 overflow-y-auto rounded-lg border border-border p-3">
        {messages.map((m) => <Bubble key={m.id} message={m} />)}
        {!escalated && (
          <div className="flex flex-wrap gap-2">
            {QUICK_REPLIES.map((q) => <button key={q.action} type="button" onClick={() => sendChat(account, q.action)} className="rounded-full border border-border px-3 py-1 text-xs text-text hover:bg-bg">{q.label}</button>)}
          </div>
        )}
        <div ref={end} />
      </div>
      <form onSubmit={send} className="flex gap-2">
        <Controller control={control} name="text" render={({ field }) => <input {...field} aria-label="Message" placeholder="Type a message..." className="flex-1 rounded-md border border-border px-3 py-2 text-sm" />} />
        <Tooltip label="Send message">
          <button type="submit" aria-label="Send message" className="rounded-md bg-primary p-2.5 text-primary-foreground"><Send className="h-4 w-4" /></button>
        </Tooltip>
      </form>
    </Card>
  );
}
