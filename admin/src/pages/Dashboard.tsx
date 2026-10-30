import { useEffect, useState } from 'react';
import { CalendarClock, HandCoins, Inbox, ShoppingBag } from 'lucide-react';
import { db } from '@/lib/supabase';
import { thb } from '@/lib/format';
import StatCard from '@/components/ui/StatCard';

interface Stats { newDeals: number; calls: number; openOrders: number; messages: number; platformRevenue: number }

export default function Dashboard() {
  const [s, setS] = useState<Stats | null>(null);
  useEffect(() => {
    (async () => {
      const [d, c, o, m, rev] = await Promise.all([
        db.from('reservations').select('id', { count: 'exact', head: true }).eq('stage', 'requested'),
        db.from('reservations').select('id', { count: 'exact', head: true }).eq('stage', 'meeting_booked'),
        db.from('service_orders').select('id', { count: 'exact', head: true }).in('status', ['requested', 'quoted']),
        db.from('messages').select('id', { count: 'exact', head: true }),
        db.from('service_orders').select('platform_fee').in('status', ['paid', 'completed']),
      ]);
      setS({
        newDeals: d.count ?? 0, calls: c.count ?? 0, openOrders: o.count ?? 0, messages: m.count ?? 0,
        platformRevenue: ((rev.data as { platform_fee: number | null }[]) ?? []).reduce((a, r) => a + Number(r.platform_fee ?? 0), 0),
      });
    })();
  }, []);
  return (
    <>
      <h1>Overview</h1>
      <div className="stats-grid">
        <StatCard label="New property requests" value={s?.newDeals ?? '–'} icon={<Inbox size={18} />} />
        <StatCard label="Calls to confirm" value={s?.calls ?? '–'} icon={<CalendarClock size={18} />} />
        <StatCard label="Open service orders" value={s?.openOrders ?? '–'} icon={<ShoppingBag size={18} />} />
        <StatCard label="Your service revenue" value={s ? thb(s.platformRevenue) : '–'} hint="Paid and completed orders" icon={<HandCoins size={18} />} />
        <StatCard label="Messages received" value={s?.messages ?? '–'} />
      </div>
    </>
  );
}
