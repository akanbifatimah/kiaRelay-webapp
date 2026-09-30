import { useMemo, useRef, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { cn } from "../../../../lib/cn";
import { searchAddresses } from "../../deliveries/addressCatalog";
import { cityLine } from "../../deliveries/display";
import type { StopAddress } from "../../deliveries/deliveryTypes";

interface AddressSearchProps {
  label: string;
  value: StopAddress;
  /** Saved + recent places, listed first. */
  places: StopAddress[];
  onPick: (address: StopAddress) => void;
  error?: string;
}

// "Search address or facility…" (2026-09-30): a combobox over the facility
// catalog and the company's saved/recent places. Picking fills a complete
// address; free text never becomes an address (State → City → ZIP rule).
// TODO: Google Places Autocomplete once the backend proxies it.
export function AddressSearch({ label, value, places, onPick, error }: AddressSearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const results = useMemo(() => searchAddresses(query, places), [query, places]);
  const picked = value.street ? `${value.name ? `${value.name} — ` : ""}${value.street}, ${cityLine(value)}` : "";

  return (
    <div className="relative flex flex-col gap-1 text-sm">
      <span className="text-text-muted">{label}</span>
      <div className={cn("flex items-center gap-2 rounded-md border bg-bg px-3 py-2", error ? "border-danger" : "border-border")}>
        <Search className="h-4 w-4 shrink-0 text-text-muted" />
        <input
          role="combobox"
          aria-expanded={open}
          aria-label={label}
          value={open ? query : picked}
          placeholder="Search address or facility..."
          onFocus={() => setOpen(true)}
          onBlur={() => (blurTimer.current = setTimeout(() => setOpen(false), 150))}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full min-w-0 bg-transparent text-text placeholder:text-text-muted focus:outline-none"
        />
      </div>
      {error && <span className="text-xs text-danger">{error}</span>}
      {open && (
        <ul role="listbox" className="absolute top-full z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-md border border-border bg-surface py-1 shadow-lg">
          {results.length === 0 && <li className="px-3 py-3 text-text-muted">No matches. Try a city, street or facility.</li>}
          {results.map((address) => (
            <li key={`${address.street}-${address.zip}`}>
              <button
                type="button"
                role="option"
                aria-selected={address.street === value.street && address.zip === value.zip}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  clearTimeout(blurTimer.current);
                  onPick(address);
                  setQuery("");
                  setOpen(false);
                }}
                className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-bg"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />
                <span>
                  <span className="block font-medium text-text">{address.name || address.street}</span>
                  <span className="block text-xs text-text-muted">
                    {address.street} · {cityLine(address)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
