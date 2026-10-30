import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type Consent = 'all' | 'essential' | null;
const KEY = 'consent';
const Ctx = createContext<{ consent: Consent; choose: (c: 'all' | 'essential') => void; bannerOpen: boolean; reopen: () => void } | null>(null);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<Consent>(() => {
    const v = localStorage.getItem(KEY);
    return v === 'all' || v === 'essential' ? v : null;
  });
  const [reopened, setReopened] = useState(false);
  const choose = useCallback((c: 'all' | 'essential') => {
    localStorage.setItem(KEY, c);
    setConsent(c);
    setReopened(false);
  }, []);
  const value = useMemo(() => ({ consent, choose, bannerOpen: consent === null || reopened, reopen: () => setReopened(true) }), [consent, choose, reopened]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useConsent() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useConsent outside ConsentProvider');
  return v;
}
