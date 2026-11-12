import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { buildQuote, money, priceFor, unitsOf } from '@core';
import type { InquiryContext, Ownership } from '@core';
import { useI18n } from '@/i18n/I18nProvider';
import { useCatalog } from '@/providers/CatalogProvider';
import ContactActions from '@/components/contact/ContactActions';
import QuoteTable from '@/components/property/QuoteTable';
import Chip from '@/components/ui/Chip';
import Header from '@/components/ui/Header';
import Screen from '@/components/ui/Screen';
import Txt from '@/components/ui/Txt';

export default function UnitsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { cat } = useCatalog();
  const { t } = useI18n();
  const p = cat.projects.find(x => x.id === id);
  const [tower, setTower] = useState('');
  const [unitId, setUnitId] = useState('');
  const [own, setOwn] = useState<Ownership>(p?.ownership[0] ?? 'freehold');

  const units = p ? unitsOf(cat, p.id).filter(u => u.status === 'available') : [];
  const towers = [...new Set(units.map(u => u.tower))];
  const activeTower = towers.includes(tower) ? tower : towers[0];
  const inTower = units.filter(u => u.tower === activeTower);
  const unit = inTower.find(u => u.id === unitId) ?? inTower[0];
  const quote = useMemo(() => { try { return unit ? buildQuote(cat, unit, own) : null; } catch { return null; } }, [cat, unit, own]);

  if (!p || !unit) return <Screen><Header close title={t('res.title')} /><Txt color="muted">{t('prop.availabilityHint')}</Txt></Screen>;
  const cur = p.pricing?.currency ?? 'THB';
  const ctx: InquiryContext = { property: p.name, unit: `${unit.id}, ${unit.type}, ${unit.sqm} m²`, ownership: p.ownership.length ? t(`own.${own}`) : undefined, price: money(priceFor(unit, own), cur) };

  return (
    <Screen bottom={20}>
      <Header close title={t('res.title')} />
      {towers.length > 1 ? <><Txt weight="semibold" style={{ marginBottom: 8 }}>{t('res.tower')}</Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>{towers.map(x => <Chip key={x} label={x} on={x === activeTower} onPress={() => setTower(x)} />)}</View></> : null}
      <Txt weight="semibold" style={{ marginBottom: 8 }}>{t('res.unit')}</Txt>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>{inTower.map(u => <Chip key={u.id} label={`${u.id} · ${u.type} · ${u.sqm} m²`} on={u.id === unit.id} onPress={() => setUnitId(u.id)} />)}</View>
      {p.ownership.length > 1 ? <><Txt weight="semibold" style={{ marginBottom: 8 }}>{t('res.ownership')}</Txt>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>{p.ownership.map(o => <Chip key={o} label={t(`own.${o}`)} on={o === own} onPress={() => setOwn(o)} />)}</View></> : null}
      <Txt size={30} weight="heavy" style={{ marginVertical: 6 }}>{money(priceFor(unit, own), cur)}</Txt>
      {unit.style || unit.view ? <Txt color="muted" style={{ marginBottom: 8 }}>{[unit.style, unit.view].filter(Boolean).join(' · ')}</Txt> : null}
      {quote ? <QuoteTable quote={quote} /> : null}
      {typeof p.priceNote === 'string' ? <Txt size={13} color="muted" style={{ marginTop: 8 }}>{p.priceNote}</Txt> : null}
      <Txt weight="bold" size={18} style={{ marginTop: 22, marginBottom: 10 }}>{t('res.cta')}</Txt>
      <ContactActions ctx={ctx} />
    </Screen>
  );
}
