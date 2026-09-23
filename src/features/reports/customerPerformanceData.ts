export type Industry = "oil-gas" | "construction" | "healthcare" | "logistics" | "manufacturing" | "individual";

export const industryLabels: Record<Industry, string> = {
  "oil-gas": "Oil & Gas",
  construction: "Construction",
  healthcare: "Healthcare",
  logistics: "Logistics",
  manufacturing: "Manufacturing",
  individual: "Individual",
};

/** 30-day baseline figures — scaled to the selected range at read time. */
export interface AccountSeed {
  id: string;
  name: string;
  industry: Industry;
  orders: number;
  spend: number;
  otdRate: number;
  claimRate: number;
}

// The eight accounts shown in the Customer Performance design (2026-09-23).
// Acme Refinery LLC is the same account as Customer Management's
// KR-77410-JW, so its scorecard links through to that profile.
export const handAuthoredAccounts: AccountSeed[] = [
  { id: "#ACT-9821", name: "Acme Refinery LLC", industry: "oil-gas", orders: 1420, spend: 418_250, otdRate: 96.8, claimRate: 0.8 },
  { id: "#ACT-8419", name: "Gulf Coast Energy Corp", industry: "oil-gas", orders: 894, spend: 291_400, otdRate: 94.2, claimRate: 1.1 },
  { id: "#ACT-7712", name: "Houston Heavy Civil Ltd", industry: "construction", orders: 620, spend: 248_800, otdRate: 88.5, claimRate: 2.9 },
  { id: "#ACT-6190", name: "Texas Medical Logistics", industry: "healthcare", orders: 540, spend: 186_300, otdRate: 98.4, claimRate: 0.4 },
  { id: "#ACT-5504", name: "Baytown Petrochemical Co", industry: "oil-gas", orders: 480, spend: 168_000, otdRate: 93.1, claimRate: 1.4 },
  { id: "#ACT-4428", name: "Coastal Concrete Inc", industry: "construction", orders: 312, spend: 112_320, otdRate: 86.2, claimRate: 4.1 },
  { id: "#ACT-3918", name: "Sarah Jenkins Direct", industry: "individual", orders: 88, spend: 21_120, otdRate: 97.0, claimRate: 0.0 },
  { id: "#ACT-2104", name: "Marcus Freight Services", industry: "logistics", orders: 214, spend: 74_900, otdRate: 91.4, claimRate: 1.8 },
];

// Name parts for the generated long tail (342 accounts in total, per the
// design's "342 Accounts" badge — 34 prefixes × 10 suffixes + 6 real names
// is enough for 334 unique generated names). A few real Customer Management
// company names are mixed in so their scorecards link through too.
export const realCompanyNames: { name: string; industry: Industry }[] = [
  { name: "Atlas Global Logistics Ltd", industry: "logistics" },
  { name: "Titan Manufacturing", industry: "manufacturing" },
  { name: "Vertex Energy", industry: "oil-gas" },
  { name: "Marathon Petroleum", industry: "oil-gas" },
  { name: "Phillips 66", industry: "oil-gas" },
  { name: "ConocoPhillips", industry: "oil-gas" },
];

export const namePrefixes = [
  "Lone Star", "Permian", "Brazos", "Trinity", "Sabine", "Galveston", "Pecos", "Red River", "Corpus", "Cypress",
  "Bluebonnet", "Pinnacle", "Summit", "Keystone", "Harbor", "Frontier", "Meridian", "Ironclad", "Sterling", "Beacon",
  "Magnolia", "Rio Grande", "Colorado", "Nueces", "Guadalupe", "Llano", "Caprock", "Big Bend", "Hill Country", "Gulfstream",
  "Westlake", "Eagle Ford", "Anahuac", "Bayou",
];

export const nameSuffixes: { suffix: string; industry: Industry }[] = [
  { suffix: "Midstream LLC", industry: "oil-gas" },
  { suffix: "Refining Co", industry: "oil-gas" },
  { suffix: "Aggregates Inc", industry: "construction" },
  { suffix: "Builders Group", industry: "construction" },
  { suffix: "Health Supply", industry: "healthcare" },
  { suffix: "Pharma Distribution", industry: "healthcare" },
  { suffix: "Freight Partners", industry: "logistics" },
  { suffix: "Fabrication Works", industry: "manufacturing" },
  { suffix: "Industrial Supply", industry: "manufacturing" },
  { suffix: "Home Deliveries", industry: "individual" },
];

/** Typical order value per industry — keeps generated spend believable. */
export const AVG_ORDER_BY_INDUSTRY: Record<Industry, number> = {
  "oil-gas": 310,
  construction: 380,
  healthcare: 345,
  logistics: 330,
  manufacturing: 290,
  individual: 240,
};
