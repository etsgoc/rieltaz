import { useState } from 'react';
import { useI18n } from '@/providers/I18nProvider';
import { db, hasBackend } from '@/lib/supabase';
import Button from '../ui/Button';
import { Field, Input } from '../ui/Field';

export default function AuthForm({ compact }: { compact?: boolean }) {
  const { t } = useI18n();
  const [up, setUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasBackend) { setErr('Accounts are not configured. Add the Supabase keys to .env.'); return; }
    setBusy(true); setErr(''); setNote('');
    const res = up
      ? await db.auth.signUp({ email, password: pass, options: { data: { full_name: name } } })
      : await db.auth.signInWithPassword({ email, password: pass });
    setBusy(false);
    if (res.error) setErr(res.error.message);
    else if (up && !res.data.session) setNote(t('auth.checkEmail'));
  }

  return (
    <form className="stack" onSubmit={submit}>
      {!compact && <><h2>{up ? t('auth.titleUp') : t('auth.titleIn')}</h2><p className="muted">{t('auth.subtitle')}</p></>}
      {up && <Field label={t('auth.name')}><Input value={name} onChange={e => setName(e.target.value)} autoComplete="name" /></Field>}
      <Field label={t('auth.email')}><Input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required /></Field>
      <Field label={t('auth.password')}><Input type="password" minLength={6} value={pass} onChange={e => setPass(e.target.value)} autoComplete={up ? 'new-password' : 'current-password'} required /></Field>
      <Button type="submit" block disabled={busy}>{up ? t('auth.signUp') : t('auth.signIn')}</Button>
      <Button type="button" variant="ghost" block onClick={() => setUp(!up)}>{up ? t('auth.haveAccount') : t('auth.noAccount')}</Button>
      {err && <p className="err">{err}</p>}
      {note && <p className="muted">{note}</p>}
    </form>
  );
}
