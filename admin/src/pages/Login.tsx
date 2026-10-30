import { useState } from 'react';
import { db, hasBackend } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import Logo from '@/components/ui/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  async function go(e: React.FormEvent) {
    e.preventDefault();
    if (!hasBackend) { setErr('Add the Supabase keys to .env first.'); return; }
    const { error } = await db.auth.signInWithPassword({ email, password: pass });
    if (error) setErr(error.message);
  }
  return (
    <div className="login">
      <form className="panel stack" onSubmit={go}>
        <Logo />
        <h2>Sign in</h2>
        <Field label="Email"><Input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" /></Field>
        <Field label="Password"><Input type="password" value={pass} onChange={e => setPass(e.target.value)} required autoComplete="current-password" /></Field>
        <Button type="submit" block>Sign in</Button>
        {err && <p className="err">{err}</p>}
      </form>
    </div>
  );
}
