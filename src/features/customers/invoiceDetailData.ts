import type { InvoiceDetail } from "./invoiceDetail";

// TODO: replace with GET /invoices/:id once the Customer Management /
// billing API exists. The one fully hand-authored example, matching the
// Figma reference exactly — its billing entity ("Global Logistics Partners
// Ltd.") is a distinct billed-to party from the parent account (Acme
// Refinery LLC), not a data-consistency bug.
export const handAuthoredInvoiceDetails: Record<string, InvoiceDetail> = {
  "KR-INV-8842": {
    id: "KR-INV-8842",
    status: "paid",
    customerName: "Global Logistics Partners Ltd.",
    taxId: "US-99420034",
    billingAddress: "442 Commerce Blvd, Suite 1000, Chicago, IL 60601, United States",
    paymentMethodLabel: "ACH Transfer (Ending in 4928)",
    invoiceDate: "Oct 24, 2023",
    invoiceGeneratedAt: "Generated at 14:32 EST",
    dueDate: "Nov 07, 2023",
    termsLabel: "Net 14 Terms",
    lineItems: [
      {
        orderId: "ORD-49221",
        description: "Expedited Freight, Standard Pallets",
        route: "ORD (Chicago) → LAX (Los Angeles)",
        date: "Oct 20, 2023",
        amount: "$4,500.00",
      },
      {
        orderId: "ORD-49235",
        description: "Local Dispatch, Cold Storage Item",
        route: "Warehouse A → Dist. Center B",
        date: "Oct 22, 2023",
        amount: "$1,250.00",
      },
      {
        orderId: "ORD-49299",
        description: "Standard Haul, Bulk Raw Materials",
        route: "Detroit MI → Chicago IL",
        date: "Oct 23, 2023",
        amount: "$6,200.00",
      },
    ],
    subtotal: "$11,950.00",
    platformFeeLabel: "Platform Fee (7.5%)",
    platformFee: "$892.50",
    fuelSurcharge: "-$0.00",
    totalDue: "$12,842.50",
    billingNotes:
      "Customer requested a consolidated invoice for all shipments between Oct 20-23. Apply standard loyalty discount for Q4. Payment confirmed via internal gateway.",
    timeline: [
      { label: "Payment Completed", timestamp: "Oct 28, 12:01 AM", tone: "success" },
      { label: "Invoice Viewed by Client", timestamp: "Oct 25, 08:44 AM", tone: "warning" },
      { label: "Invoice Generated", timestamp: "Oct 24, 09:32 AM", tone: "muted" },
    ],
  },
};
