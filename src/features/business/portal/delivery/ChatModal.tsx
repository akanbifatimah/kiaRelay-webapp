import { Controller, useForm } from "react-hook-form";
import { Send } from "lucide-react";
import { Modal } from "../../../../components/Modal";
import { Tooltip } from "../../../../components/Tooltip";
import { cn } from "../../../../lib/cn";
import { sendMessage } from "../../deliveries/deliveryActions";
import { formatWhen } from "../../deliveries/display";
import type { DeliveryOrder } from "../../deliveries/deliveryTypes";

const QUICK = ["I'm on my way", "Please call on arrival", "Use the side gate"];

// Message the driver (2026-09-30, no design — first pass). Mock replies.
// TODO: real messaging (POST /deliveries/:id/messages + websocket).
export function ChatModal({ order, onClose }: { order: DeliveryOrder; onClose: () => void }) {
  const { control, handleSubmit, reset } = useForm<{ text: string }>({ defaultValues: { text: "" } });
  const send = handleSubmit(({ text }) => {
    if (!text.trim()) return;
    sendMessage(order.id, text);
    reset({ text: "" });
  });
  const name = order.driver ? `${order.driver.firstName} ${order.driver.lastName[0]}.` : "Driver";

  return (
    <Modal title={`Message ${name}`} subtitle={`${order.id} · ${order.driver?.vehicle ?? ""} ${order.driver?.plate ?? ""}`} onClose={onClose} size="lg">
      <div className="flex max-h-80 min-h-40 flex-col gap-2 overflow-y-auto rounded-lg bg-bg p-3">
        {order.messages.length === 0 && <p className="m-auto text-sm text-text-muted">Send {name} a message about this delivery.</p>}
        {order.messages.map((m) => (
          <div key={m.id} className={cn("max-w-[80%] rounded-2xl px-3 py-2 text-sm", m.from === "customer" ? "self-end bg-primary text-primary-foreground" : "self-start bg-surface text-text")}>
            {m.text}
            <span className={cn("block text-[10px]", m.from === "customer" ? "text-white/70" : "text-text-muted")}>{formatWhen(m.at)}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {QUICK.map((q) => (
          <button key={q} type="button" onClick={() => sendMessage(order.id, q)} className="rounded-full border border-border px-3 py-1 text-xs text-text hover:bg-bg">
            {q}
          </button>
        ))}
      </div>
      <form onSubmit={send} className="mt-3 flex gap-2">
        <Controller control={control} name="text" render={({ field }) => <input {...field} aria-label="Message" placeholder="Type a message" className="flex-1 rounded-md border border-border px-3 py-2 text-sm" />} />
        <Tooltip label="Send message">
          <button type="submit" aria-label="Send message" className="rounded-md bg-primary p-2.5 text-primary-foreground">
            <Send className="h-4 w-4" />
          </button>
        </Tooltip>
      </form>
    </Modal>
  );
}
