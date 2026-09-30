import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight, History, Star } from "lucide-react";
import { Button } from "../../../../components/Button";
import { cityLine } from "../../deliveries/display";
import type { DeliveryDraft, DeliveryOrder, SavedLocation, StopAddress } from "../../deliveries/deliveryTypes";
import { updateDraft } from "../bookingDraft";
import { isComplete, type LocationsForm } from "./locationsForm";
import { StopCard } from "./StopCard";

interface LocationsStepProps {
  draft: DeliveryDraft;
  saved: SavedLocation[];
  orders: DeliveryOrder[];
  onNext: () => void;
}

const key = (a: StopAddress) => `${a.street}|${a.zip}`;

/** Step 1, "Set Location": loading + unloading stops and saved places. */
export function LocationsStep({ draft, saved, orders, onNext }: LocationsStepProps) {
  const { control, handleSubmit, setValue, getValues } = useForm<LocationsForm>({ defaultValues: { pickup: draft.pickup, dropoff: draft.dropoff } });
  const starred = useMemo(() => saved.map((l) => l.address), [saved]);
  const recent = useMemo(() => {
    const seen = new Set(starred.map(key));
    const list: StopAddress[] = [];
    for (const order of orders) {
      if (list.length === 3) break;
      if (!seen.has(key(order.dropoff.address))) {
        seen.add(key(order.dropoff.address));
        list.push(order.dropoff.address);
      }
    }
    return list;
  }, [orders, starred]);
  const places = useMemo(() => [...starred, ...recent], [starred, recent]);

  const fillNext = (address: StopAddress) => setValue(isComplete(getValues("pickup.address")) ? "dropoff.address" : "pickup.address", address, { shouldValidate: true });

  const onSubmit = handleSubmit((values) => {
    const clean = (s: LocationsForm["pickup"]) => ({ ...s, contactFirstName: s.contactFirstName.trim(), contactLastName: s.contactLastName.trim(), notes: s.notes.trim() });
    updateDraft({ pickup: clean(values.pickup), dropoff: clean(values.dropoff) });
    onNext();
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <StopCard control={control} setValue={setValue} stop="pickup" places={places} />
      <StopCard control={control} setValue={setValue} stop="dropoff" places={places} />
      {places.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-text">Saved Locations</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {[...recent.map((a) => ({ a, star: false })), ...starred.map((a) => ({ a, star: true }))].map(({ a, star }) => (
              <button key={`${star}-${key(a)}`} type="button" onClick={() => fillNext(a)} title="Fills the next empty location" className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3 text-left hover:border-primary">
                {star ? <Star className="h-4 w-4 shrink-0 text-text" /> : <History className="h-4 w-4 shrink-0 text-text" />}
                <span className="min-w-0">
                  <span className="block truncate text-sm text-text">{a.name || a.street}</span>
                  <span className="block truncate text-xs text-text-muted">{cityLine(a)}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
      <Button type="submit" className="flex items-center justify-center gap-2 self-end">
        Continue to Load Details <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}
