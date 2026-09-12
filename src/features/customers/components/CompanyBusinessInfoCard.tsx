import { Building2 } from "lucide-react";
import { Card } from "../../../components/Card";
import type { CompanyBusinessInfo } from "../companyOverview";

export function CompanyBusinessInfoCard({ info }: { info: CompanyBusinessInfo }) {
  const rows = [
    { label: "Company Name", value: info.companyName },
    { label: "Tax ID / VAT", value: info.taxId },
    { label: "Primary Contact", value: info.primaryContact },
    { label: "Email", value: info.email },
    { label: "Registered Address", value: info.registeredAddress, fullWidth: true },
  ];

  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex items-center gap-2.5">
        <Building2 className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-text">Business Information</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className={row.fullWidth ? "sm:col-span-2" : undefined}>
            <p className="text-label text-text-muted">{row.label}</p>
            <p className="mt-1 text-sm font-medium text-text">{row.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
