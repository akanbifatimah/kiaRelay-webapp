import { Card } from "../../../components/Card";
import type { FinanceInvoiceDetail } from "../financeInvoiceDetail";

export function InvoiceDeliveryChargesCard({ detail }: { detail: FinanceInvoiceDetail }) {
  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">Delivery Charges</h3>
        <span className="text-xs text-text-muted">{detail.lineItems.length} Line Items</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-max text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-medium text-text-muted">
              <th className="whitespace-nowrap py-2 pr-4">Order ID</th>
              <th className="whitespace-nowrap py-2 pr-4">Details</th>
              <th className="whitespace-nowrap py-2 pr-4">Route</th>
              <th className="whitespace-nowrap py-2 pr-4">Period</th>
              <th className="whitespace-nowrap py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {detail.lineItems.map((item) => (
              <tr key={item.orderId} className="border-b border-border last:border-0">
                <td className="whitespace-nowrap py-2.5 pr-4 font-medium text-primary">{item.orderId}</td>
                <td className="py-2.5 pr-4 text-text">{item.description}</td>
                <td className="whitespace-nowrap py-2.5 pr-4 text-text-muted">{item.route}</td>
                <td className="whitespace-nowrap py-2.5 pr-4 text-text-muted">{item.date}</td>
                <td className="whitespace-nowrap py-2.5 text-right font-medium text-text">{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-1.5 border-t border-border pt-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-text-muted">Subtotal</span>
          <span className="text-text">{detail.subtotal}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-muted">{detail.platformFeeLabel}</span>
          <span className="text-text">{detail.platformFee}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-muted">Fuel Surcharge</span>
          <span className="text-text">{detail.fuelSurcharge}</span>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-1.5 text-base font-semibold">
          <span className="text-text">Total Due</span>
          <span className="text-primary">${detail.invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </Card>
  );
}
