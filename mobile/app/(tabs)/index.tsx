import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useI18n } from '@/i18n/I18nProvider';
import { useCatalog } from '@/providers/CatalogProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/colors';
import PropertyCard from '@/components/property/PropertyCard';
import { categoryIcon } from '@/components/services/icons';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import EmptyState from '@/components/ui/EmptyState';
import { Mark } from '@/components/ui/Cover';
import TabScreen from '@/components/ui/TabScreen';
import Txt from '@/components/ui/Txt';

export default function Explore() {
  const router = useRouter();
  const { colors } = useTheme();
  const { cat, features } = useCatalog();
  const { t } = useI18n();
  const [area, setArea] = useState('all');
  const [own, setOwn] = useState<'all' | 'leasehold' | 'freehold'>('all');
  const areas = [...new Set(cat.projects.map(p => p.location.area))];
  const list = cat.projects.filter(p => (area === 'all' || p.location.area === area) && (own === 'all' || p.ownership.includes(own)));

  return (
    <TabScreen title="Reeltaz" icon={<Mark size={36} />}>
      <Txt size={26} weight="heavy" style={{ lineHeight: 31, letterSpacing: -0.4 }}>{t('home.title')}</Txt>
      <Txt color="muted" style={{ marginTop: 8, marginBottom: 16 }}>{t('home.subtitle')}</Txt>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginHorizontal: -18 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 18, paddingBottom: 4 }}>
        <Chip label={t('filters.allAreas')} on={area === 'all'} onPress={() => setArea('all')} />
        {areas.map(a => <Chip key={a} label={a} on={area === a} onPress={() => setArea(a)} />)}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginHorizontal: -18, marginTop: 8 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 18 }}>
        <Chip label={t('filters.anyOwnership')} on={own === 'all'} onPress={() => setOwn('all')} />
        <Chip label={t('own.leasehold')} on={own === 'leasehold'} onPress={() => setOwn('leasehold')} />
        <Chip label={t('own.freehold')} on={own === 'freehold'} onPress={() => setOwn('freehold')} />
      </ScrollView>

      <View style={{ gap: 16, marginTop: 20 }}>
        {list.length ? list.map(p => <PropertyCard key={p.id} p={p} />) : (
          <EmptyState title={t('filters.noResults')}><Button variant="soft" label={t('filters.reset')} onPress={() => { setArea('all'); setOwn('all'); }} compact /></EmptyState>
        )}
      </View>

      {features.services && cat.serviceCategories ? (
        <View style={{ marginTop: 32 }}>
          <Txt size={22} weight="bold">{t('home.servicesTitle')}</Txt>
          <Txt color="muted" style={{ marginBottom: 14 }}>{t('home.servicesSubtitle')}</Txt>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -18 }} contentContainerStyle={{ gap: 12, paddingHorizontal: 18 }}>
            {cat.serviceCategories.map(c => {
              const Icon = categoryIcon(c.icon);
              return (
                <Pressable key={c.id} onPress={() => router.navigate({ pathname: '/services', params: { cat: c.id } })}
                  style={{ width: 170, padding: 16, gap: 8, borderRadius: radius.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line }}>
                  <View style={{ width: 42, height: 42, borderRadius: 13, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}><Icon size={21} color={colors.accent} /></View>
                  <Txt weight="bold">{c.title}</Txt><Txt size={13} color="muted" numberOfLines={2}>{c.blurb}</Txt>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      ) : null}

      <Pressable onPress={() => router.push('/contact')} style={{ marginTop: 32, padding: 22, borderRadius: 26, backgroundColor: '#1E1E1E', gap: 6 }}>
        <Txt size={20} weight="bold" style={{ color: '#EDEDED' }}>{t('home.cta')}</Txt>
        <Txt size={14} style={{ color: '#A3A3A3' }}>{t('contact.subtitle')}</Txt>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}><Txt weight="semibold" style={{ color: '#7BA3FF' }}>{t('nav.contact')}</Txt><ArrowRight size={16} color="#7BA3FF" /></View>
      </Pressable>
    </TabScreen>
  );
}
