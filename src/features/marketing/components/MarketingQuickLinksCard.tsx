import { Link } from "react-router-dom";
import { Mail, Megaphone, Newspaper } from "lucide-react";
import { Card } from "../../../components/Card";

const links = [
  { label: "Emails", icon: Mail, href: "/marketing/emails" },
  { label: "Campaigns", icon: Megaphone, href: "/marketing/campaigns" },
  { label: "Newsletters", icon: Newspaper, href: "/marketing/newsletters" },
];

export function MarketingQuickLinksCard() {
  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-label text-text-muted">Quick Links</h3>
      <div className="grid grid-cols-3 gap-2">
        {links.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            to={href}
            className="flex flex-col items-center gap-1.5 rounded-lg border border-border p-3 text-xs font-medium text-text hover:bg-bg"
          >
            <Icon className="h-4 w-4 text-primary" />
            {label}
          </Link>
        ))}
      </div>
    </Card>
  );
}
