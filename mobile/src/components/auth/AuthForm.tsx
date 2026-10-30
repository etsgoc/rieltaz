import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useI18n } from '@/i18n/I18nProvider';
import { db, hasBackend } from '@/lib/supabase';
import Button from '../ui/Button';
import Field from '../ui/Field';
import Txt from '../ui/Txt';

export default function AuthForm({ onDone }: { onDone?: () => void }) {
  const { t } = useI18n();
  const router = useRouter();
  const [agree, setAgree] = useState(false);
  const [up, setUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (up && !agree) { setErr(t('auth.agree')); return; }
    if (!hasBackend) { setErr('Accounts are not configured. Add the Supabase keys to .env.'); return; }
    setBusy(true); setErr(''); setNote('');
    const res = up
      ? await db.auth.signUp({ email: email.trim(), password: pass, options: { data: { full_name: name } } })
      : await db.auth.signInWithPassword({ email: email.trim(), password: pass });
    setBusy(false);
    if (res.error) setErr(res.error.message);
    else if (up && !res.data.session) setNote(t('auth.checkEmail'));
    else onDone?.();
  }
  return (
    <View style={{ gap: 14 }}>
      <Txt size={28} weight="heavy">{up ? t('auth.titleUp') : t('auth.titleIn')}</Txt>
      <Txt color="muted">{t('auth.subtitle')}</Txt>
      {up && <Field label={t('auth.name')} value={name} onChangeText={setName} autoComplete="name" />}
      <Field label={t('auth.email')} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
      <Field label={t('auth.password')} value={pass} onChangeText={setPass} secureTextEntry autoComplete={up ? 'new-password' : 'current-password'} />
      {up ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Pressable onPress={() => setAgree(!agree)} style={{ width: 24, height: 24, borderRadius: 7, borderWidth: 2, borderColor: agree ? '#2C58D6' : '#9A9A9A', backgroundColor: agree ? '#2C58D6' : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
            {agree ? <Txt size={14} weight="bold" style={{ color: '#fff', lineHeight: 16 }}>✓</Txt> : null}
          </Pressable>
          <Txt size={13} color="muted" style={{ flex: 1 }}>
            {t('auth.agree')}{' '}
            <Txt size={13} color="accent" onPress={() => router.push('/legal/terms')}>{t('legal.terms')}</Txt>{' · '}
            <Txt size={13} color="accent" onPress={() => router.push('/legal/privacy')}>{t('legal.privacy')}</Txt>
          </Txt>
        </View>
      ) : null}
      <Button label={up ? t('auth.signUp') : t('auth.signIn')} onPress={submit} loading={busy} disabled={!email || pass.length < 6} />
      <Button label={up ? t('auth.haveAccount') : t('auth.noAccount')} variant="ghost" onPress={() => setUp(!up)} />
      {err ? <Txt color="danger" size={14}>{err}</Txt> : null}
      {note ? <Txt color="muted" size={14}>{note}</Txt> : null}
    </View>
  );
}
