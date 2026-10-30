import { useEffect, useState } from 'react';
import { db } from '@/lib/supabase';
import { STAGES, label } from '@/lib/stages';
import DealCard, { type Deal, type Person } from '@/components/deals/DealCard';
import Dropdown from '@/components/ui/Dropdown';
import EmptyState from '@/components/ui/EmptyState';

export default function Deals() {
  const [rows, setRows] = useState<Deal[] | null>(null);
  const [people, setPeople] = useState<Record<string, Person>>({});
  const [filter, setFilter] = useState('all');

  async function load() {
    const { data } = await db.from('reservations').select('*').order('created_at', { ascending: false });
    const list = (data as Deal[]) ?? [];
    setRows(list);
    const ids = [...new Set(list.map(r => r.user_id))];
    if (ids.length) {
      const { data: ps } = await db.from('profiles').select('id, full_name, email, phone').in('id', ids);
      setPeople(Object.fromEntries(((ps as Person[]) ?? []).map(p => [p.id, p])));
    }
  }
  useEffect(() => { load(); }, []);
  const shown = rows?.filter(r => filter === 'all' || r.stage === filter);

  return (
    <>
      <div className="page-head"><h1>Property deals</h1>
        <Dropdown label="Stage" value={filter} onChange={setFilter} options={[{ value: 'all', label: 'All stages' }, ...STAGES.map(s => ({ value: s, label: label(s) }))]} />
      </div>
      <div className="list">
        {shown?.map(r => <DealCard key={r.id} r={r} person={people[r.user_id]} onSaved={load} />)}
        {shown && !shown.length && <EmptyState title="No deals here" />}
      </div>
    </>
  );
}
