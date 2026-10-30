import { useEffect, useState } from 'react';
import { useSession } from '@/providers/SessionProvider';
import { useI18n } from '@/providers/I18nProvider';
import { useCatalog } from '@/providers/CatalogProvider';
import { db } from '@/lib/supabase';
import type { Order } from '@core';
import AuthForm from '@/components/auth/AuthForm';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ReservationCard, { type PaymentRow, type Reservation } from '@/components/property/ReservationCard';
import OrderTicket from '@/components/services/OrderTicket';
import { usePageMeta } from '@/lib/meta';

export default function Account() {
  const { session, ready } = useSession();
  const { t } = useI18n();
  const { cat, features } = useCatalog();
  const [tab, setTab] = useState<'reservations' | 'orders'>('reservations');
  usePageMeta(t('nav.account'));
  const [rows, setRows] = useState<Reservation[] | null>(null);
  const [pay, setPay] = useState<PaymentRow[]>([]);
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!session) return;
    db.from('reservations').select('*').order('created_at', { ascending: false }).then(({ data }) => setRows((data as Reservation[]) ?? []));
    db.from('payments').select('reservation_id, amount, paid_at').then(({ data }) => setPay((data as PaymentRow[]) ?? []));
    db.from('service_orders').select('*').order('created_at', { ascending: false }).then(({ data }) => setOrders((data as Order[]) ?? []));
  }, [session]);

  if (!ready) return null;
  if (!session) return <div className="wrap section narrow"><div className="panel"><AuthForm /></div></div>;

  return (
    <div className="wrap section">
      <div className="section-head">
        <div><h1>{t('nav.account')}</h1><p className="muted">{session.user.email}</p></div>
        <Button variant="soft" onClick={() => db.auth.signOut()}>{t('common.signOut')}</Button>
      </div>
      <div className="seg tabs">
        <button className={tab === 'reservations' ? 'on' : ''} onClick={() => setTab('reservations')}>{t('bookings.title')}</button>
        {features.services && <button className={tab === 'orders' ? 'on' : ''} onClick={() => setTab('orders')}>{t('orders.title')}</button>}
      </div>
      {tab === 'reservations' && (rows?.length
        ? <div className="grid">{rows.map(r => <ReservationCard key={r.id} r={r} projectName={cat.projects.find(p => p.id === r.project_id)?.name ?? r.project_id} payments={pay.filter(p => p.reservation_id === r.id)} />)}</div>
        : rows && <EmptyState title={t('bookings.empty')}><Button to="/properties" variant="soft">{t('nav.browse')}</Button></EmptyState>)}
      {tab === 'orders' && (orders?.length
        ? <div className="grid">{orders.map(o => <OrderTicket key={o.id} o={o} />)}</div>
        : orders && <EmptyState title={t('orders.empty')}><Button to="/services" variant="soft">{t('nav.services')}</Button></EmptyState>)}
    </div>
  );
}
