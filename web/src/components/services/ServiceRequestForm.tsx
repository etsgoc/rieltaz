import { useState } from 'react';
import { Ticket } from 'lucide-react';
import { estimate } from '@core';
import type { Service } from '@core';
import { useI18n } from '@/providers/I18nProvider';
import { useSession } from '@/providers/SessionProvider';
import { db } from '@/lib/supabase';
import { thb } from '@/lib/format';
import AuthForm from '../auth/AuthForm';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import { Field, Input, Textarea } from '../ui/Field';
import { Link } from 'react-router-dom';

export default function ServiceRequestForm({ s }: { s: Service }) {
  const { t } = useI18n();
  const { session } = useSession();
  const [option, setOption] = useState(s.options?.[0]?.id ?? '');
  const [date, setDate] = useState('');
  const [people, setPeople] = useState(1);
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [sent, setSent] = useState(false);
  const total = estimate(s, option, people);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setBusy(true); setErr('');
    const { error } = await db.from('service_orders').insert({
      user_id: session.user.id, service_id: s.id, service_title: s.title,
      option_label: s.options?.find(o => o.id === option)?.label ?? null,
      quantity: s.needsPeople ? people : 1,
      details: { date: date || undefined, people: s.needsPeople ? people : undefined, notes: notes || undefined },
      quoted_amount: total, currency: s.currency ?? 'THB', partner_id: s.partnerId ?? null,
    });
    setBusy(false);
    if (error) setErr(error.message); else setSent(true);
  }

  if (sent) {
    return (
      <div className="stack">
        <h3><Ticket size={20} /> {t('svc.sent')}</h3>
        <p className="muted">{t('svc.sentHint')}</p>
        <Button to="/account" block>{t('nav.account')}</Button>
      </div>
    );
  }
  return (
    <div className="stack">
      {s.image && <img className="sheet-img" src={s.image} alt="" />}
      <p className="muted">{s.blurb}</p>
      {!session ? <><p>{t('svc.signInFirst')}</p><AuthForm compact /></> : (
        <form className="stack" onSubmit={submit}>
          {s.options && s.options.length > 0 && (
            <Dropdown label={t('svc.option')} value={option} onChange={setOption}
              options={s.options.map(o => ({ value: o.id, label: `${o.label} · ${thb(o.price, s.currency)}` }))} />
          )}
          {s.needsDate && <Field label={t('svc.date')}><Input type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={e => setDate(e.target.value)} /></Field>}
          {s.needsPeople && <Field label={t('svc.people')}><Input type="number" min={1} max={30} value={people} onChange={e => setPeople(Math.max(1, Number(e.target.value) || 1))} /></Field>}
          <Field label={t('svc.notes')}><Textarea rows={3} placeholder={t('svc.notesHint')} value={notes} onChange={e => setNotes(e.target.value)} /></Field>
          <div className="est">
            <span>{t('svc.estimate')}</span>
            <strong>{total != null ? thb(total, s.currency) : t('svc.quoteOnly')}</strong>
          </div>
          <Button type="submit" block disabled={busy}>{t('svc.request')}</Button>
          {err && <p className="err">{err}</p>}
          <Link className="muted small" to="/account">{t('orders.title')}</Link>
        </form>
      )}
    </div>
  );
}
