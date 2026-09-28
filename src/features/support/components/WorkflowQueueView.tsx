import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "../../../components/PageHeader";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Pagination } from "../../../components/Pagination";
import { useToast } from "../../../components/toast/ToastContext";
import { cn } from "../../../lib/cn";
import { useTableState } from "../../../hooks/useTableState";
import { useCurrentUser } from "../../access/permissions";
import { agentIdFor } from "../agents";
import { ticketDetailHref, useTickets } from "../tickets";
import { startWork } from "../supportWorkflow";
import { personaTitle, supportCaps, supportPersona } from "../supportRoles";
import { workflowActions, type WorkflowDialog } from "../workflowActions";
import { stageLabels, type SupportTicket, type TicketQueue, type TicketStage } from "../types";
import { WorkflowTicketsTable } from "./WorkflowTicketsTable";
import { WorkflowDialogs } from "./WorkflowDialogs";

type Tab = "attention" | TicketStage;

const PRIORITY_RANK = { critical: 0, high: 1, medium: 2, low: 3 };
const SORTERS = {
  id: (t: SupportTicket) => t.id,
  priority: (t: SupportTicket) => 3 - PRIORITY_RANK[t.priority],
  lastActivity: (t: SupportTicket) => -t.lastActivityMinutesAgo,
};

const COPY: Record<TicketQueue, { title: string; lead: string; staff: string; steps: string[] }> = {
  customer: {
    title: "Customer Support Queue",
    lead: "Every customer ticket. Assign to Support Staff, escalate to Technical, and close resolved tickets.",
    staff: "Tickets assigned to you. Work them, reply to the customer, then mark them resolved.",
    steps: ["New", "Assigned to Support Staff", "In Progress", "Resolved", "Lead Support closes & notifies customer"],
  },
  technical: {
    title: "Technical Support Queue",
    lead: "Escalated tickets and internal issues. Assign with priority, then verify and close resolutions.",
    staff: "Technical issues assigned to you. Resolve them for your Lead to verify.",
    steps: ["Escalated / created", "Assigned with priority", "In Progress", "Resolved", "Lead verifies & closes → back to Lead Support"],
  },
};

/** Needs a lead's decision: an escalation request, or a resolution to close/verify. */
function needsAttention(ticket: SupportTicket, queue: TicketQueue): boolean {
  if (queue === "technical") return (ticket.stage === "new" && !ticket.assigneeId) || ticket.stage === "resolved";
  return Boolean(ticket.escalationRequest) || ticket.stage === "resolved" || (ticket.stage === "new" && !ticket.assigneeId);
}

// Shared by /support/queue and /support/technical (TC-16, 2026-09-28). Leads
// see the whole queue and an "Needs Attention" tab; staff see their own work.
export function WorkflowQueueView({ queue }: { queue: TicketQueue }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const user = useCurrentUser();
  const persona = supportPersona(user);
  const caps = supportCaps(user);
  const agentId = agentIdFor(user);
  const seeAll = queue === "customer" ? caps.seeAllCustomer : caps.seeAllTechnical;
  const [tab, setTab] = useState<Tab>(seeAll ? "attention" : "in-progress");
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<WorkflowDialog | null>(null);
  const all = useTickets();

  const mine = useMemo(() => all.filter((t) => (t.queue ?? "customer") === queue && (seeAll || t.assigneeId === agentId)), [all, queue, seeAll, agentId]);
  const counts = useMemo(() => {
    const result: Record<Tab, number> = { attention: 0, new: 0, "in-progress": 0, resolved: 0, closed: 0 };
    mine.forEach((t) => {
      result[t.stage ?? "new"] += 1;
      if (needsAttention(t, queue)) result.attention += 1;
    });
    return result;
  }, [mine, queue]);
  const rows = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return mine
      .filter((t) => (tab === "attention" ? needsAttention(t, queue) : (t.stage ?? "new") === tab))
      .filter((t) => !needle || `${t.id} ${t.subject} ${t.customer}`.toLowerCase().includes(needle));
  }, [mine, tab, search, queue]);
  const table = useTableState({ rows, sorters: SORTERS, initialSort: { key: "priority", direction: "desc" } });

  const open = (ticket: SupportTicket) => navigate(ticketDetailHref(ticket), { state: { from: queue === "customer" ? "/support/queue" : "/support/technical", fromLabel: COPY[queue].title } });
  const actionsFor = (ticket: SupportTicket) =>
    workflowActions(ticket, caps, agentId, {
      open,
      start: (t) => {
        startWork(t, user?.name ?? "Admin");
        showToast("success", `#${t.id} is now In Progress.`);
      },
      dialog: setDialog,
    });
  const tabs: Tab[] = seeAll ? ["attention", "new", "in-progress", "resolved", "closed"] : ["new", "in-progress", "resolved", "closed"];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={COPY[queue].title}
        subtitle={`${personaTitle[persona]} view · ${seeAll ? COPY[queue].lead : COPY[queue].staff}`}
        actions={
          queue === "technical" && caps.createTechIssue ? (
            <Button variant="dark" onClick={() => setDialog({ kind: "create-tech" })}>
              <Plus className="h-4 w-4" />
              New Technical Issue
            </Button>
          ) : undefined
        }
      />
      <ol className="flex flex-wrap items-center gap-2 text-xs text-text-muted" aria-label="Workflow">
        {COPY[queue].steps.map((step, index) => (
          <li key={step} className="flex items-center gap-2">
            <span className="rounded-full bg-surface px-2.5 py-1 ring-1 ring-border">{step}</span>
            {index < COPY[queue].steps.length - 1 && <span aria-hidden>→</span>}
          </li>
        ))}
      </ol>
      <Card className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div role="tablist" className="flex flex-wrap gap-1 rounded-lg bg-bg p-1">
            {tabs.map((key) => (
              <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)} className={cn("rounded-md px-3 py-1.5 text-sm font-medium", tab === key ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text")}>
                {key === "attention" ? "Needs Attention" : stageLabels[key]} <span className="ml-1 text-xs text-text-muted">{counts[key]}</span>
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 lg:w-72">
            <Search className="h-4 w-4 text-text-muted" />
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ID, subject, requester..." aria-label="Search tickets" className="w-full bg-transparent text-sm text-text focus:outline-none" />
          </label>
        </div>
        {rows.length === 0 ? (
          <p className="py-10 text-center text-sm text-text-muted">Nothing here right now.</p>
        ) : (
          <WorkflowTicketsTable rows={table.pageRows} sort={table.sort} onSortChange={table.onSortChange} actionsFor={actionsFor} onRowClick={open} />
        )}
        <Pagination {...table.pagination} itemLabel="tickets" />
      </Card>
      <WorkflowDialogs dialog={dialog} onClose={() => setDialog(null)} />
    </div>
  );
}
