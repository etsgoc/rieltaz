import type { KV } from '@core';

export const store: KV = {
  get: async k => { try { return localStorage.getItem(k); } catch { return null; } },
  set: async (k, v) => { try { localStorage.setItem(k, v); } catch { /* storage full or blocked */ } },
};
