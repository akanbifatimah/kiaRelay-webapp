import { useState } from "react";
import { Controller, useWatch, type Control, type UseFormSetValue } from "react-hook-form";
import { ClipboardCheck, Search, X } from "lucide-react";
import { StatusBadge } from "../../../components/StatusBadge";
import { findOrder, searchOrders, type CreateClaimValues } from "../buildNewClaim";

interface ClaimOrderLookupProps {
  control: Control<CreateClaimValues>;
  setValue: UseFormSetValue<CreateClaimValues>;
}

// Section 1 of Create New Claim. "Search Logistics DB" runs a real search
// over the Orders dataset (orders/data.ts); picking a result links it and
// swaps the empty state for a confirm card, per the screenshot's
// "Search for an order to view and confirm details here".
export function ClaimOrderLookup({ control, setValue }: ClaimOrderLookupProps) {
  const [orderQuery, orderId] = useWatch({ control, name: ["orderQuery", "orderId"] });
  const [results, setResults] = useState<ReturnType<typeof searchOrders> | null>(null);
  const selected = orderId ? findOrder(orderId) : undefined;

  function runSearch() {
    setResults(searchOrders(orderQuery));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-label uppercase text-text-muted">Order ID / Customer / Driver</span>
        <div className="flex flex-wrap gap-2">
          <Controller
            name="orderQuery"
            control={control}
            rules={{ validate: (_value, values) => Boolean(values.orderId) || "Link an order before creating the claim." }}
            render={({ field, fieldState }) => (
              <div className="flex min-w-56 flex-1 flex-col gap-1">
                <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
                  <Search className="h-4 w-4 text-text-muted" />
                  <input
                    {...field}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        runSearch();
                      }
                    }}
                    placeholder="e.g. ORD-2803"
                    className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
                  />
                </div>
                {fieldState.error && <span className="text-xs text-danger">{fieldState.error.message}</span>}
              </div>
            )}
          />
          <button type="button" onClick={runSearch} className="h-fit rounded-md bg-sidebar px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
            Search Logistics DB
          </button>
        </div>
      </div>

      {selected ? (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-success/30 bg-success/5 p-4">
          <div className="grid flex-1 gap-3 text-sm sm:grid-cols-4">
            <div>
              <p className="text-xs text-text-muted">Order</p>
              <p className="font-semibold text-text">{selected.id}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Customer</p>
              <p className="font-medium text-text">{selected.customer}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Route</p>
              <p className="font-medium text-text">{selected.pickup} → {selected.dropoff}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Driver · Status</p>
              <p className="flex items-center gap-2 font-medium text-text">
                {selected.driver} <StatusBadge status={selected.status} />
              </p>
            </div>
          </div>
          <button type="button" onClick={() => setValue("orderId", "", { shouldDirty: true })} className="flex items-center gap-1 text-xs font-medium text-text-muted hover:text-danger">
            <X className="h-3.5 w-3.5" />
            Change
          </button>
        </div>
      ) : results && results.length > 0 ? (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
          {results.map((order) => (
            <li key={order.id}>
              <button
                type="button"
                onClick={() => {
                  setValue("orderId", order.id, { shouldDirty: true, shouldValidate: true });
                  setValue("orderQuery", order.id, { shouldValidate: true });
                  setResults(null);
                }}
                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm hover:bg-bg"
              >
                <span className="font-semibold text-text">{order.id}</span>
                <span className="flex-1 text-text-muted">{order.customer} · {order.pickup} → {order.dropoff}</span>
                <span className="text-xs text-text-muted">{order.driver}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-lg bg-bg py-8 text-center text-sm text-text-muted">
          <ClipboardCheck className="h-5 w-5" />
          {results ? `No orders match “${orderQuery}”. Try an order ID like ORD-2803, a customer, or a driver.` : "Search for an order to view and confirm details here."}
        </div>
      )}
    </div>
  );
}
