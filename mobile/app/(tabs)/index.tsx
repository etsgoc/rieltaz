import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ImageBackground, Pressable, ScrollView, View } from 'react-native';
import { CATEGORIES, categoryOf } from '@core';
import type { PropertyCategory } from '@core';
import { useI18n } from '@/i18n/I18nProvider';
import { useCatalog } from '@/providers/CatalogProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/colors';
import ContactActions from '@/components/contact/ContactActions';
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
  const [kind, setKind] = useState<'all' | PropertyCategory>('all');
  const [city, setCity] = useState('all');
  const places = useMemo(() => [...new Map(cat.projects.map(p => [p.location.city, p.location.city])).keys()].sort(), [cat]);
  const list = cat.projects.filter(p => (kind === 'all' || categoryOf(cat, p) === kind) && (city === 'all' || p.location.city === city));
  const hero = cat.hero?.image ? { uri: cat.hero.image } : require('../../assets/hero.png');

  return (
    <TabScreen title="Rieltaz" icon={<Mark size={36} />}>
      <ImageBackground source={hero} resizeMode="cover" imageStyle={{ borderRadius: 26 }} style={{ height: 320, borderRadius: 26, overflow: 'hidden', justifyContent: 'flex-end' }}>
        <View style={{ padding: 20, gap: 8, backgroundColor: 'rgba(8,10,18,0.5)', borderRadius: 26 }}>
          <Txt size={27} weight="heavy" style={{ lineHeight: 31, letterSpacing: -0.4, color: '#fff' }}>{t('home.title')}</Txt>
          <Txt size={14} style={{ color: 'rgba(255,255,255,0.85)' }} numberOfLines={3}>{t('home.subtitle')}</Txt>
        </View>
      </ImageBackground>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginHorizontal: -18, marginTop: 16 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 18 }}>
        <Chip label={t('cat.all')} on={kind === 'all'} onPress={() => setKind('all')} />
        {CATEGORIES.map(c => <Chip key={c} label={t(`cat.${c}` as 'cat.resale')} on={kind === c} onPress={() => setKind(c)} />)}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginHorizontal: -18, marginTop: 8 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 18 }}>
        <Chip label={t('filters.anywhere')} on={city === 'all'} onPress={() => setCity('all')} />
        {places.map(c => <Chip key={c} label={c} on={city === c} onPress={() => setCity(c)} />)}
      </ScrollView>

      <View style={{ gap: 16, marginTop: 20 }}>
        {list.length ? list.map(p => <PropertyCard key={p.id} p={p} />) : (
          <EmptyState title={t('filters.noResults')}><Button variant="soft" label={t('filters.reset')} onPress={() => { setKind('all'); setCity('all'); }} compact /></EmptyState>
        )}
      </View>

      <View style={{ marginTop: 32, gap: 10 }}>
        <Txt size={22} weight="bold">{t('home.howTitle')}</Txt>
        {(['1', '2', '3'] as const).map(n => (
          <View key={n} style={{ flexDirection: 'row', gap: 14, padding: 16, borderRadius: radius.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.text, alignItems: 'center', justifyContent: 'center' }}><Txt weight="bold" style={{ color: colors.bg }}>{n}</Txt></View>
            <View style={{ flex: 1 }}><Txt weight="bold">{t(`home.step${n}` as 'home.step1')}</Txt><Txt size={14} color="muted">{t(`home.step${n}d` as 'home.step1d')}</Txt></View>
          </View>
        ))}
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

      <View style={{ marginTop: 32, padding: 22, borderRadius: 26, backgroundColor: '#1E1E1E', gap: 14 }}>
        <View style={{ gap: 6 }}>
          <Txt size={20} weight="bold" style={{ color: '#EDEDED' }}>{t('home.cta')}</Txt>
          <Txt size={14} style={{ color: '#A3A3A3' }}>{t('home.ctaSub')}</Txt>
        </View>
        <ContactActions dark />
      </View>
    </TabScreen>
  );
}
