import type { ReactNode } from 'react';
import { CatalogProvider } from './CatalogProvider';
import { SessionProvider } from './SessionProvider';
import { ThemeProvider } from './ThemeProvider';

export default function AppProviders({ children }: { children: ReactNode }) {
  return <ThemeProvider><CatalogProvider><SessionProvider>{children}</SessionProvider></CatalogProvider></ThemeProvider>;
}
