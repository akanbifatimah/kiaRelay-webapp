import { Card } from "../../../components/Card";
import type { BillingActivityRecord } from "../billingActivity";

export function RecentBillingActivityCard({ activity }: { activity: BillingActivityRecord[] }) {
  if (activity.length === 0) return null;

  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-label text-text-muted">Recent Billing Activity</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-label text-text-muted">
              <th className="pb-2 font-medium">Description</th>
              <th className="pb-2 font-medium">Method</th>
              <th className="pb-2 font-medium">Date</th>
              <th className="pb-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((entry) => (
              <tr key={entry.id} className="border-t border-border">
                <td className="py-2 text-text">{entry.description}</td>
                <td className="py-2 text-text-muted">{entry.method}</td>
                <td className="py-2 text-text-muted">{entry.date}</td>
                <td className="py-2 text-right font-medium text-text">{entry.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
