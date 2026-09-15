interface VehicleHeroCardProps {
  assignedSince: string;
  operationalStatus: string;
}

// Plain styled div, not Card + a className override: this needs edge-to-edge
// content with no padding, and Card's p-5 isn't safely overridable since cn()
// is plain concatenation, not a Tailwind-merge (see Button's className-
// override precedent in CLAUDE.md).
export function VehicleHeroCard({ assignedSince, operationalStatus }: VehicleHeroCardProps) {
  return (
    <div className="relative h-56 overflow-hidden rounded-[var(--radius-card)] border border-border bg-sidebar shadow-sm">
      <img src="/cargobus.svg" alt="Assigned vehicle" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 bg-black/40 px-5 py-3 text-white">
        <p className="text-sm font-semibold">Primary Logistics Asset</p>
        <p className="text-xs text-white/70">
          Assigned: {assignedSince} · Status: {operationalStatus}
        </p>
      </div>
    </div>
  );
}
