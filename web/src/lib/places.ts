import type { Catalog } from '@core';

/** One entry per city in the catalogue, labelled with its country. */
export function placeOptions(cat: Catalog) {
  const seen = new Map<string, string>();
  cat.projects.forEach(p => { if (!seen.has(p.location.city)) seen.set(p.location.city, p.location.country ? `${p.location.city}, ${p.location.country}` : p.location.city); });
  return [...seen].map(([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label));
}
export const countryCount = (cat: Catalog) => new Set(cat.projects.map(p => p.location.country ?? p.location.city)).size;
