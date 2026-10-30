import { useState } from 'react';
import { useI18n } from '@/providers/I18nProvider';
import { db } from '@/lib/supabase';
import Button from '../ui/Button';
import { Field, Input, Textarea } from '../ui/Field';

export default function ContactForm({ subject, compact }: { subject?: string; compact?: boolean }) {
  const { t } = useI18n();
  const [f, setF] = useState({ name: '', email: '', body: subject ? `${subject}: ` : '' });
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'fail'>('idle');

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    const { error } = await db.from('messages').insert(f);
    setState(error ? 'fail' : 'sent');
  }
  if (state === 'sent') return <p className="muted">{t('contact.thanks')}</p>;
  return (
    <form className="stack" onSubmit={send}>
      {!compact && <h2>{t('contact.title')}</h2>}
      <Field label={t('contact.name')}><Input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></Field>
      <Field label={t('contact.email')}><Input type="email" required value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></Field>
      <Field label={t('contact.message')}><Textarea rows={4} required value={f.body} onChange={e => setF({ ...f, body: e.target.value })} /></Field>
      <Button type="submit" block disabled={state === 'sending'}>{t('contact.send')}</Button>
      {state === 'fail' && <p className="err">{t('contact.failed')}</p>}
    </form>
  );
}
