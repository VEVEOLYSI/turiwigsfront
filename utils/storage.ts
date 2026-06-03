// Safe localStorage wrapper — SSR-safe (Next.js runs server-side)
const isClient = typeof window !== 'undefined';

export const storage = {
  get<T>(key: string): T | null {
    if (!isClient) return null;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    if (!isClient) return;
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove(key: string): void {
    if (!isClient) return;
    localStorage.removeItem(key);
  },

  clear(): void {
    if (!isClient) return;
    localStorage.clear();
  },
};

export const AUTH_TOKEN_KEY = 'wigs_access_token';
export const AUTH_REFRESH_KEY = 'wigs_refresh_token';
export const GUEST_CART_KEY = 'wigs_guest_cart';
