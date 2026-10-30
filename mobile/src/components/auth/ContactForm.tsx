import { useState } from 'react';
import { View } from 'react-native';
import { useI18n } from '@/i18n/I18nProvider';
import { db } from '@/lib/supabase';
import Button from '../ui/Button';
import Field from '../ui/Field';
import Txt from '../ui/Txt';

export default function ContactForm({ subject }: { subject?: string }) {
  const { t } = useI18n();
  const [f, setF] = useState({ name: '', email: '', body: subject ? `${subject}: ` : '' });
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'fail'>('idle');
  async function send() {
    setState('sending');
    const { error } = await db.from('messages').insert(f);
    setState(error ? 'fail' : 'sent');
  }
  if (state === 'sent') return <Txt color="muted">{t('contact.thanks')}</Txt>;
  return (
    <View style={{ gap: 14 }}>
      <Field label={t('contact.name')} value={f.name} onChangeText={v => setF({ ...f, name: v })} />
      <Field label={t('contact.email')} value={f.email} onChangeText={v => setF({ ...f, email: v })} autoCapitalize="none" keyboardType="email-address" />
      <Field label={t('contact.message')} value={f.body} onChangeText={v => setF({ ...f, body: v })} multiline />
      <Button label={t('contact.send')} onPress={send} loading={state === 'sending'} disabled={!f.email || !f.body} />
      {state === 'fail' ? <Txt color="danger" size={14}>{t('contact.failed')}</Txt> : null}
    </View>
  );
}
