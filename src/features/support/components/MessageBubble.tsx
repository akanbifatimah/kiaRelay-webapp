import { Lock } from "lucide-react";
import { Avatar } from "../../../components/Avatar";
import { parseInlineMarkdown } from "../../marketing/parseInlineMarkdown";
import type { TicketMessage } from "../ticketMessages";

function Body({ message }: { message: TicketMessage }) {
  return (
    <p className="whitespace-pre-line text-sm leading-relaxed text-text">
      {parseInlineMarkdown(message.body, message.id)}
    </p>
  );
}

// Three treatments from the workspace screenshot: customer messages sit left
// with a bordered bubble, agent replies sit right, and internal notes span
// the thread in a warning-tinted box with a lock label so they can never be
// mistaken for something the customer saw.
export function MessageBubble({ message }: { message: TicketMessage }) {
  if (message.kind === "internal") {
    return (
      <div className="flex flex-col gap-1.5">
        <p className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase text-warning">
          <Lock className="h-3 w-3" />
          Internal Note
          <span className="font-normal normal-case text-text-muted">
            {message.time} by {message.author}
          </span>
        </p>
        <div className="rounded-lg border border-warning/30 border-l-4 border-l-warning bg-tag-warning-bg/50 px-4 py-3">
          <Body message={message} />
        </div>
      </div>
    );
  }

  const isAgent = message.kind === "agent";
  return (
    <div className={isAgent ? "flex flex-col items-end gap-1.5" : "flex flex-col items-start gap-1.5"}>
      <div className={isAgent ? "flex flex-row-reverse items-center gap-2" : "flex items-center gap-2"}>
        <Avatar name={message.author.replace(/\s*\(.*\)$/, "")} size="sm" />
        <span className="text-sm font-semibold text-text">{message.author}</span>
        <span className="text-xs text-text-muted">{message.time}</span>
      </div>
      <div className="max-w-[85%] rounded-lg border border-border bg-surface px-4 py-3 shadow-sm">
        <Body message={message} />
      </div>
    </div>
  );
}
