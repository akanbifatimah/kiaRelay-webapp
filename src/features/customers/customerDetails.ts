import type { OrderStatus } from "../../components/StatusBadge";
import type { Customer } from "./data";
import { customerDetails } from "./customerDetailsData";

export interface RecentOrder {
  id: string;
  date: string;
  status: OrderStatus;
  amount: string;
}

export type PaymentMethodType = "card" | "bank" | "paypal";

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string;
  detail: string;
  status: "verified" | "pending" | "expired";
  isDefault?: boolean;
  // card-only
  cardholderName?: string;
  expiry?: string;
  // bank-only
  bankName?: string;
  accountType?: string;
  // paypal-only
  email?: string;
  connectedDate?: string;
}

export type PaymentTerms = "net-15" | "net-30" | "net-45" | "net-60";

export interface CreditTerms {
  creditLimit: number;
  outstandingBalance: number;
  paymentTerms: PaymentTerms;
  interestRate: number;
  accountStatus: "active" | "review-required";
}

export interface CustomerDetail {
  id: string;
  name: string;
  fullName: string;
  status: "active" | "suspended";
  accountType: "individual" | "company";
  joinedDate: string;
  totalOrders: number;
  ordersDelta: string;
  totalSpent: string;
  aov: string;
  preferredType: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  createdDate: string;
  lastActivity: string;
  phoneVerifiedDate: string;
  emailVerifiedDate: string;
  idVerifiedDate: string;
  fullyVerified: boolean;
  recentOrders: RecentOrder[];
  paymentMethods: PaymentMethod[];
  membershipTier?: string;
  creditTerms?: CreditTerms;
}

// TODO: replace with GET /customers/:id once the Customer Management API
// exists. Hand-authored records live in customerDetailsData.ts; every other
// mock customer falls back to the generic shape below.
export function getCustomerDetail(customer: Customer): CustomerDetail {
  return (
    customerDetails[customer.id] ?? {
      id: customer.id,
      name: customer.name,
      fullName: customer.name,
      status: customer.status,
      accountType: customer.accountType,
      joinedDate: "—",
      totalOrders: customer.orders,
      ordersDelta: "0%",
      totalSpent: "—",
      aov: "—",
      preferredType: "—",
      email: "—",
      emailVerified: false,
      phone: "—",
      phoneVerified: false,
      createdDate: "—",
      lastActivity: customer.lastActivity,
      phoneVerifiedDate: "—",
      emailVerifiedDate: "—",
      idVerifiedDate: "—",
      fullyVerified: customer.verification === "verified",
      recentOrders: [],
      paymentMethods: [],
    }
  );
}
