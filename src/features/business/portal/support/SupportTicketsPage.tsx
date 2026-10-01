import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CirclePlus, ShieldAlert } from "lucide-react";
import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
import { DataTable, type Column } from "../../../../components/DataTable";
import { PageHeader } from "../../../../components/PageHeader";
import { cn } from "../../../../lib/cn";
import { customerState, isActiveTicket, topicLabel } from "../../deliveries/supportTickets";
import type { CustomerTicket } from "../../deliveries/supportTicketTypes";
import { usePortalAccount } from "../usePortalAccount";
import { usePortalTickets } from "./portalTickets";
import { TicketStateBadge } from "./TicketStateBadge";

type Tab = "open" | "resolved";

// Support Tickets (2026-10-01): the company's tickets with KiaRelay support
// staff — the same records Support works in the admin ticket workspace.
export function SupportTicketsPage() {
  const account = usePortalAccount();
  const navigate = useNavigate();
  const tickets = usePortalTickets(account);
  const [tab, setTab] = useState<Tab>("open");
  const rows = tickets.filter((t) => isActiveTicket(t) === (tab === "open"));

  const columns: Column<CustomerTicket>[] = [
    { header: "Ticket", accessor: (t) => <div><p className="font-semibold text-text">{t.subject}</p><p className="text-xs text-text-muted">#{t.id} · {topicLabel(t.category)}{t.orderId ? ` · ${t.orderId}` : ""}</p></div> },
    { header: "Handled by", accessor: (t) => <span className="whitespace-nowrap">{t.assigneeName ?? "Unassigned"}</span> },
    { header: "Last message", accessor: (t) => { const m = t.messages[t.messages.length - 1]; return <span className="line-clamp-1 text-text-muted">{m ? `${m.from === "agent" ? m.author : "You"}: ${m.body}` : "—"}</span>; } },
    { header: "Status", align: "right", accessor: (t) => <TicketStateBadge state={customerState(t)} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Support Tickets"
        subtitle="Our support team replies here, usually within a few hours."
        actions={<Button onClick={() => navigate("/business/support/new")} className="flex items-center gap-2"><CirclePlus className="h-4 w-4" /> New Ticket</Button>}
      />
      <Link to="/business/incidents" className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text hover:bg-bg">
        <ShieldAlert className="h-4 w-4 text-sidebar" /> Reporting damage, a missing item or a delay? Use <span className="font-semibold text-primary">Incident Reports</span>.
      </Link>
      <Card className="flex flex-col gap-4">
        <div role="tablist" className="flex w-fit rounded-lg bg-bg p-1">
          {(["open", "resolved"] as const).map((t) => (
            <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cn("rounded-md px-4 py-1.5 text-sm font-medium capitalize", tab === t ? "bg-surface text-text shadow-sm" : "text-text-muted")}>
              {t} ({tickets.filter((x) => isActiveTicket(x) === (t === "open")).length})
            </button>
          ))}
        </div>
        <DataTable columns={columns} rows={rows} rowKey={(t) => t.id} onRowClick={(t) => navigate(`/business/support/${t.id}`)} />
        {rows.length === 0 && <p className="py-6 text-center text-sm text-text-muted">{tab === "open" ? "No open tickets." : "No resolved tickets yet."}</p>}
      </Card>
    </div>
  );
}
