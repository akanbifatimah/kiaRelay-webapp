import { useSyncExternalStore } from "react";

type Updater<T> = T | ((prev: T) => T);

export interface Store<T> {
  get: () => T;
  set: (updater: Updater<T>) => void;
  subscribe: (listener: () => void) => () => void;
}

// Minimal module-level store (2026-09-23, user-approved) so mock data a user
// changes on one page — assigning a ticket, creating a claim, publishing an
// article — is still there on the next page for the rest of the session.
// Built on React's own useSyncExternalStore rather than a state library, per
// the no-new-dependencies rule. Resets on full reload, like any mock data.
// TODO: once real endpoints exist, these stores become a cache over them
// (or get replaced by a data-fetching library, if one is ever approved).
export function createStore<T>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => state,
    set: (updater) => {
      state = typeof updater === "function" ? (updater as (prev: T) => T)(state) : updater;
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.get);
}
