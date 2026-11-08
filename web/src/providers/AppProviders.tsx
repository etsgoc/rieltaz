import type { ReactNode } from 'react';
import { CatalogProvider } from './CatalogProvider';
import { ConsentProvider } from './ConsentProvider';
import { FavoritesProvider } from './FavoritesProvider';
import { I18nProvider } from './I18nProvider';
import { ThemeProvider } from './ThemeProvider';

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <CatalogProvider>
          <ConsentProvider><FavoritesProvider>{children}</FavoritesProvider></ConsentProvider>
        </CatalogProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
