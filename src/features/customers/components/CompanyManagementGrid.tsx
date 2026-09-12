import { Link } from "react-router-dom";
import { Users, FileText, ShieldCheck, ClipboardCheck, History, Truck } from "lucide-react";
import { Card } from "../../../components/Card";

interface CompanyManagementGridProps {
  ordersHref: string;
  invoicesHref: string;
  supportHref: string;
  usersBranchesHref: string;
  onVerifyApplication: () => void;
}

export function CompanyManagementGrid({
  ordersHref,
  invoicesHref,
  supportHref,
  usersBranchesHref,
  onVerifyApplication,
}: CompanyManagementGridProps) {
  const items = [
    { label: "Team and Branches", icon: Users, href: usersBranchesHref },
    { label: "Billing & Invoices", icon: FileText, href: invoicesHref },
    { label: "Support and Claims", icon: ShieldCheck, href: supportHref },
    { label: "Verify Application", icon: ClipboardCheck, onClick: onVerifyApplication },
    { label: "Activity Log", icon: History, href: `${supportHref}?tab=audit-log` },
    { label: "Orders", icon: Truck, href: ordersHref },
  ];

  return (
    <Card className="flex h-full flex-col">
      <h2 className="text-lg font-semibold text-text">Customer Management</h2>
      <p className="mt-1 text-sm text-text-muted">Direct access to records, claims and support tools.</p>

      <div className="mt-5 grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map(({ label, icon: Icon, href, onClick }) => {
          const className =
            "flex min-h-26 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-bg/60 p-3 text-center transition-colors hover:border-primary/50 hover:bg-bg";
          const content = (
            <>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-sm font-medium text-text">{label}</span>
            </>
          );

          return href ? (
            <Link key={label} to={href} className={className}>
              {content}
            </Link>
          ) : (
            <button key={label} type="button" onClick={onClick} className={className}>
              {content}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
