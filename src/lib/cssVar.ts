/**
 * Resolves a theme token (e.g. "--color-primary") to its computed value, for
 * APIs that can't take `var(...)` — Google Maps polyline/marker colors are
 * the case today. Keeps those colors driven by index.css's @theme instead of
 * hardcoded hex (working rule 6).
 */
export function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
