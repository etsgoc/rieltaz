import { useMemo, useState } from 'react';
import { buildQuote } from '@core';
import type { Ownership, Project, Unit } from '@core';
import { useCatalog } from '@/providers/CatalogProvider';
import { useI18n } from '@/providers/I18nProvider';
import { useSession } from '@/providers/SessionProvider';
import { db } from '@/lib/supabase';
import { thb } from '@/lib/format';
import AuthForm from '../auth/AuthForm';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import { Field, Input } from '../ui/Field';
import QuoteTable from './QuoteTable';

export default function ReservePanel({ p, units }: { p: Project; units: Unit[] }) {
  const { cat } = useCatalog();
  const { t } = useI18n();
  const { session } = useSession();
  const towers = [...new Set(units.map(u => u.tower))];
  const [tower, setTower] = useState(towers[0]);
  const [unitId, setUnitId] = useState('');
  const [own, setOwn] = useState<Ownership>(p.ownership[0]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [rid, setRid] = useState('');
  const [when, setWhen] = useState('');
  const [booked, setBooked] = useState(false);

  const inTower = units.filter(u => u.tower === tower);
  const unit = inTower.find(u => u.id === unitId) ?? inTower[0] ?? units[0];
  const quote = useMemo(() => { try { return buildQuote(cat, unit, own); } catch { return null; } }, [cat, unit, own]);

  async function reserve() {
    if (!session || !quote) return;
    setBusy(true); setErr('');
    const { data, error } = await db.from('reservations').insert({
      user_id: session.user.id, project_id: p.id, unit_id: unit.id, ownership: own, quoted_price: unit.price,
    }).select('id').single();
    setBusy(false);
    if (error) setErr(error.code === '23505' ? t('res.taken') : error.message);
    else setRid(data.id);
  }
  async function book() {
    setBusy(true); setErr('');
    const { error } = await db.rpc('book_meeting', { rid, at: new Date(when).toISOString() });
    setBusy(false);
    if (error) setErr(error.message); else setBooked(true);
  }

  if (rid) {
    return (
      <div className="stack">
        <h3>{booked ? t('res.callSent') : t('res.held')}</h3>
        {booked ? <p className="muted">{t('res.callSentHint')}</p> : <>
          <p className="muted">{t('res.callHint')}</p>
          <Field label={t('res.pickTime')}><Input type="datetime-local" value={when} min={new Date().toISOString().slice(0, 16)} onChange={e => setWhen(e.target.value)} /></Field>
          <Button block disabled={!when || busy} onClick={book}>{t('res.requestCall')}</Button>
        </>}
        {err && <p className="err">{err}</p>}
      </div>
    );
  }

  return (
    <div className="stack">
      <h3>{t('res.title')}</h3>
      {towers.length > 1 && <Dropdown label={t('res.tower')} value={tower} onChange={setTower} options={towers.map(x => ({ value: x, label: x }))} />}
      <Dropdown label={t('res.unit')} value={unit.id} onChange={setUnitId}
        options={inTower.map(u => ({ value: u.id, label: `${u.id} · ${u.type} · ${u.sqm} m²` }))} />
      {p.ownership.length > 1 && <Dropdown label={t('res.ownership')} value={own} onChange={setOwn}
        options={p.ownership.map(o => ({ value: o, label: t(`own.${o}`) }))} />}
      <div className="big-price">{thb(unit.price)}</div>
      {quote && <QuoteTable quote={quote} />}
      {session
        ? <Button block disabled={busy || !quote} onClick={reserve}>{busy ? t('res.reserving') : t('res.cta')}</Button>
        : <><p className="muted">{t('res.signInFirst')}</p><AuthForm compact /></>}
      {err && <p className="err">{err}</p>}
    </div>
  );
}
