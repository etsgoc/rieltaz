import { useEffect, useState } from 'react';
import { useSession } from '@/providers/SessionProvider';
import { db } from '@/lib/supabase';

/** null while loading, then true or false. */
export function useIsAdmin() {
  const { session } = useSession();
  const [admin, setAdmin] = useState<boolean | null>(null);
  useEffect(() => {
    if (!session) { setAdmin(null); return; }
    db.from('profiles').select('role').eq('id', session.user.id).single().then(({ data }) => setAdmin(data?.role === 'admin'));
  }, [session]);
  return admin;
}
