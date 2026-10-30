import { useEffect, useState } from 'react';
import { db } from '@/lib/supabase';
import { dateTime } from '@/lib/format';
import EmptyState from '@/components/ui/EmptyState';

interface Msg { id: string; name: string | null; email: string | null; body: string; created_at: string }

export default function Messages() {
  const [msgs, setMsgs] = useState<Msg[] | null>(null);
  useEffect(() => { db.from('messages').select('*').order('created_at', { ascending: false }).then(({ data }) => setMsgs((data as Msg[]) ?? [])); }, []);
  return (
    <>
      <h1>Messages</h1>
      <div className="list">
        {msgs?.map(m => (
          <article className="panel stack" key={m.id}>
            <div><strong>{m.name || 'Unknown'}</strong> <a className="muted" href={`mailto:${m.email}`}>{m.email}</a></div>
            <p style={{ whiteSpace: 'pre-wrap' }}>{m.body}</p>
            <p className="muted small">{dateTime(m.created_at)}</p>
          </article>
        ))}
        {msgs && !msgs.length && <EmptyState title="No messages yet" />}
      </div>
    </>
  );
}
