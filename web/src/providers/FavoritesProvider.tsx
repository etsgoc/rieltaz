import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

const KEY = 'favorites';
const read = (): string[] => { try { const a = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(a) ? a : []; } catch { return []; } };
const Ctx = createContext<{ ids: string[]; has: (id: string) => boolean; toggle: (id: string) => void } | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(read);
  const toggle = useCallback((id: string) => {
    setIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [id, ...prev];
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage blocked */ }
      return next;
    });
  }, []);
  const value = useMemo(() => ({ ids, toggle, has: (id: string) => ids.includes(id) }), [ids, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFavorites() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useFavorites outside FavoritesProvider');
  return v;
}
