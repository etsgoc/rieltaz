import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Check, Clock, Maximize2, MapPin, Orbit, TrendingUp } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { categoryOf, factsOf, investmentReturn, layoutOf, money, photos, placeOf, priceOf, tourOf, unitsOf } from '@core';
import type { InquiryContext } from '@core';
import { useI18n } from '@/i18n/I18nProvider';
import { shortDate } from '@/lib/format';
import { useCatalog } from '@/providers/CatalogProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/colors';
import ContactActions from '@/components/contact/ContactActions';
import ContactForm from '@/components/contact/ContactForm';
import FactIcon from '@/components/property/FactIcon';
import Gallery from '@/components/property/Gallery';
import HeartButton from '@/components/property/HeartButton';
import { priceLabel } from '@/components/property/PropertyCard';
import Spec from '@/components/property/Spec';
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
  const { t, lang } = useI18n();
  const p = cat.projects.find(x => x.id === id);

  if (!p) return <Screen><Header /><EmptyState title={t('prop.notFound')} /></Screen>;
  const kind = categoryOf(cat, p);
  const layout = layoutOf(cat, p);
  const price = priceOf(cat, p);
  const open = unitsOf(cat, p.id).filter(u => u.status === 'available').length;
  const tour = tourOf(p);
  const amenities = p.amenities ?? [];
  const facts = factsOf(cat, p).filter(f => f.key !== 'units' || layout === 'units');
  const r = p.rental;
  const inv = p.investment;
  const ret = inv ? investmentReturn(inv) : null;
  const ctx: InquiryContext = { property: p.name, details: [placeOf(p)] };
  const H = ({ children }: { children: string }) => <Txt size={20} weight="bold" style={{ marginTop: 22, marginBottom: 6 }}>{children}</Txt>;

  const tiles: { icon: React.ReactNode; label: string; value: string }[] = [
    ...facts.map(f => ({ icon: <FactIcon k={f.key} size={18} color={colors.accent} />, label: t(`fact.${f.key}` as 'fact.beds'), value: f.value })),
    ...(layout === 'units' && p.handover ? [{ icon: <Clock size={18} color={colors.accent} />, label: t('fact.handover'), value: String(p.handover) }] : []),
    ...(r?.minNights ? [{ icon: <Clock size={18} color={colors.accent} />, label: t('fact.minStay'), value: t('fact.nights', { n: r.minNights }) }] : []),
    ...(ret ? [{ icon: <TrendingUp size={18} color={colors.accent} />, label: t('fact.roi'), value: `${ret.pct}%` }] : []),
    ...(inv?.timelineMonths ? [{ icon: <Clock size={18} color={colors.accent} />, label: t('fact.timeline'), value: t('fact.months', { n: inv.timelineMonths }) }] : []),
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 130 + insets.bottom }}>
        <Gallery photos={photos(cat, p)} seed={p.id} />
        <View style={{ padding: 18, gap: 10 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Chip tone="accent" label={t(`cat.${kind}` as 'cat.resale')} />
            {layout !== 'rental' ? p.ownership.map(o => <Chip key={o} label={t(p.ownership.length === 1 && o === 'leasehold' ? 'own.leaseOnly' : `own.${o}`)} />) : null}
            {p.furnished ? <Chip label={t('prop.furnished')} /> : null}
          </View>
          <Txt size={28} weight="heavy" style={{ lineHeight: 32 }}>{p.name}</Txt>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}><MapPin size={15} color={colors.muted} /><Txt color="muted" style={{ flex: 1 }}>{placeOf(p)}</Txt></View>
          <Txt size={24} weight="heavy">{priceLabel(t, price)}</Txt>

          {tiles.length ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
              {tiles.map(x => (
                <View key={x.label} style={{ width: '48%', padding: 14, gap: 4, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line }}>
                  {x.icon}<Txt size={18} weight="bold">{x.value}</Txt><Txt size={12.5} color="muted">{x.label}</Txt>
                </View>
              ))}
            </View>
          ) : null}

          {p.summary ? <><H>{t('prop.about')}</H><Txt color="muted">{p.summary}</Txt></> : null}

          {layout === 'units' ? (
            <Pressable onPress={() => router.push(`/units/${p.id}`)} style={{ marginTop: 18, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: radius.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line }}>
              <View style={{ flex: 1 }}><Txt weight="bold">{t('prop.layout.units')}</Txt><Txt size={13} color="muted">{t('prop.unitsAvailable', { n: open })}</Txt></View>
              <Txt weight="semibold" color="accent">{t('res.title')}</Txt>
            </Pressable>
          ) : null}

          {r ? <>
            <H>{t('rent.title')}</H>
            <Spec rows={[
              { label: t('rent.nightly'), value: r.nightly && money(r.nightly, r.currency) },
              { label: t('rent.monthly'), value: r.monthly && money(r.monthly, r.currency) },
              { label: t('rent.cleaning'), value: r.cleaningFee && money(r.cleaningFee, r.currency) },
              { label: t('rent.deposit'), value: r.deposit && money(r.deposit, r.currency) },
              { label: t('rent.occupancy'), value: r.occupancyPct && `${r.occupancyPct}%` },
              { label: t('rent.rating'), value: r.rating && `★ ${r.rating}${r.reviews ? ` · ${t('rent.reviews', { n: r.reviews })}` : ''}` },
              { label: t('rent.available'), value: r.availableFrom && shortDate(r.availableFrom, lang) },
              { label: t('rent.source'), value: r.source },
            ]} />
            {r.rules?.length ? <View style={{ gap: 8, marginTop: 14 }}><Txt weight="semibold">{t('rent.rules')}</Txt>{r.rules.map(x => <View key={x} style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}><Check size={16} color={colors.ok} /><Txt style={{ flex: 1 }}>{x}</Txt></View>)}</View> : null}
          </> : null}

          {inv && ret ? <>
            <H>{t('inv.title')}</H>
            <Spec rows={[
              { label: t('inv.strategy'), value: inv.strategy },
              { label: t('inv.purchase'), value: money(inv.purchasePrice, inv.currency) },
              { label: t('inv.reno'), value: money(inv.renovationBudget, inv.currency) },
              { label: t('inv.total'), value: money(ret.total, inv.currency) },
              { label: t('inv.arv'), value: money(inv.afterRepairValue, inv.currency) },
              { label: t('inv.profit'), value: money(ret.profit, inv.currency), ok: true },
              { label: t('inv.roi'), value: `${ret.pct}%`, ok: true },
              { label: t('inv.minTicket'), value: inv.minTicket && money(inv.minTicket, inv.currency) },
            ]} />
            {inv.targetRaise ? (
              <View style={{ marginTop: 14, gap: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Txt color="muted">{t('inv.raised')}</Txt><Txt weight="semibold">{money(inv.raised ?? 0, inv.currency)} / {money(inv.targetRaise, inv.currency)}</Txt></View>
                <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.surface2, overflow: 'hidden' }}><View style={{ height: 8, width: `${Math.min(100, ((inv.raised ?? 0) / inv.targetRaise) * 100)}%`, backgroundColor: colors.ok }} /></View>
              </View>
            ) : null}
            {inv.scope?.length ? <View style={{ gap: 8, marginTop: 14 }}><Txt weight="semibold">{t('inv.scope')}</Txt>{inv.scope.map(x => <View key={x} style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}><Check size={16} color={colors.ok} /><Txt style={{ flex: 1 }}>{x}</Txt></View>)}</View> : null}
            <Txt size={13} color="muted" style={{ marginTop: 10 }}>{t('inv.note')}</Txt>
          </> : null}

          {p.leaseTerms ? <><H>{t('prop.leaseTerms')}</H><Txt color="muted">{String(p.leaseTerms)}</Txt></> : null}
          {p.management ? <><H>{t('prop.management')}</H><Txt color="muted">{String(p.management)}</Txt></> : null}
          {amenities.length ? <><H>{t('prop.amenities')}</H><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{amenities.map(a => <Chip key={a} label={a} />)}</View></> : null}

          {tour ? (
            <Pressable onPress={() => router.push(`/tour/${p.id}`)} style={{ marginTop: 18, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: radius.card, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line }}>
              <View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}><Orbit size={22} color={colors.accent} /></View>
              <View style={{ flex: 1 }}><Txt weight="bold">{t('prop.tour')}</Txt><Txt size={13} color="muted">{t('prop.dragTour')}</Txt></View>
            </Pressable>
          ) : null}

          <H>{t('prop.map')}</H>
          <Pressable onPress={() => router.push(`/map/${p.id}`)} style={{ height: 210, borderRadius: radius.card, overflow: 'hidden', borderWidth: 1, borderColor: colors.line }}>
            <MapFrame lat={p.location.lat} lng={p.location.lng} interactive={false} />
            <View style={{ position: 'absolute', right: 12, bottom: 12, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.surface, borderRadius: 999, paddingVertical: 9, paddingHorizontal: 14 }}>
              <Maximize2 size={15} color={colors.text} /><Txt size={14} weight="semibold">{t('common.expand')}</Txt>
            </View>
          </Pressable>

          <H>{t('prop.contactTitle')}</H>
          <Txt color="muted" style={{ marginBottom: 8 }}>{t('prop.contactHint')}</Txt>
          <ContactActions ctx={ctx} />
          <Txt size={18} weight="bold" style={{ marginTop: 22, marginBottom: 8 }}>{t('inq.title')}</Txt>
          <ContactForm ctx={ctx} />
        </View>
      </ScrollView>

      <Pressable onPress={() => router.back()} style={{ position: 'absolute', top: insets.top + 8, left: 16, width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line }}>
        <ArrowLeft size={22} color={colors.text} />
      </Pressable>
      <HeartButton id={p.id} style={{ position: 'absolute', top: insets.top + 8, right: 16, width: 42, height: 42, borderRadius: 21 }} />

      <View style={{ position: 'absolute', left: 16, right: 16, bottom: insets.bottom + 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: 12, paddingLeft: 18, borderRadius: radius.float, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line }}>
        <Txt weight="heavy" style={{ flex: 1 }} numberOfLines={2}>{priceLabel(t, price)}</Txt>
        <ContactActions ctx={ctx} compact />
      </View>
    </View>
  );
}
