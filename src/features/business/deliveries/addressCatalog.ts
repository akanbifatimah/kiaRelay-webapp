import type { StopAddress } from "./deliveryTypes";
import { ACME_DESTINATIONS, ACME_SITES, PERSONAL_DESTINATIONS, PERSONAL_PLACES } from "./seedCatalog";

// Searchable facilities/addresses for "Search address or facility…"
// (2026-09-30), same as the customer app's src/mocks/addressCatalog.ts. Picking one fills a complete, structured address.
// TODO: replace with a places/geocoding API (Google Places Autocomplete).
const PUBLIC_FACILITIES: StopAddress[] = [
  { name: "Port of Houston, Bayport Terminal", street: "12619 Port Rd", city: "Pasadena", state: "Texas", zip: "77507" },
  { name: "Houston Distribution Center Alpha", street: "8842 Industrial Blvd", city: "Houston", state: "Texas", zip: "77029" },
  { name: "Dallas Intermodal Terminal", street: "4300 Logistics Dr", city: "Dallas", state: "Texas", zip: "75241" },
  { name: "San Antonio Freight Depot", street: "2210 Rigsby Ave", city: "San Antonio", state: "Texas", zip: "78210" },
  { name: "Port of New Orleans, Napoleon Ave", street: "1350 Port of New Orleans Pl", city: "New Orleans", state: "Louisiana", zip: "70130" },
  { name: "Shreveport Regional Warehouse", street: "7400 Industrial Loop", city: "Shreveport", state: "Louisiana", zip: "71106" },
];

export const ADDRESS_CATALOG: StopAddress[] = [...ACME_SITES, ...ACME_DESTINATIONS, ...PERSONAL_PLACES, ...PERSONAL_DESTINATIONS, ...PUBLIC_FACILITIES];

/** Name/street/city matches, name matches first. */
export function searchAddresses(query: string, extra: StopAddress[] = []): StopAddress[] {
  const q = query.trim().toLowerCase();
  const all = [...extra, ...ADDRESS_CATALOG].filter((a, i, list) => list.findIndex((b) => b.street === a.street && b.zip === a.zip) === i);
  if (!q) return all.slice(0, 12);
  const hay = (a: StopAddress) => `${a.name} ${a.street} ${a.city} ${a.state} ${a.zip}`.toLowerCase();
  const byName = all.filter((a) => a.name.toLowerCase().includes(q));
  return [...byName, ...all.filter((a) => !byName.includes(a) && hay(a).includes(q))].slice(0, 20);
}
