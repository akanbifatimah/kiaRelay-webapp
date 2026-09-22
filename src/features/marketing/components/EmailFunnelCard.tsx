import { Send, Inbox, MailOpen, MousePointerClick, ChevronRight } from "lucide-react";
import { Card } from "../../../components/Card";
import type { EmailResult } from "../emailResults";

interface EmailFunnelCardProps {
  result: EmailResult;
}

export function EmailFunnelCard({ result }: EmailFunnelCardProps) {
  const stages = [
    { icon: Send, label: "Sent to", value: result.sentTo },
    { icon: Inbox, label: "arrived in inboxes", value: result.arrived },
    { icon: MailOpen, label: "opened it", value: result.opened },
    { icon: MousePointerClick, label: "clicked a link", value: result.clicked },
  ];

  return (
    <Card className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
      {stages.map((stage, i) => (
        <span key={stage.label} className="flex items-center gap-3">
          {i > 0 && <ChevronRight className="h-4 w-4 text-border" />}
          <span className="inline-flex items-center gap-1.5">
            <stage.icon className="h-4 w-4 text-text-muted" />
            <span className="font-semibold text-text">{stage.value.toLocaleString()}</span>
            {stage.label}
          </span>
        </span>
      ))}
    </Card>
  );
}
