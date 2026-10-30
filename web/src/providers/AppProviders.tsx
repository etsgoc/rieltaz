import type { ReactNode } from 'react';
import { CatalogProvider } from './CatalogProvider';
import { I18nProvider } from './I18nProvider';
import { SessionProvider } from './SessionProvider';
import { ThemeProvider } from './ThemeProvider';

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <CatalogProvider>
          <SessionProvider>{children}</SessionProvider>
        </CatalogProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
