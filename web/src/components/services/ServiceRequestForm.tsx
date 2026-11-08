import { useState } from 'react';
import { estimate } from '@core';
import type { Service } from '@core';
import { useI18n } from '@/providers/I18nProvider';
import { thb } from '@/lib/format';
import ContactActions from '../contact/ContactActions';
import Dropdown from '../ui/Dropdown';
import { Field, Input, Textarea } from '../ui/Field';

/** Service request without accounts: the visitor fills in the details and sends them by call, WhatsApp or email. */
export default function ServiceRequestForm({ s }: { s: Service }) {
  const { t } = useI18n();
  const [option, setOption] = useState(s.options?.[0]?.id ?? '');
  const [date, setDate] = useState('');
  const [people, setPeople] = useState(1);
  const [notes, setNotes] = useState('');
  const total = estimate(s, option, people);
  const chosen = s.options?.find(o => o.id === option);
  const details = [
    chosen && `${t('svc.option')}: ${chosen.label}`,
    s.needsDate && date && `${t('svc.date')}: ${date}`,
    s.needsPeople && `${t('svc.people')}: ${people}`,
    total != null && `${t('svc.estimate')}: ${thb(total, s.currency)}`,
  ].filter(Boolean) as string[];

  return (
    <div className="stack">
      {s.image && <img className="sheet-img" src={s.image} alt="" />}
      <p className="muted">{s.blurb}</p>
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
      <p className="muted small">{t('svc.contactHint')}</p>
      <ContactActions layout="stack" ctx={{ service: s.title, details, note: notes || undefined }} />
    </div>
  );
}
