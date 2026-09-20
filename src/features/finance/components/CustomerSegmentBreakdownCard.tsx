import { useState } from "react";
import { User, Building2, Info } from "lucide-react";
import { Card } from "../../../components/Card";
import { SegmentAnalysisModal } from "./SegmentAnalysisModal";
import { getSegmentAnalyses } from "../segmentAnalysis";
import type { CustomerSegment } from "../data";

const iconByKey = { individuals: User, companies: Building2 };
const iconBoxByKey = {
  individuals: "bg-tag-express-bg text-tag-express-fg",
  companies: "bg-tag-danger-bg text-tag-danger-fg",
};

function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

export function CustomerSegmentBreakdownCard({ segments, note }: { segments: CustomerSegment[]; note: string }) {
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-text">Customer Segment Breakdown</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {segments.map((segment) => {
          const Icon = iconByKey[segment.key];
          return (
            <div key={segment.key} className="flex flex-col gap-2 rounded-lg border border-border p-3">
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBoxByKey[segment.key]}`}>
                <Icon className="h-4 w-4" />
              </span>
              <p className="text-sm font-medium text-text">{segment.label}</p>
              <div className="flex flex-col gap-1 text-xs text-text-muted">
                <span>
                  Revenue <span className="font-semibold text-text">{formatCurrency(segment.revenue)}</span>
                </span>
                <span>
                  Volume <span className="font-medium text-text">{segment.volume.toLocaleString()}</span>
                </span>
                <span>
                  Avg <span className="font-medium text-text">${segment.avgOrder.toFixed(2)}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between gap-2 rounded-lg bg-tag-info-bg px-3 py-2 text-xs text-tag-info-fg">
        <span className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5" />
          {note}
        </span>
        <button
          type="button"
          onClick={() => setIsAnalysisOpen(true)}
          className="shrink-0 font-medium hover:underline"
        >
          Full Analysis
        </button>
      </div>

      {isAnalysisOpen && (
        <SegmentAnalysisModal segments={getSegmentAnalyses(segments)} onClose={() => setIsAnalysisOpen(false)} />
      )}
    </Card>
  );
}
