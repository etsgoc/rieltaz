import { useEffect, useState } from 'react';
import type { Order } from '@core';
import { db } from '@/lib/supabase';
import { ORDER_STATUSES, label } from '@/lib/stages';
import OrderCard from '@/components/orders/OrderCard';
import Dropdown from '@/components/ui/Dropdown';
import EmptyState from '@/components/ui/EmptyState';

export default function Orders() {
  const [rows, setRows] = useState<Order[] | null>(null);
  const [names, setNames] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState('all');

  async function load() {
    const { data } = await db.from('service_orders').select('*').order('created_at', { ascending: false });
    const list = (data as Order[]) ?? [];
    setRows(list);
    const ids = [...new Set(list.map(o => o.user_id))];
    if (ids.length) {
      const { data: ps } = await db.from('profiles').select('id, full_name, email').in('id', ids);
      setNames(Object.fromEntries(((ps as { id: string; full_name: string | null; email: string | null }[]) ?? []).map(p => [p.id, [p.full_name, p.email].filter(Boolean).join(' · ')])));
    }
  }
  useEffect(() => { load(); }, []);
  const shown = rows?.filter(o => filter === 'all' || o.status === filter);

  return (
    <>
      <div className="page-head"><h1>Service orders</h1>
        <Dropdown label="Status" value={filter} onChange={setFilter} options={[{ value: 'all', label: 'All statuses' }, ...ORDER_STATUSES.map(s => ({ value: s, label: label(s) }))]} />
      </div>
      <div className="list">
        {shown?.map(o => <OrderCard key={o.id} o={o} who={names[o.user_id]} onSaved={load} />)}
        {shown && !shown.length && <EmptyState title="No orders here" />}
      </div>
    </>
  );
}
