import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { resolveSession } from '@core';
import { db, hasBackend } from '@/lib/supabase';
import { store } from '@/lib/storage';

const Ctx = createContext<{ session: Session | null; ready: boolean } | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!hasBackend) { setReady(true); return; }
    resolveSession(store, db).then(s => { setSession(s); setReady(true); }).catch(() => setReady(true));
    const { data } = db.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      store.set('session', s ? JSON.stringify(s) : '');
    });
    return () => data.subscription.unsubscribe();
  }, []);
  return <Ctx.Provider value={{ session, ready }}>{children}</Ctx.Provider>;
}

export function useSession() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useSession outside SessionProvider');
  return v;
}
