import { createStore, type Store } from "./createStore";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// createStore + localStorage (2026-09-23, user-approved) for the mock data
// that has to survive a reload for the app to make sense: who is on the
// admin team and what they may access, company settings, and the audit log.
// Everything else stays session-only (createStore). Bump the key's version
// suffix when a stored shape changes so stale data is ignored, not misread.
// TODO: once the backend exists these become caches over real endpoints and
// this persistence goes away.
export function createPersistentStore<T>(key: string, initial: T): Store<T> & { reset: () => void } {
  const store = createStore<T>(read(key, initial));
  store.subscribe(() => {
    try {
      localStorage.setItem(key, JSON.stringify(store.get()));
    } catch {
      // Storage full/blocked — the change still applies for this session.
    }
  });
  return {
    ...store,
    reset: () => store.set(initial),
  };
}
