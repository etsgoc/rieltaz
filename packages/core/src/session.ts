import type { SupabaseClient, Session } from '@supabase/supabase-js';
import type { KV } from './catalog';

export async function resolveSession(store: KV, db: SupabaseClient): Promise<Session | null> {
  const raw = await store.get('session');
  if (raw) {
    const s = JSON.parse(raw) as Session;
    if ((s.expires_at ?? 0) * 1000 > Date.now() + 60_000) return s;
  }
  const { data } = await db.auth.getSession();
  await store.set('session', data.session ? JSON.stringify(data.session) : '');
  return data.session;
}

export async function clearSession(store: KV, db: SupabaseClient) {
  await store.set('session', '');
  await db.auth.signOut();
}
