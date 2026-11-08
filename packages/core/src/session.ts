import type { KV } from './catalog';

interface AuthClient<S> { auth: { getSession(): Promise<{ data: { session: S | null } }>; signOut(): Promise<unknown> } }

/** Used by the admin app only. The public website and the mobile app have no sign in. */
export async function resolveSession<S extends { expires_at?: number }>(store: KV, db: AuthClient<S>): Promise<S | null> {
  const raw = await store.get('session');
  if (raw) {
    const s = JSON.parse(raw) as S;
    if ((s.expires_at ?? 0) * 1000 > Date.now() + 60_000) return s;
  }
  const { data } = await db.auth.getSession();
  await store.set('session', data.session ? JSON.stringify(data.session) : '');
  return data.session;
}

export async function clearSession<S>(store: KV, db: AuthClient<S>) {
  await store.set('session', '');
  await db.auth.signOut();
}
