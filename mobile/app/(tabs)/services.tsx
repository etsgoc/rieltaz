import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { servicesIn } from '@core';
import { useI18n } from '@/i18n/I18nProvider';
import { useCatalog } from '@/providers/CatalogProvider';
import CategoryBar from '@/components/services/CategoryBar';
import ServiceCard from '@/components/services/ServiceCard';
import EmptyState from '@/components/ui/EmptyState';
import Screen from '@/components/ui/Screen';
import Txt from '@/components/ui/Txt';

export default function Services() {
  const { cat, features } = useCatalog();
  const { t } = useI18n();
  const params = useLocalSearchParams<{ cat?: string }>();
  const cats = cat.serviceCategories ?? [];
  const [active, setActive] = useState(cats[0]?.id ?? '');
  useEffect(() => { if (params.cat) setActive(params.cat); }, [params.cat]);

  if (!features.services || !cats.length) return <Screen tabs><EmptyState title={t('svc.unavailable')} /></Screen>;
  const current = cats.find(c => c.id === active) ?? cats[0];
  const list = servicesIn(cat, current.id);
  return (
    <Screen tabs>
      <Txt size={30} weight="heavy" style={{ marginBottom: 4 }}>{t('svc.title')}</Txt>
      <Txt color="muted" style={{ marginBottom: 14 }}>{t('svc.subtitle')}</Txt>
      <CategoryBar categories={cats} value={current.id} onChange={setActive} />
      <Txt color="muted" style={{ marginBottom: 12 }}>{current.blurb}</Txt>
      <View style={{ gap: 14 }}>
        {list.length ? list.map(s => <ServiceCard key={s.id} s={s} />) : <EmptyState title={t('svc.empty')} />}
      </View>
    </Screen>
  );
}
