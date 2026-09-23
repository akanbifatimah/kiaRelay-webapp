import { useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Card } from "../../components/Card";
import { Pagination } from "../../components/Pagination";
import { useToast } from "../../components/toast/ToastContext";
import { drivers } from "../drivers/driverRoster";
import { customers } from "../customers/data";
import { updateTicket, useTickets } from "./tickets";
import { sortTickets, type SortDirection, type TicketSortKey } from "./sortTickets";
import { statusLabels, type SupportAgent, type SupportTicket, type TicketStatus } from "./types";
import { MyTicketsTable } from "./components/MyTicketsTable";
import { ReassignTicketModal } from "./components/ReassignTicketModal";
import { SupportNotFound } from "./components/SupportNotFound";

// "View All" from the Driver/Customer Support Views' Open Tickets cards —
// every ticket that requester has raised, any status, any assignee. No
// design was shared, so it reuses My Tickets' table verbatim.
export function RequesterTicketsPage() {
  const { kind = "", id = "" } = useParams();
  const { pathname } = useLocation();
  const { showToast } = useToast();
  const allTickets = useTickets();
  const [status, setStatus] = useState<TicketStatus | "all">("all");
  const [sortKey, setSortKey] = useState<TicketSortKey>("created");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [reassigning, setReassigning] = useState<SupportTicket | null>(null);

  const name = kind === "driver" ? drivers.find((d) => d.id === id)?.name : kind === "customer" ? customers.find((c) => c.id === id)?.name : undefined;
  const rows = useMemo(
    () =>
      sortTickets(
        allTickets.filter((t) => t.requester?.kind === kind && t.requester.id === id && (status === "all" || t.status === status)),
        sortKey,
        sortDirection,
      ),
    [allTickets, kind, id, status, sortKey, sortDirection],
  );

  if (!name) return <SupportNotFound what={kind === "driver" ? "driver" : "customer"} id={id} />;

  const viewHref = `/support/${kind === "driver" ? "drivers" : "customers"}/${id}`;
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, pageCount);

  return (
    <div className="flex flex-col gap-6">
      <Link to={viewHref} className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to {name}
      </Link>
      <PageHeader
        title={`Tickets — ${name}`}
        subtitle={`Every support ticket raised by this ${kind}, across all agents and statuses.`}
        actions={
          <select
            aria-label="Status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as TicketStatus | "all");
              setPage(1);
            }}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
          >
            <option value="all">Status: All</option>
            {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        }
      />
      <Card className="flex flex-col gap-4">
        <MyTicketsTable
          rows={rows.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          sort={{ key: sortKey, direction: sortDirection }}
          onSortChange={(key) => {
            setSortDirection((prev) => (sortKey === key ? (prev === "asc" ? "desc" : "asc") : "asc"));
            setSortKey(key as TicketSortKey);
            setPage(1);
          }}
          onReassign={setReassigning}
          onResolve={(ticket) => {
            updateTicket(ticket.id, { status: "resolved", sla: "resolved" });
            showToast("success", `${ticket.id} marked as resolved.`);
          }}
          linkState={{ from: pathname, fromLabel: `${name}'s tickets` }}
        />
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={rows.length}
          pageSize={pageSize}
          itemLabel="tickets"
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </Card>
      {reassigning && (
        <ReassignTicketModal
          ticket={reassigning}
          onClose={() => setReassigning(null)}
          onReassign={(ticket, agent: SupportAgent) => {
            updateTicket(ticket.id, { assigneeId: agent.id });
            setReassigning(null);
            showToast("success", `${ticket.id} reassigned to ${agent.name}.`);
          }}
        />
      )}
    </div>
  );
}
