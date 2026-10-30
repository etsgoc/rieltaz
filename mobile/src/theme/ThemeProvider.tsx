import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { palettes, type Palette } from './colors';

export type Mode = 'system' | 'light' | 'dark';
const Ctx = createContext<{ colors: Palette; dark: boolean; mode: Mode; setMode: (m: Mode) => void } | null>(null);
const KEY = 'reeltaz.theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [mode, setModeState] = useState<Mode>('system');
  useEffect(() => {
    AsyncStorage.getItem(KEY).then(v => { if (v === 'light' || v === 'dark' || v === 'system') setModeState(v); });
  }, []);
  const setMode = useCallback((m: Mode) => { setModeState(m); AsyncStorage.setItem(KEY, m).catch(() => {}); }, []);
  const dark = mode === 'system' ? system === 'dark' : mode === 'dark';
  const value = useMemo(() => ({ colors: dark ? palettes.dark : palettes.light, dark, mode, setMode }), [dark, mode, setMode]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useTheme outside ThemeProvider');
  return v;
}
