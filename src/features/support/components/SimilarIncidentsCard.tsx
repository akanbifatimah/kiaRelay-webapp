import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "../../../components/Card";
import { DataTable, type Column } from "../../../components/DataTable";
import { Tooltip } from "../../../components/Tooltip";
import { cn } from "../../../lib/cn";
import { formatUsd, type SimilarIncident } from "../claimInvestigation";

const columns: Column<SimilarIncident>[] = [
  { header: "Claim ID", accessor: (row) => <span className="whitespace-nowrap font-semibold">{row.claimId}</span> },
  { header: "Driver", accessor: (row) => row.driver },
  { header: "Location", accessor: (row) => row.location },
  { header: "Date", accessor: (row) => <span className="whitespace-nowrap text-text-muted">{row.date}</span> },
  {
    header: "Status",
    accessor: (row) => (
      <span className="text-badge rounded bg-tag-standard-bg px-1.5 py-0.5 text-tag-standard-fg">{row.status}</span>
    ),
  },
  { header: "Settlement", align: "right", accessor: (row) => <span className="font-semibold">{formatUsd(row.settlement)}</span> },
];

export function SimilarIncidentsCard({ incidents }: { incidents: SimilarIncident[] }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const label = isExpanded ? "Collapse similar incidents" : "Expand similar incidents";

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-text">Fleet-wide Similar Incidents</h3>
        <Tooltip label={label}>
          <button type="button" aria-label={label} onClick={() => setIsExpanded((prev) => !prev)} className="text-text-muted hover:text-text">
            <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
          </button>
        </Tooltip>
      </div>
      {isExpanded &&
        (incidents.length === 0 ? (
          <p className="py-4 text-center text-sm text-text-muted">No similar incidents on record for this driver.</p>
        ) : (
          <DataTable columns={columns} rows={incidents} rowKey={(row) => row.claimId} />
        ))}
    </Card>
  );
}
