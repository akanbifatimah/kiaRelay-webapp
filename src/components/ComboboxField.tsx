import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Controller, type Control, type FieldValues, type Path, type RegisterOptions } from "react-hook-form";
import { ChevronDown, Loader2 } from "lucide-react";
import { cn } from "../lib/cn";

interface ComboboxFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  options: string[];
  rules?: RegisterOptions<T, Path<T>>;
  disabled?: boolean;
  loading?: boolean;
  /** Called after a pick, e.g. to reset the dependent City/ZIP fields. */
  onPick?: (value: string) => void;
}

/** Longest list rendered at once; typing narrows the rest (Texas has 1,500+ cities). */
const MAX_SHOWN = 80;

function matches(options: string[], query: string): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return options;
  const starts = options.filter((o) => o.toLowerCase().startsWith(q));
  return [...starts, ...options.filter((o) => !o.toLowerCase().startsWith(q) && o.toLowerCase().includes(q))];
}

// Searchable pick-from-list field (2026-09-30), used for State / City / ZIP
// so addresses come from the US lookup instead of free typing. The value is
// only ever an option: typing filters, and leaving without picking restores
// the current value. Controller-wrapped per working rule 7.
export function ComboboxField<T extends FieldValues>({ control, name, label, placeholder, options, rules, disabled, loading, onPick }: ComboboxFieldProps<T>) {
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const filtered = useMemo(() => (query === null ? [] : matches(options, query)), [options, query]);
  const shown = filtered.slice(0, MAX_SHOWN);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const open = query !== null && !disabled;
        const pick = (value: string) => {
          field.onChange(value);
          setQuery(null);
          onPick?.(value);
        };
        const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (!open) return setQuery("");
            setActive((i) => Math.max(0, Math.min(shown.length - 1, i + (event.key === "ArrowDown" ? 1 : -1))));
          } else if (event.key === "Enter" && open) {
            event.preventDefault();
            if (shown[active]) pick(shown[active]);
          } else if (event.key === "Escape") setQuery(null);
        };
        return (
          <div className="relative flex flex-col gap-1 text-sm">
            <label htmlFor={`${listId}-input`} className="text-text-muted">{label}</label>
            {/* The whole box behaves like a dropdown (2026-09-30 fix): a click
                anywhere opens it, and the chevron toggles it. Before, only a
                fresh focus on the text opened the list. */}
            <div
              onMouseDown={(event) => {
                if (disabled || event.target === inputRef.current) return;
                event.preventDefault();
                if (open) setQuery(null);
                else {
                  inputRef.current?.focus();
                  setQuery("");
                }
              }}
              className={cn(
                "flex items-center gap-2 rounded-md border border-border px-3 py-2",
                disabled ? "bg-bg" : "cursor-pointer",
                open && "border-primary",
                fieldState.error && "border-danger",
              )}
            >
              <input
                ref={inputRef}
                onClick={() => !open && setQuery("")}
                id={`${listId}-input`}
                role="combobox"
                aria-expanded={open}
                aria-controls={listId}
                aria-autocomplete="list"
                autoComplete="off"
                disabled={disabled}
                value={query ?? String(field.value ?? "")}
                placeholder={loading ? "Loading…" : open && field.value ? String(field.value) : placeholder}
                onFocus={() => setQuery("")}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                onBlur={() => {
                  setQuery(null);
                  field.onBlur();
                }}
                className="w-full min-w-0 cursor-[inherit] bg-transparent text-text placeholder:text-text-muted focus:cursor-text focus:outline-none disabled:text-text-muted"
              />
              {loading ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-text-muted" />
              ) : (
                <ChevronDown className={cn("h-4 w-4 shrink-0 text-text-muted transition-transform", open && "rotate-180")} />
              )}
            </div>
            {open && (
              <ul id={listId} role="listbox" className="absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-y-auto rounded-lg border border-border bg-surface p-1 shadow-lg">
                {shown.length === 0 && <li className="px-3 py-2 text-text-muted">No matches.</li>}
                {shown.map((option, i) => (
                  <li
                    key={option}
                    role="option"
                    aria-selected={option === field.value}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => pick(option)}
                    className={cn("cursor-pointer rounded-md px-3 py-2 text-text", i === active && "bg-bg", option === field.value && "font-semibold text-primary")}
                  >
                    {option}
                  </li>
                ))}
                {filtered.length > MAX_SHOWN && <li className="px-3 py-2 text-xs text-text-muted">Keep typing to narrow {filtered.length.toLocaleString()} matches…</li>}
              </ul>
            )}
            {fieldState.error && <span className="text-xs text-danger">{fieldState.error.message}</span>}
          </div>
        );
      }}
    />
  );
}
