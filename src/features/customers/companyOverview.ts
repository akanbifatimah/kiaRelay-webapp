import type { CustomerDetail, PaymentTerms } from "./customerDetails";

export interface CompanyBusinessInfo {
  companyName: string;
  taxId: string;
  primaryContact: string;
  email: string;
  registeredAddress: string;
}

// Company accounts are invoiced (net-terms billing), unlike individual
// accounts, which pay as you go via PaymentMethodsPage — this is why
// there's a dedicated Billing Configuration modal only on the company
// dashboard, not on the individual profile.
export interface CompanyBillingConfig {
  billingMethod: string;
  paymentTerms: PaymentTerms;
  invoiceFrequency: string;
  billingContactName: string;
  email: string;
  phone: string;
  taxId: string;
  taxExempt: boolean;
  nextInvoiceDate: string;
}

export interface CompanyActivityItem {
  title: string;
  subtitle: string;
  time: string;
}

export interface CompanyOverview {
  activeDeliveries: number;
  pendingDeliveries: number;
  businessInfo: CompanyBusinessInfo;
  billingConfig: CompanyBillingConfig;
  recentActivity: CompanyActivityItem[];
}

// TODO: replace with GET /customers/:id/overview once the Customer
// Management API exists. Only KR-77410-JW (Acme Refinery) is hand-authored
// to match the Figma reference — every other company customer falls back to
// the generic shape in getCompanyOverview() below.
const companyOverviews: Record<string, CompanyOverview> = {
  "KR-77410-JW": {
    activeDeliveries: 1,
    pendingDeliveries: 41,
    businessInfo: {
      companyName: "Global Logistics Group Inc.",
      taxId: "US-449200-X1",
      primaryContact: "Sarah Jenkins (Fleet Director)",
      email: "s.jenkins@globallogistics.com",
      registeredAddress: "882 Executive Plaza, Suite 400, Chicago, IL 60601",
    },
    billingConfig: {
      billingMethod: "Monthly Invoice",
      paymentTerms: "net-30",
      invoiceFrequency: "Monthly",
      billingContactName: "Sarah Jenkins",
      email: "billing@logistics-co.com",
      phone: "(555) 123-4567",
      taxId: "12-3456789",
      taxExempt: false,
      nextInvoiceDate: "Nov 01, 2023",
    },
    recentActivity: [
      {
        title: "Compliance Team approved verification documents.",
        subtitle: "Entity verification completed for GLC - Sector A.",
        time: "2h ago",
      },
      {
        title: "Order #ORD-99021 has departed Los Angeles.",
        subtitle: "Vehicle VK-201-B. Driver: Mark J.",
        time: "5h ago",
      },
      {
        title: "New Authorized User was added by Admin.",
        subtitle: "User: Sarah Thompson (Operations Lead)",
        time: "Yesterday",
      },
    ],
  },
};

export function getCompanyOverview(detail: CustomerDetail): CompanyOverview {
  return (
    companyOverviews[detail.id] ?? {
      activeDeliveries: 0,
      pendingDeliveries: 0,
      businessInfo: {
        companyName: detail.name,
        taxId: "—",
        primaryContact: "—",
        email: detail.email,
        registeredAddress: "—",
      },
      billingConfig: {
        billingMethod: "Monthly Invoice",
        paymentTerms: "net-30",
        invoiceFrequency: "Monthly",
        billingContactName: detail.name,
        email: detail.email,
        phone: detail.phone,
        taxId: "—",
        taxExempt: false,
        nextInvoiceDate: "—",
      },
      recentActivity: [],
    }
  );
}
