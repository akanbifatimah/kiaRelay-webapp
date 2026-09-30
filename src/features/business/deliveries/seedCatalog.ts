import type { HandlingFlag, LoadDetails, Provision, StopAddress } from "./deliveryTypes";

// Places and loads the seeded order histories draw from (2026-09-30), same
// as the customer app's src/mocks/seedCatalog.ts. Cities and ZIPs exist in the
// US lookup, so a seeded address can be re-picked in the booking form.
// TODO: remove with the mock data.

export const ACME_SITES: StopAddress[] = [
  { name: "Acme Refinery — Houston HQ", street: "800 Main St, Suite 400", city: "Houston", state: "Texas", zip: "77002" },
  { name: "Acme Baytown Terminal", street: "5000 Bayway Dr", city: "Baytown", state: "Texas", zip: "77520" },
  { name: "Acme Beaumont Works", street: "1795 Burt St", city: "Beaumont", state: "Texas", zip: "77701" },
];

export const ACME_DESTINATIONS: StopAddress[] = [
  { name: "Port of Houston, Barbours Cut", street: "1515 E Barbours Cut Blvd", city: "La Porte", state: "Texas", zip: "77571" },
  { name: "Lake Charles Chemical Complex", street: "4000 Sale Rd", city: "Lake Charles", state: "Louisiana", zip: "70605" },
  { name: "Baton Rouge Distribution Center", street: "8900 Airline Hwy", city: "Baton Rouge", state: "Louisiana", zip: "70815" },
  { name: "Corpus Christi Terminal", street: "1702 N Port Ave", city: "Corpus Christi", state: "Texas", zip: "78401" },
  { name: "Midland Field Office", street: "300 N Marienfeld St", city: "Midland", state: "Texas", zip: "79701" },
  { name: "Port Arthur Marine Terminal", street: "2500 Gulfway Dr", city: "Port Arthur", state: "Texas", zip: "77640" },
];

export const PERSONAL_PLACES: StopAddress[] = [
  { name: "Home", street: "2415 Westheimer Rd, Apt 12", city: "Houston", state: "Texas", zip: "77098" },
  { name: "Storage Unit", street: "4521 Industrial Blvd", city: "Houston", state: "Texas", zip: "77020" },
];

export const PERSONAL_DESTINATIONS: StopAddress[] = [
  { name: "Downtown Office", street: "1200 Smith St, Floor 8", city: "Houston", state: "Texas", zip: "77002" },
  { name: "Mom's House", street: "1807 Heights Blvd", city: "Houston", state: "Texas", zip: "77008" },
  { name: "Galveston Beach House", street: "3102 Seawall Blvd", city: "Galveston", state: "Texas", zip: "77550" },
  { name: "Austin Apartment", street: "700 W 6th St, Unit 5", city: "Austin", state: "Texas", zip: "78701" },
];

/** Receiving contacts: [first, last, title, phone]. */
export const CONTACTS: [string, string, string, string][] = [
  ["Johnathan", "Smith", "Receiving Mgr.", "+1 (713) 555-0142"],
  ["Tanya", "Brooks", "Dock Supervisor", "+1 (337) 555-0118"],
  ["Luis", "Ortega", "Warehouse Lead", "+1 (225) 555-0190"],
  ["Grace", "Liu", "Site Coordinator", "+1 (361) 555-0175"],
];

export interface LoadTemplate {
  load: LoadDetails;
  handling: HandlingFlag[];
  pickupProvisions: Provision[];
  dropoffProvisions: Provision[];
}

const solid = (description: string, category: string, packaging: string, [l, w, h]: number[], weightLbs: number, quantity: number): LoadDetails => ({
  description, category, categoryOther: "", packaging, packagingOther: "", measurement: "Solid/Dry",
  lengthIn: l, widthIn: w, heightIn: h, volume: 0, volumeUnit: "gal", weightLbs, quantity,
});

const liquid = (description: string, category: string, volume: number, weightLbs: number, quantity: number): LoadDetails => ({
  description, category, categoryOther: "", packaging: "Drum", packagingOther: "", measurement: "Liquid",
  lengthIn: 0, widthIn: 0, heightIn: 0, volume, volumeUnit: "gal", weightLbs, quantity,
});

export const BUSINESS_LOADS: LoadTemplate[] = [
  { load: liquid("Industrial solvents", "Hazardous Materials", 55, 480, 8), handling: ["HazMat", "Keep Upright"], pickupProvisions: ["Forklift"], dropoffProvisions: ["Forklift"] },
  { load: solid("Valve assemblies", "Industrial Equipment", "Crate", [48, 40, 36], 1250, 2), handling: ["Fragile"], pickupProvisions: ["Dock Leveler"], dropoffProvisions: ["Dock Leveler"] },
  { load: solid("Catalyst pellets", "Chemicals", "Tote / IBC", [48, 40, 46], 2200, 4), handling: ["HazMat"], pickupProvisions: ["Forklift"], dropoffProvisions: [] },
  { load: solid("Pipe fittings", "Construction Materials", "Pallets", [48, 40, 30], 900, 3), handling: [], pickupProvisions: ["Dock Leveler"], dropoffProvisions: ["Forklift"] },
  { load: liquid("Lubricant oil", "Chemicals", 55, 475, 4), handling: ["Keep Upright"], pickupProvisions: ["Forklift"], dropoffProvisions: [] },
];

export const PERSONAL_LOADS: LoadTemplate[] = [
  { load: solid("Moving boxes", "Household Goods", "Boxes", [30, 20, 20], 40, 3), handling: [], pickupProvisions: [], dropoffProvisions: [] },
  { load: solid("65in TV", "Electronics", "Boxes", [60, 10, 36], 55, 1), handling: ["Fragile", "Keep Upright"], pickupProvisions: [], dropoffProvisions: [] },
  { load: solid("Signed documents", "General Freight", "Envelope", [12, 9, 1], 1, 1), handling: [], pickupProvisions: [], dropoffProvisions: [] },
];
