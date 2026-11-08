import seed from '@data/properties.json';
import { DEFAULT_SOURCES } from '@core';
import type { Catalog } from '@core';

export const SEED = seed as unknown as Catalog;
const fromEnv = [process.env.EXPO_PUBLIC_CATALOG_URL, process.env.EXPO_PUBLIC_CATALOG_BACKUP_URL].filter(Boolean) as string[];
export const CATALOG_SOURCES = fromEnv.length ? fromEnv : DEFAULT_SOURCES;
