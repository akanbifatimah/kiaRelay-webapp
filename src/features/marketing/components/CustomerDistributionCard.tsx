import { Card } from "../../../components/Card";
import { marketingAreas } from "../data";
import { CustomerDistributionMap } from "./CustomerDistributionMap";

export function CustomerDistributionCard() {
  return (
    <Card className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-text">Where your customers are</h3>
      <div className="relative">
        <CustomerDistributionMap />
        <span className="absolute right-3 top-3 z-10 rounded-full bg-surface px-2 py-1 text-xs font-medium text-text-muted shadow-sm">
          Texas & Louisiana
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-text-muted">
        <span>Fewer customers</span>
        <span className="h-1.5 flex-1 rounded-full bg-gradient-to-r from-primary/15 to-primary" />
        <span>More customers</span>
      </div>
      <ol className="flex flex-col gap-2 text-sm">
        {marketingAreas.map((area, i) => (
          <li key={area.id} className="flex items-center justify-between">
            <span className="text-text">
              {i + 1}. {area.name}
            </span>
            <span className="text-text-muted">{area.customerCount.toLocaleString()} customers</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}
