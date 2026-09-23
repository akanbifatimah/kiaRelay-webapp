import { CheckCircle2, AlertTriangle, Camera, MapPinned, PenLine } from "lucide-react";
import { DataTable, type Column } from "../../../components/DataTable";
import { cn } from "../../../lib/cn";
import type { EvidencePhoto, GpsPoint, SignatureLog } from "../claimInvestigation";

export type EvidenceTab = "photos" | "gps" | "signatures";

const TAB_META: Record<EvidenceTab, { icon: typeof Camera }> = {
  photos: { icon: Camera },
  gps: { icon: MapPinned },
  signatures: { icon: PenLine },
};

interface EvidenceTabsProps {
  value: EvidenceTab;
  labels: Record<EvidenceTab, string>;
  onChange: (tab: EvidenceTab) => void;
}

export function EvidenceTabs({ value, labels, onChange }: EvidenceTabsProps) {
  return (
    <div role="tablist" className="flex gap-5 overflow-x-auto border-b border-border">
      {(Object.keys(TAB_META) as EvidenceTab[]).map((tab) => {
        const Icon = TAB_META[tab].icon;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={tab === value}
            onClick={() => onChange(tab)}
            className={cn(
              "-mb-px flex items-center gap-1.5 whitespace-nowrap border-b-2 pb-2.5 text-sm font-medium",
              tab === value ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text",
            )}
          >
            <Icon className="h-4 w-4" />
            {labels[tab]}
          </button>
        );
      })}
    </div>
  );
}

const coord = (value: number, pos: string, neg: string) => `${Math.abs(value).toFixed(4)}° ${value >= 0 ? pos : neg}`;
const formatLatLng = (lat: number, lng: number) => `Latitude: ${coord(lat, "N", "S")}, Longitude: ${coord(lng, "E", "W")}`;

interface EvidencePhotosProps {
  photos: EvidencePhoto[];
  /** "card" = claim page (caption under each photo, click to enlarge);
   * "viewer" = Evidence Viewer (bigger, coordinates overlaid on the image). */
  variant: "card" | "viewer";
  onOpen?: () => void;
}

function Empty({ children }: { children: string }) {
  return <p className="rounded-lg bg-bg py-8 text-center text-sm text-text-muted">{children}</p>;
}

export function EvidencePhotos({ photos, variant, onOpen }: EvidencePhotosProps) {
  if (photos.length === 0) return <Empty>No pickup/delivery photos are attached to this claim.</Empty>;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {photos.map((photo) => {
        const isDelivery = photo.kind === "delivery";
        const label = isDelivery ? "Delivery Documentation" : "Pickup Documentation";
        return (
          <figure key={photo.kind} className="flex flex-col gap-2">
            <figcaption className="flex items-center justify-between gap-2 text-xs">
              <span className={cn("flex items-center gap-1.5 font-semibold", variant === "card" && "uppercase", isDelivery ? "text-danger" : "text-text")}>
                {variant === "viewer" && <span className={cn("h-1.5 w-1.5 rounded-full", isDelivery ? "bg-danger" : "bg-info")} />}
                {label}
              </span>
              <span className="text-text-muted">{photo.timestamp}</span>
            </figcaption>
            <button
              type="button"
              onClick={onOpen}
              disabled={!onOpen}
              aria-label={onOpen ? `Open ${label} in evidence viewer` : undefined}
              className="relative overflow-hidden rounded-lg border border-border bg-bg disabled:cursor-default"
            >
              <img src={photo.src} alt={label} className={cn("w-full object-cover", variant === "viewer" ? "aspect-[4/3]" : "aspect-video")} />
              {variant === "viewer" && (
                <span className="absolute bottom-3 left-3 rounded bg-surface/95 px-2 py-1 text-xs font-medium text-text shadow">
                  {formatLatLng(photo.lat, photo.lng)}
                </span>
              )}
            </button>
            {variant === "card" && <p className="text-xs text-text-muted">{photo.caption}</p>}
          </figure>
        );
      })}
    </div>
  );
}

const gpsColumns: Column<GpsPoint>[] = [
  { header: "Point", accessor: (row) => <span className="font-medium">{row.label}</span> },
  { header: "Time", accessor: (row) => <span className="whitespace-nowrap text-text-muted">{row.time}</span> },
  { header: "Coordinates", accessor: (row) => <span className="whitespace-nowrap font-mono text-xs">{row.lat.toFixed(4)}, {row.lng.toFixed(4)}</span> },
  { header: "Note", accessor: (row) => <span className="text-text-muted">{row.note}</span> },
];

export function EvidenceGpsTable({ points }: { points: GpsPoint[] }) {
  if (points.length === 0) return <Empty>No GPS telemetry is attached to this claim.</Empty>;
  return <DataTable columns={gpsColumns} rows={points} rowKey={(row) => row.label} />;
}

export function EvidenceSignatureLog({ signatures }: { signatures: SignatureLog[] }) {
  if (signatures.length === 0) return <Empty>No signature records are attached to this claim.</Empty>;
  return (
    <ul className="flex flex-col divide-y divide-border">
      {signatures.map((entry) => (
        <li key={`${entry.signer}-${entry.time}`} className="flex items-start gap-3 py-3">
          {entry.status === "verified" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          ) : (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-text">
              {entry.signer} <span className="font-normal text-text-muted">• {entry.role}</span>
            </p>
            <p className="text-xs text-text-muted">{entry.method}</p>
            <p className="mt-1 text-sm text-text">{entry.note}</p>
          </div>
          <span className="whitespace-nowrap text-xs text-text-muted">{entry.time}</span>
        </li>
      ))}
    </ul>
  );
}
