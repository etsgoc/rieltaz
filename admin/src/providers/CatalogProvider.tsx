import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { features as readFeatures, loadCatalog } from '@core';
import type { Catalog, Features } from '@core';
import { CATALOG_SOURCES, SEED } from '@/config';
import { store } from '@/lib/storage';

const Ctx = createContext<{ cat: Catalog; features: Features; live: boolean } | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [cat, setCat] = useState<Catalog>(SEED);
  const [live, setLive] = useState(false);
  useEffect(() => {
    loadCatalog(store, { sources: CATALOG_SOURCES, seed: SEED }).then(c => { setCat(c); setLive(c !== SEED); });
  }, []);
  const value = useMemo(() => ({ cat, live, features: readFeatures(cat) }), [cat, live]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCatalog() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useCatalog outside CatalogProvider');
  return v;
}
