import { findMemberByEmail } from "../access/teamMembers";

const SESSION_KEY = "kiarelay_session_email";

// TODO: replace with real session/JWT handling once auth (ADM-AUTH) has a
// backend. Client-only mock: the session is just the signed-in admin's
// email in localStorage, resolved against the team list (features/access)
// on every check, so deactivating someone ends their access on next load.
export function getSessionEmail(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  const email = getSessionEmail();
  return Boolean(email && findMemberByEmail(email)?.active);
}

export function login(email: string): void {
  localStorage.setItem(SESSION_KEY, email.trim().toLowerCase());
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}
