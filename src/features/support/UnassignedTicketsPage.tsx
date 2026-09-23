import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Pagination } from "../../components/Pagination";
import { useToast } from "../../components/toast/ToastContext";
import { CURRENT_AGENT_ID } from "./agents";
import { updateTicket, useTickets } from "./tickets";
import { EMPTY_TICKET_FILTERS, filterTickets, type TicketFilters } from "./filterTickets";
import { sortTickets, type SortDirection, type TicketSortKey } from "./sortTickets";
import type { SupportAgent, SupportTicket } from "./types";
import { TicketFilterBar } from "./components/TicketFilterBar";
import { UnassignedTicketsTable } from "./components/UnassignedTicketsTable";
import { ManualAssignmentModal } from "./components/ManualAssignmentModal";

export function UnassignedTicketsPage() {
  const { showToast } = useToast();
  const allTickets = useTickets();
  const tickets = useMemo(() => allTickets.filter((ticket) => !ticket.assigneeId && ticket.status !== "resolved"), [allTickets]);
  const [filters, setFilters] = useState<TicketFilters>(EMPTY_TICKET_FILTERS);
  const [sortKey, setSortKey] = useState<TicketSortKey>("sla");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [assigning, setAssigning] = useState<SupportTicket | null>(null);

  const sorted = useMemo(
    () => sortTickets(filterTickets(tickets, filters), sortKey, sortDirection),
    [tickets, filters, sortKey, sortDirection],
  );
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function handleSortChange(key: string) {
    setSortDirection((prev) => (sortKey === key ? (prev === "asc" ? "desc" : "asc") : "asc"));
    setSortKey(key as TicketSortKey);
    setPage(1);
  }

  function handleAssign(ticket: SupportTicket, agent: SupportAgent) {
    // TODO: POST /support/tickets/:id/assign { agentId } once the API exists.
    updateTicket(ticket.id, { assigneeId: agent.id });
    setAssigning(null);
    showToast(
      "success",
      agent.id === CURRENT_AGENT_ID ? `#${ticket.id} assigned to you — it's now in My Tickets.` : `#${ticket.id} assigned to ${agent.name}.`,
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Unassigned Tickets"
        subtitle={`${tickets.length} ticket${tickets.length === 1 ? "" : "s"} requiring assignment.`}
        actions={
          // TODO: re-fetch GET /support/tickets?assignee=none — with only
          // static mock data there's nothing newer to pull in yet.
          <Button variant="secondary" onClick={() => showToast("success", "Queue refreshed — you're up to date.")}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        }
      />
      <TicketFilterBar
        filters={filters}
        onChange={(next) => {
          setFilters(next);
          setPage(1);
        }}
      />
      <Card className="flex flex-col gap-4">
        <UnassignedTicketsTable
          rows={pageRows}
          sort={{ key: sortKey, direction: sortDirection }}
          onSortChange={handleSortChange}
          onAssign={setAssigning}
        />
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={sorted.length}
          pageSize={pageSize}
          itemLabel="tickets"
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </Card>
      {assigning && (
        <ManualAssignmentModal ticket={assigning} onClose={() => setAssigning(null)} onAssign={handleAssign} />
      )}
    </div>
  );
}
