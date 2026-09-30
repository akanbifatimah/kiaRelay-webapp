import type { DeliveryStop, StopAddress } from "../../deliveries/deliveryTypes";

/** Step 1 ("Set Location") form values. */
export interface LocationsForm {
  pickup: DeliveryStop;
  dropoff: DeliveryStop;
}

/** A stop needs a complete, picked address. */
export const isComplete = (a: StopAddress) => Boolean(a.street && a.city && a.state && a.zip);
