import seed from '@data/properties.json';
import { DEFAULT_SOURCES } from '@core';
import type { Catalog } from '@core';

export const SEED = seed as unknown as Catalog;

const fromEnv = [import.meta.env.VITE_CATALOG_URL, import.meta.env.VITE_CATALOG_BACKUP_URL].filter(Boolean) as string[];
export const CATALOG_SOURCES = fromEnv.length ? fromEnv : DEFAULT_SOURCES;

export const BRAND = { name: 'Rieltaz Admin' };
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
