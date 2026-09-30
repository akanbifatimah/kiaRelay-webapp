import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BarChart3, MapPin, PackagePlus, ReceiptText, Route, Users } from "lucide-react";
import { Avatar } from "../../../../components/Avatar";
import { Button } from "../../../../components/Button";
import { PageHeader } from "../../../../components/PageHeader";
import { StatTile } from "../../../../components/StatTile";
import { eventTime, isFinished, stageOf } from "../../deliveries/deliverySim";
import { useSavedLocations } from "../../deliveries/deliveriesStore";
import { orderTotal } from "../../deliveries/invoices";
import { formatMoney } from "../../deliveries/pricing";
import { spendByMonth } from "../../deliveries/spend";
import { cityLine } from "../../deliveries/display";
import { emptyStop, startDraft } from "../bookingDraft";
import { EmptyNote, LiveDeliveryList, RecentInvoices, SectionCard } from "../components/DashboardCards";
import { SpendChart } from "../components/SpendChart";
import { canBook, usePortalAccount } from "../usePortalAccount";
import { useNow, usePortalBilling, usePortalDeliveries, usePortalTeam } from "../usePortalData";

// Portal dashboard (2026-09-30): the Business Home design (Company
// Deliveries, Usage & Spend, Invoices, Team & Branches, Send again) laid out
// for desktop, plus KPI tiles.
export function PortalDashboardPage() {
  const account = usePortalAccount();
  const navigate = useNavigate();
  const now = useNow();
  const orders = usePortalDeliveries(account);
  const { invoices, terms } = usePortalBilling(account);
  const team = usePortalTeam(account);
  const saved = useSavedLocations(account?.id);
  const months = useMemo(() => spendByMonth(orders, now), [orders, now]);
  if (!account) return null;

  const live = orders.filter((o) => !isFinished(stageOf(o, now)));
  const month = new Date(now).getMonth();
  const thisMonth = orders.filter((o) => stageOf(o, now) !== "cancelled" && new Date(eventTime(o, "delivered") ?? o.createdAt).getMonth() === month);
  const overdue = invoices.filter((i) => i.status === "overdue").length;
  const book = () => {
    startDraft();
    navigate("/business/book");
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Welcome back, ${account.owner.firstName}`}
        subtitle={account.company.legalName}
        actions={
          <Button onClick={book} disabled={!canBook(account)} title={canBook(account) ? undefined : "Booking opens once your company is verified"} className="flex items-center gap-2">
            <PackagePlus className="h-4 w-4" />
            Book a Delivery
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="On the Road" value={String(live.length)} accent="primary" />
        <StatTile label="Spend This Month" value={formatMoney(thisMonth.reduce((s, o) => s + orderTotal(o), 0))} accent="neutral" />
        <StatTile label="Deliveries This Month" value={String(thisMonth.length)} accent="success" />
        <StatTile label="Outstanding Balance" value={formatMoney(terms?.outstandingBalance ?? 0)} accent={overdue ? "danger" : "neutral"} delta={overdue ? { kind: "down", value: `${overdue} overdue` } : undefined} />
      </div>
      <div className="grid gap-6 xl:grid-cols-5">
        <SectionCard title="Company Deliveries" icon={Route} action={{ label: "View all", to: "/business/deliveries" }} className="xl:col-span-3">
          {live.length ? <LiveDeliveryList orders={live.slice(0, 5)} now={now} /> : <EmptyNote text="Nothing is currently on the road" link={{ label: "View Past Deliveries", to: "/business/deliveries?tab=past" }} />}
        </SectionCard>
        <SectionCard title="Usage & Spend" icon={BarChart3} action={{ label: "Details", to: "/business/spend" }} className="xl:col-span-2">
          <SpendChart months={months} height={200} />
        </SectionCard>
        <SectionCard title="Invoices" icon={ReceiptText} action={{ label: "View All Invoices", to: "/business/invoices" }} className="xl:col-span-3">
          <RecentInvoices invoices={invoices} />
        </SectionCard>
        <SectionCard title="Team & Branches" icon={Users} action={{ label: "+ Add Member", to: "/business/team?add=1" }} className="xl:col-span-2">
          <ul className="flex flex-col gap-2">
            {team.filter((m) => m.status === "active").slice(0, 4).map((m) => (
              <li key={m.id} className="flex items-center gap-3 rounded-lg border border-border p-2.5">
                <Avatar name={`${m.firstName} ${m.lastName}`} shape="square" />
                <div className="min-w-0">
                  <p className="truncate text-sm text-text">{m.firstName} {m.lastName}</p>
                  <p className="truncate text-xs capitalize text-text-muted">{m.role} • {m.branchAssignment}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
      {saved.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text">Send again</h2>
            <Link to="/business/locations" className="text-sm font-medium text-primary hover:underline">View all</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {saved.map(({ id, address }) => (
              <button key={id} type="button" disabled={!canBook(account)} onClick={() => { startDraft({ dropoff: { ...emptyStop(), address } }, "send-again"); navigate("/business/book"); }} className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-4 text-left hover:border-primary disabled:opacity-60">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-text"><MapPin className="h-3.5 w-3.5" />{address.name || address.street}</span>
                <span className="truncate text-xs text-text-muted">{address.street}, {cityLine(address)}</span>
                <span className="mt-2 flex items-center gap-1 text-xs font-semibold text-primary">Send again <ArrowRight className="h-3 w-3" /></span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
