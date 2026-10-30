import { CreditCard, Ticket } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import type { Order } from '@core';
import { useI18n } from '@/i18n/I18nProvider';
import { dateTime, shortDate, thb } from '@/lib/format';
import { useCatalog } from '@/providers/CatalogProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/colors';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Chip from '../ui/Chip';
import Txt from '../ui/Txt';

export default function OrderTicket({ o }: { o: Order }) {
  const { t, lang } = useI18n();
  const { colors } = useTheme();
  const { features } = useCatalog();
  const [note, setNote] = useState('');
  const amount = o.final_amount ?? o.quoted_amount;
  const payable = ['quoted', 'confirmed'].includes(o.status) && o.final_amount != null;
  const tone = o.status === 'completed' || o.status === 'paid' ? 'ok' : o.status === 'cancelled' ? 'warn' : 'accent';
  const sub = [o.option_label, o.details.date && shortDate(o.details.date, lang), o.details.people && `${o.details.people}×`].filter(Boolean).join(' · ');
  return (
    <Card style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
        <View style={{ flex: 1 }}><Txt size={18} weight="bold">{o.service_title}</Txt>{sub ? <Txt size={14} color="muted">{sub}</Txt> : null}</View>
        <Chip tone={tone} label={t(`orders.status.${o.status}`)} />
      </View>
      {o.ticket_code ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: radius.button, backgroundColor: colors.accentSoft }}>
          <Ticket size={18} color={colors.accent} />
          <Txt size={14} color="accent" style={{ flex: 1 }}>{t('orders.ticketCode')}</Txt>
          <Txt weight="heavy" color="accent" style={{ letterSpacing: 1.5 }}>{o.ticket_code}</Txt>
        </View>
      ) : null}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Txt size={13} color="muted">{dateTime(o.created_at, lang)}</Txt>
        {amount != null ? <Txt weight="bold">{thb(amount, o.currency)}</Txt> : null}
      </View>
      {payable ? <Button variant="soft" label={t('orders.pay')} icon={<CreditCard size={16} color={colors.text} />} onPress={() => setNote(t('orders.payUnavailable'))} compact /> : null}
      {note && !features.onlinePayments ? <Txt size={13} color="muted">{note}</Txt> : null}
    </Card>
  );
}
