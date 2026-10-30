import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { buildQuote, unitsOf } from '@core';
import type { Ownership } from '@core';
import { useI18n } from '@/i18n/I18nProvider';
import { thb } from '@/lib/format';
import { db, hasBackend } from '@/lib/supabase';
import { useCatalog } from '@/providers/CatalogProvider';
import { useSession } from '@/providers/SessionProvider';
import QuoteTable from '@/components/property/QuoteTable';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import Header from '@/components/ui/Header';
import Screen from '@/components/ui/Screen';
import Txt from '@/components/ui/Txt';

const slots = () => [1, 2, 3, 4, 5].flatMap(d => [10, 15].map(h => { const x = new Date(); x.setDate(x.getDate() + d); x.setHours(h, 0, 0, 0); return x; }));

export default function ReserveScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { cat } = useCatalog();
  const { session } = useSession();
  const { t, lang } = useI18n();
  const p = cat.projects.find(x => x.id === id);
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [tower, setTower] = useState('');
  const [unitId, setUnitId] = useState('');
  const [own, setOwn] = useState<Ownership>(p?.ownership[0] ?? 'leasehold');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [rid, setRid] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!hasBackend) return;
    db.rpc('taken_units').then(({ data }) => setTaken(new Set((data as { project_id: string; unit_id: string }[] | null)?.map(r => `${r.project_id}:${r.unit_id}`) ?? [])));
  }, []);

  const units = p ? unitsOf(cat, p.id).filter(u => u.status === 'available' && !taken.has(`${p.id}:${u.id}`)) : [];
  const towers = [...new Set(units.map(u => u.tower))];
  const activeTower = towers.includes(tower) ? tower : towers[0];
  const inTower = units.filter(u => u.tower === activeTower);
  const unit = inTower.find(u => u.id === unitId) ?? inTower[0];
  const quote = useMemo(() => { try { return unit ? buildQuote(cat, unit, own) : null; } catch { return null; } }, [cat, unit, own]);

  if (!p || !unit) return <Screen><Header close title={t('res.title')} /><Txt color="muted">{t('prop.availabilityHint')}</Txt></Screen>;

  async function reserve() {
    if (!session || !quote || !p) return;
    setBusy(true); setErr('');
    const { data, error } = await db.from('reservations').insert({ user_id: session.user.id, project_id: p.id, unit_id: unit.id, ownership: own, quoted_price: unit.price }).select('id').single();
    setBusy(false);
    if (error) setErr(error.code === '23505' ? t('res.taken') : error.message); else setRid(data.id);
  }
  async function book(at: Date) {
    setBusy(true); setErr('');
    const { error } = await db.rpc('book_meeting', { rid, at: at.toISOString() });
    setBusy(false);
    if (error) setErr(error.message); else setDone(true);
  }

  if (rid) {
    return (
      <Screen>
        <Header close title={done ? t('res.callSent') : t('res.held')} />
        <Txt color="muted" style={{ marginBottom: 16 }}>{done ? t('res.callSentHint') : t('res.callHint')}</Txt>
        {done ? <Button label={t('nav.bookings')} onPress={() => { router.dismissAll(); router.navigate('/bookings'); }} /> : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {slots().map(x => <Chip key={+x} label={x.toLocaleString(lang, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} onPress={() => book(x)} />)}
          </View>
        )}
        {err ? <Txt color="danger" size={14} style={{ marginTop: 12 }}>{err}</Txt> : null}
      </Screen>
    );
  }

  return (
    <Screen bottom={90}>
      <Header close title={t('res.title')} />
      {towers.length > 1 ? <><Txt weight="semibold" style={{ marginBottom: 8 }}>{t('res.tower')}</Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>{towers.map(x => <Chip key={x} label={x} on={x === activeTower} onPress={() => setTower(x)} />)}</View></> : null}
      <Txt weight="semibold" style={{ marginBottom: 8 }}>{t('res.unit')}</Txt>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>{inTower.map(u => <Chip key={u.id} label={`${u.id} · ${u.sqm} m²`} on={u.id === unit.id} onPress={() => setUnitId(u.id)} />)}</View>
      {p.ownership.length > 1 ? <><Txt weight="semibold" style={{ marginBottom: 8 }}>{t('res.ownership')}</Txt>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>{p.ownership.map(o => <Chip key={o} label={t(`own.${o}`)} on={o === own} onPress={() => setOwn(o)} />)}</View></> : null}
      <Txt size={30} weight="heavy" style={{ marginVertical: 6 }}>{thb(unit.price)}</Txt>
      {quote ? <QuoteTable quote={quote} /> : null}
      <View style={{ marginTop: 20, gap: 10 }}>
        {session ? <Button label={busy ? t('res.reserving') : t('res.cta')} onPress={reserve} loading={busy} /> : <Button label={t('auth.signIn')} onPress={() => router.push('/auth')} />}
        {!session ? <Txt color="muted" size={14}>{t('res.signInFirst')}</Txt> : null}
        {err ? <Txt color="danger" size={14}>{err}</Txt> : null}
      </View>
    </Screen>
  );
}
