import type { Catalog, Project, PropertyCategory } from './types';
import { unitsOf } from './catalog';

export const CATEGORIES: PropertyCategory[] = ['new-build', 'resale', 'rental', 'investment'];

/** Listings without a category are treated as new developments when they have units, otherwise as resale. */
export function categoryOf(cat: Catalog, p: Project): PropertyCategory {
  if (p.category) return p.category;
  if (p.rental) return 'rental';
  if (p.investment) return 'investment';
  return unitsOf(cat, p.id).length ? 'new-build' : 'resale';
}

/**
 * The page layout follows the content of the listing, not a setting:
 * units in the catalogue give the unit explorer and payment plan,
 * a rental block gives stay terms, an investment block gives the deal table.
 */
export type Layout = 'units' | 'rental' | 'investment' | 'standard';
export function layoutOf(cat: Catalog, p: Project): Layout {
  if (unitsOf(cat, p.id).length) return 'units';
  if (p.rental) return 'rental';
  if (p.investment) return 'investment';
  return 'standard';
}

const SYMBOLS: Record<string, string> = { THB: '฿', USD: '$', EUR: '€', GBP: '£', AED: 'AED ', PLN: 'zł ', IDR: 'Rp ', JPY: '¥', CHF: 'CHF ' };
export function money(n: number, currency = 'THB') {
  const body = Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return (SYMBOLS[currency] ?? `${currency} `) + body;
}

export interface PriceInfo { amount: number | null; currency: string; suffix?: 'night' | 'month'; label: 'from' | 'price' | 'purchase' }
export function priceOf(cat: Catalog, p: Project): PriceInfo {
  const currency = p.pricing?.currency ?? 'THB';
  if (p.rental && (p.rental.nightly || p.rental.monthly)) {
    const r = p.rental;
    return r.nightly ? { amount: r.nightly, currency: r.currency ?? currency, suffix: 'night', label: 'from' } : { amount: r.monthly ?? null, currency: r.currency ?? currency, suffix: 'month', label: 'from' };
  }
  if (p.investment) return { amount: p.investment.purchasePrice, currency: p.investment.currency ?? currency, label: 'purchase' };
  const prices = unitsOf(cat, p.id).map(u => u.price);
  if (prices.length) return { amount: Math.min(...prices), currency, label: 'from' };
  const from = p.pricing?.from ?? null;
  return { amount: from, currency, label: categoryOf(cat, p) === 'new-build' ? 'from' : 'price' };
}

export interface Roi { total: number; profit: number; pct: number }
export function investmentReturn(i: NonNullable<Project['investment']>): Roi {
  const total = i.purchasePrice + i.renovationBudget;
  const profit = i.afterRepairValue - total;
  return { total, profit, pct: i.roiPct ?? (total ? Math.round((profit / total) * 1000) / 10 : 0) };
}

export type FactKey = 'beds' | 'baths' | 'area' | 'guests' | 'plot' | 'year' | 'units';
export interface Fact { key: FactKey; value: string }
const num = (n: number) => String(Math.round(n * 10) / 10).replace(/\.0$/, '');

function bedsFromTypes(types?: unknown): number[] {
  return Array.isArray(types) ? types.map(x => (String(x).match(/(\d+)/)?.[1] ? Number(String(x).match(/(\d+)/)![1]) : /studio/i.test(String(x)) ? 0 : NaN)).filter(n => !Number.isNaN(n)) : [];
}
export function maxBedrooms(p: Project): number | undefined {
  if (p.facts?.bedrooms != null) return p.facts.bedrooms;
  const b = bedsFromTypes(p.types);
  return b.length ? Math.max(...b) : undefined;
}

/** Quick facts for cards and the facts strip. Units listings use ranges taken from their types and sizes. */
export function factsOf(cat: Catalog, p: Project): Fact[] {
  const out: Fact[] = [];
  const f = p.facts ?? {};
  const types = bedsFromTypes(p.types);
  if (f.bedrooms != null) out.push({ key: 'beds', value: f.bedrooms === 0 ? 'Studio' : num(f.bedrooms) });
  else if (types.length) out.push({ key: 'beds', value: types.length > 1 ? `${Math.min(...types)} to ${Math.max(...types)}` : types[0] === 0 ? 'Studio' : String(types[0]) });
  if (f.bathrooms != null) out.push({ key: 'baths', value: num(f.bathrooms) });
  const sizes = Array.isArray(p.sizes) ? (p.sizes as number[]) : [];
  if (f.area != null) out.push({ key: 'area', value: `${num(f.area)} m²` });
  else if (sizes.length) out.push({ key: 'area', value: sizes.length > 1 ? `${num(Math.min(...sizes))} to ${num(Math.max(...sizes))} m²` : `${num(sizes[0])} m²` });
  if (f.guests != null) out.push({ key: 'guests', value: num(f.guests) });
  if (f.plot != null) out.push({ key: 'plot', value: `${num(f.plot)} m²` });
  if (f.year != null) out.push({ key: 'year', value: String(f.year) });
  const n = unitsOf(cat, p.id).length;
  if (n) out.push({ key: 'units', value: String(n) });
  return out;
}

export const placeOf = (p: Project) => [p.location.area, p.location.city, p.location.country].filter((x, i, a) => x && a.indexOf(x) === i).join(', ');
export const cityKey = (p: Project) => p.location.city;

export const usdOf = (cat: Catalog, amount: number | null, currency: string) =>
  amount == null ? Number.POSITIVE_INFINITY : amount * (cat.rates?.[currency] ?? 1);
