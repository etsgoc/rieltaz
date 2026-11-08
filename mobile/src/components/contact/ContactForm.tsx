import { useState } from 'react';
import { Linking, View } from 'react-native';
import { inquirySubject, inquiryText, mailHref } from '@core';
import type { InquiryContext } from '@core';
import { useI18n } from '@/i18n/I18nProvider';
import { useCatalog } from '@/providers/CatalogProvider';
import Button from '../ui/Button';
import Field from '../ui/Field';
import Txt from '../ui/Txt';

/** Posts to `contact.formEndpoint` when set (Formspree, Web3Forms), otherwise opens the email app with the message written. */
export default function ContactForm({ ctx }: { ctx?: InquiryContext }) {
  const { cat } = useCatalog();
  const { t } = useI18n();
  const c = cat.contact;
  const [f, setF] = useState({ name: '', email: '', phone: '', note: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'mail' | 'fail'>('idle');

  async function send() {
    const body = inquiryText({ ...ctx, name: f.name || undefined, note: f.note || undefined }) + (f.phone ? `\n\nPhone: ${f.phone}` : '') + (f.email ? `\nEmail: ${f.email}` : '');
    if (c?.formEndpoint) {
      setState('sending');
      try {
        const res = await fetch(c.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...(c.formKey ? { access_key: c.formKey } : {}), subject: inquirySubject(ctx ?? {}), name: f.name, email: f.email, phone: f.phone, message: body }) });
        setState(res.ok ? 'sent' : 'fail');
      } catch { setState('fail'); }
      return;
    }
    if (c?.email) { Linking.openURL(mailHref(c.email, inquirySubject(ctx ?? {}), body)).catch(() => setState('fail')); setState('mail'); }
  }
  if (state === 'sent') return <Txt color="ok">{t('inq.sent')}</Txt>;
  return (
    <View style={{ gap: 14 }}>
      <Field label={t('contact.name')} value={f.name} onChangeText={v => setF({ ...f, name: v })} />
      <Field label={t('contact.email')} value={f.email} onChangeText={v => setF({ ...f, email: v })} autoCapitalize="none" keyboardType="email-address" />
      <Field label={t('inq.phone')} value={f.phone} onChangeText={v => setF({ ...f, phone: v })} keyboardType="phone-pad" />
      <Field label={t('contact.message')} value={f.note} onChangeText={v => setF({ ...f, note: v })} multiline />
      <Button label={t('inq.send')} onPress={send} loading={state === 'sending'} disabled={!f.email || !f.name} />
      {state === 'mail' ? <Txt size={14} color="muted">{t('inq.opening', { email: c?.email ?? '' })}</Txt> : null}
      {state === 'fail' ? <Txt size={14} color="danger">{t('contact.failed')}</Txt> : null}
    </View>
  );
}
