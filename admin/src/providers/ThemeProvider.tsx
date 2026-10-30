import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Mode = 'light' | 'dark' | 'system';
const Ctx = createContext<{ mode: Mode; setMode: (m: Mode) => void } | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(() => (localStorage.getItem('theme') as Mode) || 'system');
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = mode === 'dark' || (mode === 'system' && mq.matches);
      document.documentElement.dataset.theme = dark ? 'dark' : 'light';
      document.querySelector('meta[name=theme-color]')?.setAttribute('content', dark ? '#1e1e1e' : '#f2f3f5');
    };
    apply();
    localStorage.setItem('theme', mode);
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [mode]);
  const value = useMemo(() => ({ mode, setMode }), [mode]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useTheme outside ThemeProvider');
  return v;
}
