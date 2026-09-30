import type { LatLng } from "../../../types/geo";
import { hashSeed } from "../../../lib/seededRandom";
import type { StopAddress } from "./deliveryTypes";

// Map coordinates for delivery stops (2026-09-30). The US lookup has no
// coordinates, so the cities the demo data uses are listed here and anything
// else lands near its state's anchor city, offset per street so pins differ.
// TODO: geocode server-side (Google Geocoding) and store lat/lng on the stop.
const CITIES: Record<string, LatLng> = {
  "Houston|Texas": { lat: 29.7604, lng: -95.3698 },
  "Baytown|Texas": { lat: 29.7355, lng: -94.9774 },
  "Beaumont|Texas": { lat: 30.0802, lng: -94.1266 },
  "La Porte|Texas": { lat: 29.6658, lng: -95.0194 },
  "Pasadena|Texas": { lat: 29.6911, lng: -95.2091 },
  "Port Arthur|Texas": { lat: 29.885, lng: -93.9399 },
  "Corpus Christi|Texas": { lat: 27.8006, lng: -97.3964 },
  "Midland|Texas": { lat: 31.9973, lng: -102.0779 },
  "Galveston|Texas": { lat: 29.3013, lng: -94.7977 },
  "Austin|Texas": { lat: 30.2672, lng: -97.7431 },
  "Dallas|Texas": { lat: 32.7767, lng: -96.797 },
  "San Antonio|Texas": { lat: 29.4241, lng: -98.4936 },
  "Lake Charles|Louisiana": { lat: 30.2266, lng: -93.2174 },
  "Baton Rouge|Louisiana": { lat: 30.4515, lng: -91.1871 },
  "New Orleans|Louisiana": { lat: 29.9511, lng: -90.0715 },
  "Shreveport|Louisiana": { lat: 32.5252, lng: -93.7502 },
  "Mobile|Alabama": { lat: 30.6954, lng: -88.0399 },
};

const STATE_ANCHORS: Record<string, LatLng> = {
  Texas: CITIES["Houston|Texas"],
  Louisiana: CITIES["Baton Rouge|Louisiana"],
  Alabama: CITIES["Mobile|Alabama"],
};

export function stopCoords(address: StopAddress): LatLng {
  const known = CITIES[`${address.city}|${address.state}`];
  const base = known ?? STATE_ANCHORS[address.state] ?? CITIES["Houston|Texas"];
  const seed = hashSeed(`${address.street}${address.zip}`);
  const spread = known ? 0.02 : 0.25;
  return { lat: base.lat + ((seed % 100) / 100 - 0.5) * spread, lng: base.lng + (((seed >> 7) % 100) / 100 - 0.5) * spread };
}

/** A point `progress` (0–1) of the way along the straight pickup→drop-off line. */
export const along = (from: LatLng, to: LatLng, progress: number): LatLng => ({ lat: from.lat + (to.lat - from.lat) * progress, lng: from.lng + (to.lng - from.lng) * progress });
