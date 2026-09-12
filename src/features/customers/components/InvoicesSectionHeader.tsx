import { Download, Plus } from "lucide-react";
import { Button } from "../../../components/Button";

interface InvoicesSectionHeaderProps {
  onExport: () => void;
  onCreate: () => void;
}

export function InvoicesSectionHeader({ onExport, onCreate }: InvoicesSectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-base font-semibold text-text">Invoices</h2>
      <div className="flex items-center gap-2">
        <Button type="button" variant="secondary" onClick={onExport}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
        <Button type="button" onClick={onCreate}>
          <Plus className="h-4 w-4" />
          Create Invoice
        </Button>
      </div>
    </div>
  );
}
