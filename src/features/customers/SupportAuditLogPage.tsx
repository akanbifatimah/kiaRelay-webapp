import { useMemo, useState } from "react";
import { ArrowLeft, Plus, History } from "lucide-react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Avatar } from "../../components/Avatar";
import { useToast } from "../../components/toast/ToastContext";
import { SupportTicketTable } from "./components/SupportTicketTable";
import { AuditLogTable } from "./components/AuditLogTable";
import { CreateTicketModal } from "./components/CreateTicketModal";
import { customers } from "./data";
import { getCustomerDetail } from "./customerDetails";
import { buildSupportTickets, buildAuditLog, type SupportTicket, type TicketStatus } from "./supportTickets";
import { cn } from "../../lib/cn";

type Tab = "tickets" | "audit-log";

export function SupportAuditLogPage() {
  const { accountType, id } = useParams<{ accountType: string; id: string }>();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>(searchParams.get("tab") === "audit-log" ? "audit-log" : "tickets");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const customer = customers.find((c) => c.id === id);
  const detail = customer ? getCustomerDetail(customer) : null;
  const [tickets, setTickets] = useState<SupportTicket[]>(() => (detail ? buildSupportTickets(detail) : []));
  const auditLog = useMemo(() => (detail ? buildAuditLog(detail) : []), [detail]);

  if (!customer || !detail) {
    return <Navigate to={`/customers/${accountType ?? "individual"}`} replace />;
  }

  const filteredTickets = statusFilter === "all" ? tickets : tickets.filter((t) => t.status === statusFilter);

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={`/customers/${detail.accountType}/${detail.id}`}
        className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Profile
      </Link>

      <PageHeader
        title={`Support & Audit Logs — ${detail.name}`}
        subtitle="Track support tickets and admin actions taken on this account."
        actions={
          <>
            <Button variant="secondary" onClick={() => setTab(tab === "tickets" ? "audit-log" : "tickets")}>
              <History className="h-4 w-4" />
              {tab === "tickets" ? "Activity Log" : "View Tickets"}
            </Button>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Create Ticket
            </Button>
          </>
        }
      />

      <div className="flex items-center gap-3 rounded-[var(--radius-card)] border border-border bg-surface p-4">
        <Avatar name={detail.name} />
        <div>
          <p className="text-sm font-semibold text-text">{detail.name}</p>
          {detail.membershipTier && (
            <span className="text-badge rounded-full bg-tag-overnight-bg px-2 py-0.5 text-tag-overnight-fg">
              {detail.membershipTier}
            </span>
          )}
        </div>
      </div>

      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-1 rounded-lg bg-bg p-1">
            {(["tickets", "audit-log"] as Tab[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTab(option)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium",
                  tab === option ? "bg-surface text-text shadow-sm" : "text-text-muted",
                )}
              >
                {option === "tickets" ? "Support Tickets" : "Audit Log"}
              </button>
            ))}
          </div>

          {tab === "tickets" && (
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as TicketStatus | "all")}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          )}
        </div>

        {tab === "tickets" ? <SupportTicketTable tickets={filteredTickets} /> : <AuditLogTable entries={auditLog} />}
      </Card>

      {isCreateOpen && (
        <CreateTicketModal
          customerId={detail.id}
          onClose={() => setIsCreateOpen(false)}
          onCreate={(ticket) => {
            setTickets((prev) => [ticket, ...prev]);
            showToast("success", "Support ticket created.");
          }}
        />
      )}
    </div>
  );
}
