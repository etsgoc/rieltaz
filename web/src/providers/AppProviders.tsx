import type { ReactNode } from 'react';
import { CatalogProvider } from './CatalogProvider';
import { ConsentProvider } from './ConsentProvider';
import { FavoritesProvider } from './FavoritesProvider';
import { I18nProvider } from './I18nProvider';
import { SessionProvider } from './SessionProvider';
import { ThemeProvider } from './ThemeProvider';

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <CatalogProvider>
          <SessionProvider><ConsentProvider><FavoritesProvider>{children}</FavoritesProvider></ConsentProvider></SessionProvider>
        </CatalogProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
