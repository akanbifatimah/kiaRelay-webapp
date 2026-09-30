import { Controller, useForm } from "react-hook-form";
import { Download, MapPin, PenLine, Send, Star } from "lucide-react";
import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
import { FormField } from "../../../../components/FormField";
import { useToast } from "../../../../components/toast/ToastContext";
import { rateDelivery } from "../../deliveries/deliveryActions";
import { cityState, formatWhen } from "../../deliveries/display";
import type { DeliveryOrder } from "../../deliveries/deliveryTypes";
import { DriverPhoto } from "./DriverBits";
import { printProof } from "./printProof";

/** Proof of Delivery: photo, signature, verified location, driver. */
export function ProofCard({ order }: { order: DeliveryOrder }) {
  const { showToast } = useToast();
  const pod = order.pod;
  if (!pod) return null;
  return (
    <Card className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-text">Proof of Delivery</h2>
      <img src={pod.photo === "delivery-door" ? "/business/delivery-door.webp" : pod.photo} alt="Delivery photo" className="h-48 w-full rounded-lg object-cover" />
      <div className="flex items-center gap-3 rounded-lg border border-border p-3">
        <PenLine className="h-4 w-4 text-text-muted" />
        {/* TODO: the captured signature image from the driver app. */}
        <svg viewBox="0 0 180 60" className="h-10 w-32 text-text" aria-label={`Signature of ${pod.signedByFirstName} ${pod.signedByLastName}`}>
          <path d="M5 40 C 25 5, 35 55, 55 30 S 85 10, 95 35 S 125 55, 140 25 S 165 20, 175 32" stroke="currentColor" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        </svg>
        <p className="text-sm text-text">
          {pod.signedByFirstName} {pod.signedByLastName}, {pod.signedByTitle}
          <span className="block text-xs text-text-muted">{formatWhen(pod.signedAt)}</span>
        </p>
      </div>
      <p className="flex items-center gap-2 text-sm text-text">
        <MapPin className="h-4 w-4 text-text-muted" /> Location verified: {cityState(order.dropoff.address)} · {pod.lat.toFixed(4)}° N, {Math.abs(pod.lng).toFixed(4)}° W
      </p>
      {order.driver && (
        <p className="flex items-center gap-2 text-sm text-text">
          <DriverPhoto driver={order.driver} size={28} /> Delivered by {order.driver.firstName} {order.driver.lastName[0]}. (Driver {order.driver.id})
        </p>
      )}
      <Button onClick={() => printProof(order) || showToast("error", "Allow pop-ups to download the proof.")} className="flex items-center justify-center gap-2">
        <Download className="h-4 w-4" /> Download Proof
      </Button>
    </Card>
  );
}

/** "How was your delivery?" — stars + optional comment. */
export function RatingCard({ order }: { order: DeliveryOrder }) {
  const { control, handleSubmit } = useForm<{ stars: number; comment: string }>({ defaultValues: { stars: 0, comment: "" } });
  if (!order.driver) return null;
  if (order.rating) {
    return (
      <Card className="flex items-center gap-2 text-sm text-text">
        You rated {order.driver.firstName}
        {Array.from({ length: 5 }, (_, i) => <Star key={i} className={i < (order.rating?.stars ?? 0) ? "h-4 w-4 fill-warning text-warning" : "h-4 w-4 text-text-muted"} />)}
      </Card>
    );
  }
  return (
    <Card>
      <form onSubmit={handleSubmit(({ stars, comment }) => rateDelivery(order.id, stars, comment))} className="flex flex-col items-center gap-3">
        <h2 className="font-semibold text-text">How was your delivery?</h2>
        <p className="-mt-2 text-xs text-text-muted">Rate {order.driver.firstName} {order.driver.lastName[0]}. on their service.</p>
        <Controller
          control={control}
          name="stars"
          rules={{ min: { value: 1, message: "Pick a star rating." } }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <div className="flex flex-col items-center gap-1">
              <div role="radiogroup" aria-label="Rating" className="flex gap-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <button key={i} type="button" role="radio" aria-checked={value === i + 1} aria-label={`${i + 1} star${i ? "s" : ""}`} onClick={() => onChange(i + 1)}>
                    <Star className={i < value ? "h-7 w-7 fill-warning text-warning" : "h-7 w-7 text-text"} />
                  </button>
                ))}
              </div>
              {error?.message && <span className="text-xs text-danger">{error.message}</span>}
            </div>
          )}
        />
        <div className="w-full">
          <FormField control={control} name="comment" label="Comment (optional)" type="textarea" placeholder="Add a comment..." />
        </div>
        <Button type="submit" variant="outline" className="flex w-full items-center justify-center gap-2">
          Submit Rating <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}
