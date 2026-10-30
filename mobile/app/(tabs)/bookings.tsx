import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import type { Order } from '@core';
import { useI18n } from '@/i18n/I18nProvider';
import { db } from '@/lib/supabase';
import { useCatalog } from '@/providers/CatalogProvider';
import { useSession } from '@/providers/SessionProvider';
import { useTheme } from '@/theme/ThemeProvider';
import ReservationCard, { type PaymentRow, type Reservation } from '@/components/property/ReservationCard';
import OrderTicket from '@/components/services/OrderTicket';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import TabScreen from '@/components/ui/TabScreen';
import Segmented from '@/components/ui/Segmented';
import Txt from '@/components/ui/Txt';

export default function Bookings() {
  const router = useRouter();
  const { colors } = useTheme();
  const { cat, features } = useCatalog();
  const { session } = useSession();
  const { t } = useI18n();
  const [tab, setTab] = useState<'reservations' | 'orders'>('reservations');
  const [rows, setRows] = useState<Reservation[] | null>(null);
  const [pay, setPay] = useState<PaymentRow[]>([]);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!session) return;
    const [a, b, c] = await Promise.all([
      db.from('reservations').select('*').order('created_at', { ascending: false }),
      db.from('payments').select('reservation_id, amount, paid_at'),
      db.from('service_orders').select('*').order('created_at', { ascending: false }),
    ]);
    setRows((a.data as Reservation[]) ?? []); setPay((b.data as PaymentRow[]) ?? []); setOrders((c.data as Order[]) ?? []);
  }, [session]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const refresh = (
    <RefreshControl refreshing={refreshing} tintColor={colors.accent} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />
  );

  if (!session) {
    return (
      <TabScreen title={t('nav.bookings')}>
        <EmptyState title={t('res.signInFirst')}><Button label={t('auth.signIn')} onPress={() => router.push('/auth')} /></EmptyState>
      </TabScreen>
    );
  }
  return (
    <TabScreen title={t('nav.bookings')} refreshControl={refresh}
      extra={features.services ? <Segmented value={tab} onChange={setTab} options={[{ value: 'reservations', label: t('bookings.title') }, { value: 'orders', label: t('orders.title') }]} /> : undefined}>
      <View style={{ gap: 14 }}>
        {tab === 'reservations'
          ? (rows?.length ? rows.map(r => <ReservationCard key={r.id} r={r} projectName={cat.projects.find(p => p.id === r.project_id)?.name ?? r.project_id} payments={pay.filter(p => p.reservation_id === r.id)} />)
            : rows && <EmptyState title={t('bookings.empty')}><Button variant="soft" label={t('nav.browse')} onPress={() => router.navigate('/')} compact /></EmptyState>)
          : (orders?.length ? orders.map(o => <OrderTicket key={o.id} o={o} />)
            : orders && <EmptyState title={t('orders.empty')}><Button variant="soft" label={t('nav.services')} onPress={() => router.navigate('/services')} compact /></EmptyState>)}
      </View>
    </TabScreen>
  );
}
