import type { LatLng } from "../../types/geo";

export type RegionState = "TX" | "LA" | "OK";

export const STATE_LABELS: Record<RegionState, string> = { TX: "Texas", LA: "Louisiana", OK: "Oklahoma" };

export interface Region {
  id: string;
  name: string;
  state: RegionState;
  center: LatLng;
  /** Service-area radius drawn on the map, in metres. */
  radius: number;
  onTimeRate: number;
  /** 30-day completed deliveries. */
  deliveries: number;
}

// Operating regions for the Reports hub map and the driver leaderboard's
// zone filter (2026-09-23). Real city coordinates; the design shows Texas,
// so it's the default state, with the Gulf-adjacent LA/OK markets alongside.
// TODO: replace with GET /reports/regions (live OTD per service area) once
// the Reporting API exists.
export const REGIONS: Region[] = [
  { id: "houston", name: "Houston Metro", state: "TX", center: { lat: 29.7604, lng: -95.3698 }, radius: 42_000, onTimeRate: 96.1, deliveries: 4_820 },
  { id: "dfw", name: "Dallas-Fort Worth", state: "TX", center: { lat: 32.7767, lng: -96.797 }, radius: 48_000, onTimeRate: 97.3, deliveries: 4_110 },
  { id: "austin", name: "Austin", state: "TX", center: { lat: 30.2672, lng: -97.7431 }, radius: 30_000, onTimeRate: 95.2, deliveries: 1_960 },
  { id: "san-antonio", name: "San Antonio", state: "TX", center: { lat: 29.4241, lng: -98.4936 }, radius: 34_000, onTimeRate: 92.4, deliveries: 2_240 },
  { id: "golden-triangle", name: "Beaumont / Port Arthur", state: "TX", center: { lat: 29.9, lng: -93.93 }, radius: 28_000, onTimeRate: 88.7, deliveries: 1_380 },
  { id: "corpus", name: "Corpus Christi", state: "TX", center: { lat: 27.8006, lng: -97.3964 }, radius: 26_000, onTimeRate: 83.9, deliveries: 920 },
  { id: "el-paso", name: "El Paso", state: "TX", center: { lat: 31.7619, lng: -106.485 }, radius: 26_000, onTimeRate: 90.5, deliveries: 640 },
  { id: "baton-rouge", name: "Baton Rouge", state: "LA", center: { lat: 30.4515, lng: -91.1871 }, radius: 28_000, onTimeRate: 94.0, deliveries: 1_150 },
  { id: "lake-charles", name: "Lake Charles", state: "LA", center: { lat: 30.2266, lng: -93.2174 }, radius: 22_000, onTimeRate: 89.1, deliveries: 710 },
  { id: "new-orleans", name: "New Orleans", state: "LA", center: { lat: 29.9511, lng: -90.0715 }, radius: 30_000, onTimeRate: 91.8, deliveries: 1_430 },
  { id: "okc", name: "Oklahoma City", state: "OK", center: { lat: 35.4676, lng: -97.5164 }, radius: 30_000, onTimeRate: 95.6, deliveries: 1_020 },
  { id: "tulsa", name: "Tulsa", state: "OK", center: { lat: 36.154, lng: -95.9928 }, radius: 26_000, onTimeRate: 87.2, deliveries: 780 },
];

export type OtdBand = "peak" | "target" | "warning";

/** Map legend bands: ≥95% Peak, 90–95% Target, below 90% Warning. */
export function otdBand(rate: number): OtdBand {
  if (rate >= 95) return "peak";
  if (rate >= 90) return "target";
  return "warning";
}

export const OTD_BAND_META: Record<OtdBand, { label: string; token: "--color-success" | "--color-warning" | "--color-danger"; swatch: string; text: string }> = {
  peak: { label: "≥95% Peak", token: "--color-success", swatch: "bg-success", text: "text-success" },
  target: { label: "90–95% Target", token: "--color-warning", swatch: "bg-warning", text: "text-warning" },
  warning: { label: "<90% Warning", token: "--color-danger", swatch: "bg-danger", text: "text-danger" },
};

export const regionById = (id: string): Region | undefined => REGIONS.find((region) => region.id === id);
