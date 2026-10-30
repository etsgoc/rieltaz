import { en } from './en';
import { pl } from './pl';
import { th } from './th';

export type Lang = 'en' | 'pl' | 'th';
export type Key = keyof typeof en;

export const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'pl', label: 'Polski' },
  { code: 'th', label: 'ไทย' },
];

const dict: Record<Lang, Partial<Record<Key, string>>> = { en, pl, th };

export function translate(lang: Lang, key: Key, vars?: Record<string, string | number>): string {
  const text = dict[lang][key] ?? en[key] ?? key;
  return vars ? text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? '')) : text;
}

export const detectLang = (code?: string | null): Lang => (code === 'pl' || code === 'th' ? code : 'en');
