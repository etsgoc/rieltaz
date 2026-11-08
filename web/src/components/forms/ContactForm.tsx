import { useState } from 'react';
import { inquirySubject, inquiryText, mailHref } from '@core';
import type { InquiryContext } from '@core';
import { useCatalog } from '@/providers/CatalogProvider';
import { useI18n } from '@/providers/I18nProvider';
import Button from '../ui/Button';
import { Field, Input, Textarea } from '../ui/Field';

/**
 * Enquiry form without a backend. With `contact.formEndpoint` set in properties.json (Formspree or Web3Forms, both free)
 * it posts there. Otherwise it opens the visitor's email app with the message already written.
 */
export default function ContactForm({ ctx, compact }: { ctx?: InquiryContext; compact?: boolean }) {
  const { cat } = useCatalog();
  const { t } = useI18n();
  const c = cat.contact;
  const [f, setF] = useState({ name: '', email: '', phone: '', note: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'mail' | 'fail'>('idle');
  const about = [ctx?.property, ctx?.unit, ctx?.service].filter(Boolean).join(' · ');

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const context = { ...ctx, name: f.name || undefined, note: f.note || undefined };
    const body = inquiryText(context) + (f.phone ? `\n\nPhone: ${f.phone}` : '') + (f.email ? `\nEmail: ${f.email}` : '');
    if (c?.formEndpoint) {
      setState('sending');
      try {
        const res = await fetch(c.formEndpoint, {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...(c.formKey ? { access_key: c.formKey } : {}), subject: inquirySubject(ctx ?? {}), name: f.name, email: f.email, phone: f.phone, message: body }),
        });
        setState(res.ok ? 'sent' : 'fail');
      } catch { setState('fail'); }
      return;
    }
    if (c?.email) { window.location.href = mailHref(c.email, inquirySubject(ctx ?? {}), body); setState('mail'); }
  }

  if (state === 'sent') return <p className="notice">{t('inq.sent')}</p>;
  return (
    <form className="stack" onSubmit={send}>
      {!compact && <h2>{t('inq.title')}</h2>}
      {about && <p className="muted small inq-about">{about}</p>}
      <Field label={t('contact.name')}><Input value={f.name} autoComplete="name" required onChange={e => setF({ ...f, name: e.target.value })} /></Field>
      <div className="form-two">
        <Field label={t('contact.email')}><Input type="email" autoComplete="email" required value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></Field>
        <Field label={t('inq.phone')}><Input type="tel" autoComplete="tel" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} /></Field>
      </div>
      <Field label={t('contact.message')}><Textarea rows={compact ? 3 : 4} value={f.note} onChange={e => setF({ ...f, note: e.target.value })} /></Field>
      <Button type="submit" block disabled={state === 'sending'}>{t('inq.send')}</Button>
      {state === 'mail' && <p className="muted small">{t('inq.opening', { email: c?.email ?? '' })}</p>}
      {state === 'fail' && <p className="err">{t('contact.failed')}</p>}
      <p className="muted small">{t('inq.consent')}</p>
    </form>
  );
}
