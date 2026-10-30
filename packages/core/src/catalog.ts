import type { Catalog, Project, Unit } from './types';

export interface KV {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
}

export const DEFAULT_SOURCES = [
  'https://raw.githubusercontent.com/etsgoc/logos/main/properties.json',
  'https://drive.google.com/uc?export=download&id=1sKusllYclSdtSt8dD2nywZHZnzwZ5y5s',
];

export interface CatalogOptions {
  sources?: string[];
  seed: Catalog;
  ttl?: number;
  timeout?: number;
}

const isCatalog = (d: any): d is Catalog =>
  d && Array.isArray(d.projects) && Array.isArray(d.units) && d.paymentPlans && d.feeSchedules;

export function normalizeCatalogSource(source: string) {
  const value = source.trim();
  const match = value.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/i);
  if (!match) return value;
  const [, owner, repo, path] = match;
  return `https://raw.githubusercontent.com/${owner}/${repo}/${path}`;
}

async function fetchJson(url: string, timeout: number) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, { headers: { accept: 'application/json' }, signal: ctrl.signal });
    if (!res.ok) return null;
    const text = await res.text();
    const data = JSON.parse(text);
    return isCatalog(data) ? { text, data } : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Order: fresh local copy, then each remote source, then the stale local copy,
 * then the catalog bundled with the app. It never fails when a seed is given.
 */
export async function loadCatalog(store: KV, { sources = [], seed, ttl = 1000 * 60 * 30, timeout = 6000 }: CatalogOptions): Promise<Catalog> {
  const cached = await store.get('catalog');
  const stamp = Number(await store.get('catalog:at')) || 0;
  const parsed = (() => { try { const x = cached ? JSON.parse(cached) : null; return isCatalog(x) && x.version >= seed.version ? x : null; } catch { return null; } })();
  if (parsed && Date.now() - stamp < ttl) return parsed;

  for (const url of sources.filter(Boolean).map(normalizeCatalogSource)) {
    const hit = await fetchJson(url, timeout);
    if (hit && hit.data.version >= seed.version) {
      await store.set('catalog', hit.text);
      await store.set('catalog:at', String(Date.now()));
      return hit.data;
    }
  }

  return parsed ?? seed;
}

export const media = (cat: Catalog, id: string | null | undefined) =>
  id && !id.startsWith('DRIVE_') ? (id.startsWith('http') ? id : cat.mediaBase + id) : '';

export const photos = (cat: Catalog, p: Project) =>
  [p.media.cover, ...p.media.gallery].map(id => media(cat, id)).filter((u, i, a) => u && a.indexOf(u) === i);

export const unitsOf = (cat: Catalog, projectId: string): Unit[] => cat.units.filter(u => u.projectId === projectId);

export function fromPrice(cat: Catalog, p: Project): number | null {
  const prices = unitsOf(cat, p.id).map(u => u.price);
  if (prices.length) return Math.min(...prices);
  return (p.pricing as { from: number | null } | undefined)?.from ?? null;
}
