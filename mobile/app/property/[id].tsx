import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Maximize2, MapPin, Orbit } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fromPrice, photos, tourOf, unitsOf } from '@core';
import { useI18n } from '@/i18n/I18nProvider';
import { thb } from '@/lib/format';
import { db, hasBackend } from '@/lib/supabase';
import { useCatalog } from '@/providers/CatalogProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/colors';
import ContactForm from '@/components/auth/ContactForm';
import Gallery from '@/components/property/Gallery';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import EmptyState from '@/components/ui/EmptyState';
import Header from '@/components/ui/Header';
import Screen from '@/components/ui/Screen';
import Txt from '@/components/ui/Txt';
import MapFrame from '@/components/web/MapFrame';

export default function PropertyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { cat } = useCatalog();
  const { t } = useI18n();
  const [taken, setTaken] = useState(0);
  const p = cat.projects.find(x => x.id === id);

  useEffect(() => {
    if (!hasBackend || !p) return;
    db.rpc('taken_units').then(({ data }) => {
      const set = new Set((data as { project_id: string; unit_id: string }[] | null)?.map(r => `${r.project_id}:${r.unit_id}`) ?? []);
      setTaken(unitsOf(cat, p.id).filter(u => set.has(`${p.id}:${u.id}`)).length);
    });
  }, [id]);

  if (!p) return <Screen><Header /><EmptyState title={t('prop.notFound')} /></Screen>;
  const units = unitsOf(cat, p.id).filter(u => u.status === 'available');
  const open = units.length - taken;
  const from = fromPrice(cat, p);
  const tour = tourOf(p);
  const amenities = (p.amenities as string[] | undefined) ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 + insets.bottom }}>
        <Gallery photos={photos(cat, p)} seed={p.id} />
        <View style={{ padding: 18, gap: 10 }}>
          <Txt size={28} weight="heavy" style={{ lineHeight: 32 }}>{p.name}</Txt>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}><MapPin size={15} color={colors.muted} /><Txt color="muted">{p.location.area}, {p.location.city}</Txt></View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {p.ownership.map(o => <Chip key={o} label={t(p.ownership.length === 1 && o === 'leasehold' ? 'own.leaseOnly' : `own.${o}`)} />)}
            {p.handover ? <Chip label={`${t('prop.handover')} ${String(p.handover)}`} /> : null}
            {p.furnished ? <Chip label={t('prop.furnished')} /> : null}
          </View>

          {p.summary ? <><Txt size={20} weight="bold" style={{ marginTop: 14 }}>{t('prop.about')}</Txt><Txt color="muted">{p.summary}</Txt></> : null}
          {p.leaseTerms ? <><Txt size={20} weight="bold" style={{ marginTop: 14 }}>{t('prop.leaseTerms')}</Txt><Txt color="muted">{String(p.leaseTerms)}</Txt></> : null}
          {p.management ? <><Txt size={20} weight="bold" style={{ marginTop: 14 }}>{t('prop.management')}</Txt><Txt color="muted">{String(p.management)}</Txt></> : null}
          {amenities.length ? <><Txt size={20} weight="bold" style={{ marginTop: 14 }}>{t('prop.amenities')}</Txt><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{amenities.map(a => <Chip key={a} label={a} />)}</View></> : null}

          {tour ? (
            <Pressable onPress={() => router.push(`/tour/${p.id}`)} style={{ marginTop: 18, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: radius.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line }}>
              <View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}><Orbit size={22} color={colors.accent} /></View>
              <View style={{ flex: 1 }}><Txt weight="bold">{t('prop.tour')}</Txt><Txt size={13} color="muted">{t('prop.dragTour')}</Txt></View>
            </Pressable>
          ) : null}

          <Txt size={20} weight="bold" style={{ marginTop: 18 }}>{t('prop.map')}</Txt>
          <Pressable onPress={() => router.push(`/map/${p.id}`)} style={{ height: 210, borderRadius: radius.card, overflow: 'hidden', borderWidth: 1, borderColor: colors.line }}>
            <MapFrame lat={p.location.lat} lng={p.location.lng} interactive={false} />
            <View style={{ position: 'absolute', right: 12, bottom: 12, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surface, borderRadius: 999, paddingVertical: 9, paddingHorizontal: 14 }}>
              <Maximize2 size={15} color={colors.text} /><Txt size={14} weight="semibold">{t('common.expand')}</Txt>
            </View>
          </Pressable>

          {!units.length ? (
            <View style={{ marginTop: 20, gap: 10 }}>
              <Txt size={20} weight="bold">{t('prop.availabilityTitle')}</Txt><Txt color="muted">{t('prop.availabilityHint')}</Txt>
              <ContactForm subject={p.name} />
            </View>
          ) : null}
        </View>
      </ScrollView>

      <Pressable onPress={() => router.back()} style={{ position: 'absolute', top: insets.top + 8, left: 16, width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line }}>
        <ArrowLeft size={22} color={colors.text} />
      </Pressable>

      {units.length ? (
        <View style={{ position: 'absolute', left: 16, right: 16, bottom: insets.bottom + 12, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, paddingLeft: 18, borderRadius: radius.float, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, shadowColor: colors.shadow, shadowOpacity: 0.2, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 10 }}>
          <View style={{ flex: 1 }}>
            <Txt size={12} color="muted">{t('common.from')}</Txt>
            <Txt weight="heavy">{from ? thb(from) : t('common.onRequest')}</Txt>
            <Txt size={12} color="muted">{open} {t('prop.units')}</Txt>
          </View>
          <Button label={t('res.title')} onPress={() => router.push(`/reserve/${p.id}`)} />
        </View>
      ) : null}
    </View>
  );
}
