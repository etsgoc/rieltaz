import { useRouter } from 'expo-router';
import { View } from 'react-native';
import PropertyCard from '@/components/property/PropertyCard';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import Header from '@/components/ui/Header';
import Screen from '@/components/ui/Screen';
import Txt from '@/components/ui/Txt';
import { useI18n } from '@/i18n/I18nProvider';
import { useCatalog } from '@/providers/CatalogProvider';
import { useFavorites } from '@/providers/FavoritesProvider';

export default function SavedScreen() {
  const router = useRouter();
  const { cat } = useCatalog();
  const { ids } = useFavorites();
  const { t } = useI18n();
  const list = ids.map(id => cat.projects.find(p => p.id === id)).filter(Boolean) as typeof cat.projects;
  return (
    <Screen>
      <Header title={t('saved.title')} />
      {list.length ? <View style={{ gap: 16 }}>{list.map(p => <PropertyCard key={p.id} p={p} />)}</View> : (
        <EmptyState title={t('saved.empty')}>
          <Txt size={14} color="muted" style={{ textAlign: 'center' }}>{t('saved.hint')}</Txt>
          <Button variant="soft" label={t('nav.browse')} onPress={() => router.navigate('/')} compact />
        </EmptyState>
      )}
    </Screen>
  );
}
