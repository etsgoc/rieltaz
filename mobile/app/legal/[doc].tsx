import { useLocalSearchParams } from 'expo-router';
import { legalDocs } from '@core';
import LegalDocument from '@/components/legal/LegalDocument';
import EmptyState from '@/components/ui/EmptyState';
import Header from '@/components/ui/Header';
import Screen from '@/components/ui/Screen';
import { useI18n } from '@/i18n/I18nProvider';
import { useCatalog } from '@/providers/CatalogProvider';

export default function LegalScreen() {
  const { doc } = useLocalSearchParams<{ doc: string }>();
  const { cat } = useCatalog();
  const { t } = useI18n();
  const entity = cat.legal ?? { company: 'Reeltaz', email: cat.contact?.email ?? '', address: '' };
  const found = legalDocs(entity).find(d => d.id === doc);
  return (
    <Screen>
      <Header title={found?.title ?? t('legal.title')} />
      {found ? <LegalDocument doc={found} /> : <EmptyState title={t('error.notFound')} />}
    </Screen>
  );
}
