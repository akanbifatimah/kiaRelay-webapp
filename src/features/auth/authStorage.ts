const SESSION_KEY = "kiarelay_session";

// TODO: replace with real session/JWT handling once auth (ADM-AUTH) has a
// backend. This is a client-only mock (localStorage flag) so the login
// screen and route guard have something real to do in the meantime.
export function isAuthenticated(): boolean {
  return localStorage.getItem(SESSION_KEY) === "true";
}

export function login(): void {
  localStorage.setItem(SESSION_KEY, "true");
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}
