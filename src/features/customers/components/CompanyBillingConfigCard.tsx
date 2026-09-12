import { useState } from "react";
import { Landmark, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../../../components/Card";
import { Tooltip } from "../../../components/Tooltip";
import { EditBillingConfigurationModal } from "./EditBillingConfigurationModal";
import { paymentTermsLabel } from "../customerDetails";
import type { CompanyBillingConfig } from "../companyOverview";

interface CompanyBillingConfigCardProps {
  config: CompanyBillingConfig;
  invoicesHref: string;
  onUpdate: (config: CompanyBillingConfig) => void;
}

export function CompanyBillingConfigCard({ config, invoicesHref, onUpdate }: CompanyBillingConfigCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const rows = [
    { label: "Billing Method", value: config.billingMethod },
    { label: "Payment Terms", value: paymentTermsLabel(config.paymentTerms) },
    { label: "Next Invoice", value: config.nextInvoiceDate },
  ];

  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Landmark className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-text">Billing Configuration</h3>
        </div>
        <Tooltip label="Edit Billing Configuration">
          <button
            type="button"
            aria-label="Edit Billing Configuration"
            onClick={() => setIsEditOpen(true)}
            className="text-text-muted hover:text-text"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </Tooltip>
      </div>

      <div className="flex flex-col gap-3 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3">
            <span className="text-text-muted">{row.label}</span>
            <span className="font-medium text-text">{row.value}</span>
          </div>
        ))}
      </div>

      <Link
        to={invoicesHref}
        className="mt-auto flex w-full items-center justify-center rounded-lg border border-border bg-bg px-4 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface"
      >
        Manage Billing
      </Link>

      {isEditOpen && (
        <EditBillingConfigurationModal
          config={config}
          onClose={() => setIsEditOpen(false)}
          onSave={onUpdate}
        />
      )}
    </Card>
  );
}
