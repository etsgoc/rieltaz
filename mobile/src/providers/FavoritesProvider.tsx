import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const KEY = 'reeltaz.favorites';
const Ctx = createContext<{ ids: string[]; has: (id: string) => boolean; toggle: (id: string) => void } | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    AsyncStorage.getItem(KEY).then(v => { try { const a = v ? JSON.parse(v) : []; if (Array.isArray(a)) setIds(a); } catch { /* ignore */ } });
  }, []);
  const toggle = useCallback((id: string) => {
    setIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [id, ...prev];
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
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
