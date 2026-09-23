import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Pagination } from "../../components/Pagination";
import { useToast } from "../../components/toast/ToastContext";
import { CURRENT_AGENT_ID } from "./agents";
import { createTicket, updateTicket, useTickets } from "./tickets";
import { countActiveFilters, EMPTY_TICKET_FILTERS, filterTickets, type TicketFilters } from "./filterTickets";
import { sortTickets, type SortDirection, type TicketSortKey } from "./sortTickets";
import type { SupportAgent, SupportTicket, TicketStatus } from "./types";
import { FilterPopover } from "./components/FilterPopover";
import { TicketFilterSelects } from "./components/TicketFilterBar";
import { TicketStatusTabs } from "./components/TicketStatusTabs";
import { MyTicketsTable } from "./components/MyTicketsTable";
import { NewTicketModal, type NewTicketValues } from "./components/NewTicketModal";
import { ReassignTicketModal } from "./components/ReassignTicketModal";

export function MyTicketsPage() {
  const { showToast } = useToast();
  const allTickets = useTickets();
  const tickets = useMemo(() => allTickets.filter((ticket) => ticket.assigneeId === CURRENT_AGENT_ID), [allTickets]);
  const [tab, setTab] = useState<TicketStatus>("open");
  const [filters, setFilters] = useState<TicketFilters>(EMPTY_TICKET_FILTERS);
  const [sortKey, setSortKey] = useState<TicketSortKey>("sla");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [reassigning, setReassigning] = useState<SupportTicket | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const counts = useMemo(() => {
    const result: Record<TicketStatus, number> = { open: 0, "awaiting-customer": 0, "awaiting-internal": 0, resolved: 0 };
    tickets.forEach((ticket) => (result[ticket.status] += 1));
    return result;
  }, [tickets]);
  const sorted = useMemo(
    () => sortTickets(filterTickets(tickets.filter((ticket) => ticket.status === tab), filters), sortKey, sortDirection),
    [tickets, tab, filters, sortKey, sortDirection],
  );
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function resetPage<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  function handleSortChange(key: string) {
    setSortDirection((prev) => (sortKey === key ? (prev === "asc" ? "desc" : "asc") : "asc"));
    setSortKey(key as TicketSortKey);
    setPage(1);
  }

  // TODO: POST /support/tickets/:id/reassign and PATCH /support/tickets/:id
  // { status } once the API exists — both update the session store for now.
  function handleReassign(ticket: SupportTicket, agent: SupportAgent) {
    updateTicket(ticket.id, { assigneeId: agent.id });
    setReassigning(null);
    showToast("success", `${ticket.id} reassigned to ${agent.name}.`);
  }

  function handleResolve(ticket: SupportTicket) {
    updateTicket(ticket.id, { status: "resolved", sla: "resolved" });
    showToast("success", `${ticket.id} marked as resolved.`);
  }

  function handleCreate(values: NewTicketValues) {
    const ticket = createTicket(values);
    setTab("open");
    setIsCreating(false);
    showToast("success", `${ticket.id} created and assigned to you.`);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Open Tickets"
        subtitle="Manage and respond to your assigned issues."
        actions={
          <>
            <FilterPopover activeCount={countActiveFilters(filters)} onClear={() => resetPage(setFilters)(EMPTY_TICKET_FILTERS)}>
              <TicketFilterSelects filters={filters} onChange={resetPage(setFilters)} showSla={false} />
            </FilterPopover>
            <Button variant="dark" onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4" />
              New Ticket
            </Button>
          </>
        }
      />
      <TicketStatusTabs value={tab} counts={counts} onChange={resetPage(setTab)} />
      <Card className="flex flex-col gap-4">
        <MyTicketsTable
          rows={pageRows}
          sort={{ key: sortKey, direction: sortDirection }}
          onSortChange={handleSortChange}
          onReassign={setReassigning}
          onResolve={handleResolve}
        />
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={sorted.length}
          pageSize={pageSize}
          itemLabel="tickets"
          onPageChange={setPage}
          onPageSizeChange={resetPage(setPageSize)}
        />
      </Card>
      {reassigning && <ReassignTicketModal ticket={reassigning} onClose={() => setReassigning(null)} onReassign={handleReassign} />}
      {isCreating && <NewTicketModal onClose={() => setIsCreating(false)} onCreate={handleCreate} />}
    </div>
  );
}
