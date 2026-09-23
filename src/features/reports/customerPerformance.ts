import { customers } from "../customers/data";
import { hashSeed, seededRandom } from "../../lib/seededRandom";
import type { RangeBounds } from "./reportRange";
import {
  AVG_ORDER_BY_INDUSTRY,
  handAuthoredAccounts,
  namePrefixes,
  nameSuffixes,
  realCompanyNames,
  type AccountSeed,
  type Industry,
} from "./customerPerformanceData";

export interface CustomerAccount extends AccountSeed {
  avgOrder: number;
  /** Customer Management id when this account exists there — scorecard links to it. */
  customerId?: string;
  accountType: "individual" | "company";
}

const TOTAL_ACCOUNTS = 342;

function buildSeeds(): AccountSeed[] {
  const next = seededRandom(5521);
  const generated: AccountSeed[] = [];
  const names = [
    ...realCompanyNames,
    ...namePrefixes.flatMap((prefix) => nameSuffixes.map(({ suffix, industry }) => ({ name: `${prefix} ${suffix}`, industry }))),
  ];
  const handIds = new Set(handAuthoredAccounts.map((account) => account.id));
  for (let i = 0; generated.length < TOTAL_ACCOUNTS - handAuthoredAccounts.length && i < names.length; i += 1) {
    const { name, industry } = names[i];
    const id = `#ACT-${String(1000 + ((i * 7919) % 8999)).padStart(4, "0")}`;
    if (handIds.has(id)) continue;
    // Long tail: most accounts order a handful of times a month, a few are
    // mid-size — sized so the whole cohort lands near the design's ~$1.84M
    // (and the revenue ledger's 30-day gross), with the 8 named accounts on top.
    const orders = Math.max(1, Math.round(Math.pow(next(), 2.4) * 18));
    const avg = AVG_ORDER_BY_INDUSTRY[industry] * (0.85 + next() * 0.3);
    generated.push({
      id,
      name,
      industry,
      orders,
      spend: Math.round(orders * avg * 100) / 100,
      otdRate: Math.round((84 + next() * 15.5) * 10) / 10,
      claimRate: Math.round(Math.pow(next(), 2) * 45) / 10,
    });
  }
  return [...handAuthoredAccounts, ...generated];
}

const accountSeeds = buildSeeds();

// Range scaling: seeds are 30-day figures; other ranges scale volume by
// length with a stable per-account wobble so rankings shift a little between
// ranges instead of every figure being an exact multiple.
// TODO: replace with GET /reports/customers?from&to once the Reporting API
// exists — accounts, tiles and cohort totals all derive from this result.
export function accountsForRange(bounds: RangeBounds, periodOffset = 0): CustomerAccount[] {
  return accountSeeds.map((seed) => {
    const wobble = seededRandom(hashSeed(seed.id) + bounds.days * 31 + periodOffset * 977);
    const factor = (bounds.days / 30) * (0.88 + wobble() * 0.24) * (periodOffset ? 0.93 : 1);
    const orders = Math.max(0, Math.round(seed.orders * factor));
    const avgOrder = seed.orders === 0 ? 0 : seed.spend / seed.orders;
    const drift = (wobble() - 0.5) * (bounds.days < 30 ? 2.4 : 1);
    const match = customers.find((customer) => customer.name === seed.name);
    return {
      ...seed,
      orders,
      spend: Math.round(orders * avgOrder * 100) / 100,
      avgOrder,
      otdRate: Math.min(100, Math.round((seed.otdRate + drift) * 10) / 10),
      claimRate: Math.max(0, Math.round((seed.claimRate + (periodOffset ? 0.3 : 0) + drift / 4) * 100) / 100),
      customerId: match?.id,
      accountType: seed.industry === "individual" ? "individual" : "company",
    };
  });
}

export interface CohortSummary {
  accounts: number;
  orders: number;
  spend: number;
  avgOrder: number;
  otdRate: number;
  claimRate: number;
}

/** Order-weighted rates — a 1,400-order account counts more than a 4-order one. */
export function summarizeCohort(accounts: CustomerAccount[]): CohortSummary {
  const orders = accounts.reduce((sum, a) => sum + a.orders, 0);
  const spend = accounts.reduce((sum, a) => sum + a.spend, 0);
  const weighted = (pick: (a: CustomerAccount) => number) => (orders === 0 ? 0 : accounts.reduce((sum, a) => sum + pick(a) * a.orders, 0) / orders);
  return {
    accounts: accounts.length,
    orders,
    spend,
    avgOrder: orders === 0 ? 0 : spend / orders,
    otdRate: weighted((a) => a.otdRate),
    claimRate: weighted((a) => a.claimRate),
  };
}

export interface ScorecardMonth {
  label: string;
  orders: number;
  spend: number;
  otdRate: number;
}

/** Six trailing months for one account's scorecard, anchored on its 30-day figures. */
export function accountMonthlyHistory(account: CustomerAccount): ScorecardMonth[] {
  const next = seededRandom(hashSeed(account.id) + 42);
  const base = accountSeeds.find((seed) => seed.id === account.id) ?? account;
  return Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i), 1);
    const orders = Math.round(base.orders * (0.78 + i * 0.04 + next() * 0.14));
    return {
      label: date.toLocaleDateString("en-US", { month: "short" }),
      orders,
      spend: Math.round(orders * (base.spend / Math.max(1, base.orders))),
      otdRate: Math.min(100, Math.round((base.otdRate + (next() - 0.5) * 5) * 10) / 10),
    };
  });
}

export type { Industry };
