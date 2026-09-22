import { AuthSession } from "./types";

export const SESSION_STORAGE_KEY = "voiceshield_prototype_session";

export function loadSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw) as AuthSession;
    if (!session || !session.user || !session.token) {
      clearSession();
      return null;
    }

    // Optional expiration check (e.g. 24h validity for demonstration)
    if (session.expiresAt && new Date(session.expiresAt).getTime() < Date.now()) {
      clearSession();
      return null;
    }

    return session;
  } catch {
    clearSession();
    return null;
  }
}

export function saveSession(session: AuthSession): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    console.error("Failed to save prototype auth session to localStorage:", err);
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear prototype auth session from localStorage:", err);
  }
}
