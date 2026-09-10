import { MapPin } from "lucide-react";
import { Card } from "../../../components/Card";

// TODO: replace the static placeholder with a real OrderRouteMap-style
// embed once this customer's actual delivery locations are available.
export function DeliveryLocationInsightCard() {
  return (
    <Card className="flex items-center gap-4">
      <div className="flex-1">
        <h3 className="text-label text-text-muted">Delivery Location Insight</h3>
        <p className="text-body mt-1 text-text-muted">
          Most orders are delivered to their primary office in Chicago, IL. Frequent delivery window: 10:00 AM –
          12:00 PM.
        </p>
        <p className="mt-2 text-xs font-medium text-success">High Reliability · Downtown Chicago</p>
      </div>
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-bg text-text-muted">
        <MapPin className="h-6 w-6" />
      </div>
    </Card>
  );
}
