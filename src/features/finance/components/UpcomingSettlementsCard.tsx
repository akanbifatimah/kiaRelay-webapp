import { Card } from "../../../components/Card";
import type { UpcomingSettlement } from "../data";

function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

export function UpcomingSettlementsCard({ settlements }: { settlements: UpcomingSettlement[] }) {
  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-text">Upcoming Settlements</h3>
      {settlements.length === 0 ? (
        <p className="py-6 text-center text-sm text-text-muted">No settlements scheduled.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {settlements.map((settlement) => (
            <div key={settlement.id} className="flex items-center justify-between py-2.5 text-sm">
              <div>
                <p className="font-medium text-text">{settlement.label}</p>
                <p className="text-xs text-text-muted">{settlement.date}</p>
              </div>
              <span className="font-semibold text-text">{formatCurrency(settlement.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
