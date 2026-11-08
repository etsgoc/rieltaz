import type { ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nProvider } from '@/i18n/I18nProvider';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { CatalogProvider } from './CatalogProvider';
import { FavoritesProvider } from './FavoritesProvider';

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <I18nProvider>
            <CatalogProvider>
              <FavoritesProvider>{children}</FavoritesProvider>
            </CatalogProvider>
          </I18nProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
