import { useMemo, useState } from "react";
import { ArrowLeft, Plus, History, ListFilter, BadgeCheck } from "lucide-react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
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

  function handleResolve(ticket: SupportTicket) {
    setTickets((prev) => prev.map((t) => (t.id === ticket.id ? { ...t, status: "resolved" } : t)));
    showToast("success", `${ticket.id} marked as resolved.`);
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={`/customers/${detail.accountType}/${detail.id}`}
        className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Profile
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={detail.name} src="/profile_img.png" />
          <div>
            <p className="text-lg font-semibold text-text">{detail.name}</p>
            <p className="flex items-center gap-1.5 text-sm text-text-muted">
              <BadgeCheck className="h-3.5 w-3.5 text-primary" />
              Customer ID: {detail.id}
              {detail.membershipTier && <> • {detail.membershipTier}</>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Ticket
          </Button>
          <Button variant="secondary" onClick={() => setTab(tab === "tickets" ? "audit-log" : "tickets")}>
            <History className="h-4 w-4" />
            {tab === "tickets" ? "Activity Log" : "View Tickets"}
          </Button>
        </div>
      </div>

      {tab === "tickets" && (
        <Card className="flex items-center gap-2">
          <ListFilter className="h-4 w-4 text-text-muted" />
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
        </Card>
      )}

      <Card className="flex flex-col gap-4">
        {tab === "tickets" ? (
          <SupportTicketTable tickets={filteredTickets} onResolve={handleResolve} />
        ) : (
          <AuditLogTable entries={auditLog} />
        )}
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
