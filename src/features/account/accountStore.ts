import { createPersistentStore } from "../../lib/createPersistentStore";
import { useStore } from "../../lib/createStore";
import { defaultPrefs, type NotificationPrefs } from "./notificationCatalog";

export interface AdminSession {
  id: string;
  device: string;
  location: string;
  /** ISO timestamp. */
  lastSeen: string;
  current: boolean;
}

/** "Chrome on Windows" etc. from the real user agent, for the current session row. */
function describeThisDevice(): string {
  const ua = typeof navigator === "undefined" ? "" : navigator.userAgent;
  const browser = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Browser";
  const os = /Windows/.test(ua) ? "Windows" : /Mac OS X/.test(ua) ? "macOS" : /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iOS" : /Linux/.test(ua) ? "Linux" : "Unknown OS";
  return `${browser} on ${os}`;
}

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3_600_000).toISOString();

// First visit seeds this device plus two other sign-ins so "sign out other
// sessions" has something real to act on.
// TODO: replace with GET/DELETE /auth/sessions once auth has a backend.
function seedSessions(): AdminSession[] {
  return [
    { id: "ses-current", device: describeThisDevice(), location: "Houston, TX", lastSeen: new Date().toISOString(), current: true },
    { id: "ses-mobile", device: "Safari on iOS", location: "Houston, TX", lastSeen: hoursAgo(5), current: false },
    { id: "ses-office", device: "Edge on Windows", location: "Dallas, TX", lastSeen: hoursAgo(49), current: false },
  ];
}

const prefsStore = createPersistentStore<Record<string, NotificationPrefs>>("kiarelay_notification_prefs_v1", {});
const sessionsStore = createPersistentStore<Record<string, AdminSession[]>>("kiarelay_sessions_v1", {});

export function useNotificationPrefs(userId: string): NotificationPrefs {
  const all = useStore(prefsStore);
  return { ...defaultPrefs(), ...all[userId] };
}

export function saveNotificationPrefs(userId: string, prefs: NotificationPrefs): void {
  prefsStore.set((prev) => ({ ...prev, [userId]: prefs }));
}

export function useSessions(userId: string): AdminSession[] {
  return useStore(sessionsStore)[userId] ?? seedSessions();
}

export function revokeSessions(userId: string, ids: string[]): void {
  sessionsStore.set((prev) => ({ ...prev, [userId]: (prev[userId] ?? seedSessions()).filter((session) => session.current || !ids.includes(session.id)) }));
}
