import { formatMoney } from "../../deliveries/pricing";
import type { Quote } from "../../deliveries/trackingTypes";

/** Navy "Order Summary": price lines and the orange total. */
export function OrderSummary({ quote }: { quote: Quote }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-sidebar p-5">
      <h2 className="text-base font-semibold text-white">Order Summary</h2>
      <dl className="flex flex-col gap-2 text-sm">
        {quote.lines.map((line) => (
          <div key={line.label} className="flex justify-between gap-4">
            <dt className="text-white/70">{line.label}</dt>
            <dd className="text-white/90">{formatMoney(line.amount)}</dd>
          </div>
        ))}
      </dl>
      <div className="flex items-end justify-between border-t border-white/15 pt-3">
        <span className="font-semibold text-white">Total</span>
        <span className="text-3xl font-bold text-primary">{formatMoney(quote.total)}</span>
      </div>
      <p className="text-xs text-white/60">{quote.miles} miles · est. {Math.floor(quote.transitMinutes / 60)}h {quote.transitMinutes % 60}m in transit</p>
    </div>
  );
}
