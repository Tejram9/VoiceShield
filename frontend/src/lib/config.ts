/**
 * VoiceShield Frontend — Centralized Configuration
 *
 * Single source of truth for all backend communication URLs.
 * Consuming code must NEVER hardcode localhost:8000 or derive URLs inline.
 *
 * Environment variables:
 *   NEXT_PUBLIC_API_URL   — HTTP base URL of the FastAPI backend
 *                           Default: http://localhost:8000
 *   NEXT_PUBLIC_WS_URL    — WebSocket base URL (optional override)
 *                           If omitted, derived from NEXT_PUBLIC_API_URL by
 *                           replacing http→ws and https→wss.
 *
 * Security note:
 *   Only NEXT_PUBLIC_* variables are safe to expose to the browser.
 *   Never add NEXT_PUBLIC_*_API_KEY or any secret here.
 */

/** HTTP base URL for all REST API requests. Trailing slash is always stripped. */
export const API_BASE_URL: string = (() => {
  const raw =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:8000";
  return raw.replace(/\/$/, "");
})();

/**
 * WebSocket base URL derived from API_BASE_URL.
 * http://host  → ws://host
 * https://host → wss://host
 * Explicit NEXT_PUBLIC_WS_BASE_URL or NEXT_PUBLIC_WS_URL override is respected when provided.
 */
export const WS_BASE_URL: string = (() => {
  const explicitWs =
    process.env.NEXT_PUBLIC_WS_BASE_URL ??
    process.env.NEXT_PUBLIC_WS_URL;
  if (explicitWs) {
    return explicitWs.replace(/\/$/, "");
  }
  return API_BASE_URL.replace(/^http:/, "ws:").replace(/^https:/, "wss:");
})();

/** API versioned path prefix — matches FastAPI settings.API_V1_STR */
export const API_V1 = "/api/v1" as const;

/** Full versioned REST base (convenience) */
export const API_V1_URL = `${API_BASE_URL}${API_V1}` as const;
