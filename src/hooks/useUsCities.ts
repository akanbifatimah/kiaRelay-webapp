import { useEffect, useState } from "react";
import { US_STATES } from "../constants/usStates";

type CityRows = [city: string, zips: string[]][];

// Per-state files (public/geo/us/<ST>.json, built by scripts/build-us-geo.mjs
// from GeoNames) are fetched on first use and kept for the session, so each
// state costs one small request (Texas is ~42KB).
const cache = new Map<string, Promise<CityRows>>();

function loadState(code: string): Promise<CityRows> {
  if (!cache.has(code)) {
    const request = fetch(`/geo/us/${code}.json`).then((res) => {
      if (!res.ok) throw new Error(`No city data for ${code}`);
      return res.json() as Promise<CityRows>;
    });
    request.catch(() => cache.delete(code));
    cache.set(code, request);
  }
  return cache.get(code)!;
}

/** Cities (with their ZIPs) for a state, by full name, e.g. "Texas". */
export function useUsCities(stateName: string) {
  const code = US_STATES.find((s) => s.name === stateName)?.code;
  const [loaded, setLoaded] = useState<{ code: string; rows: CityRows } | null>(null);
  const [failedCode, setFailedCode] = useState<string | null>(null);
  const error = Boolean(code) && failedCode === code;

  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    loadState(code).then(
      (rows) => !cancelled && setLoaded({ code, rows }),
      () => !cancelled && setFailedCode(code),
    );
    return () => {
      cancelled = true;
    };
  }, [code]);

  const rows = loaded && loaded.code === code ? loaded.rows : null;
  return { rows: rows ?? [], loading: Boolean(code) && !rows && !error, error };
}
