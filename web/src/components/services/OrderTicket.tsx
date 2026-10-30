import { CreditCard, Ticket } from 'lucide-react';
import { noPayments } from '@core';
import type { Order } from '@core';
import { useI18n } from '@/providers/I18nProvider';
import { useCatalog } from '@/providers/CatalogProvider';
import { dateTime, shortDate, thb } from '@/lib/format';
import { useState } from 'react';
import Button from '../ui/Button';
import Chip from '../ui/Chip';

export default function OrderTicket({ o }: { o: Order }) {
  const { t, lang } = useI18n();
  const { features } = useCatalog();
  const [note, setNote] = useState('');
  const amount = o.final_amount ?? o.quoted_amount;
  const payable = ['quoted', 'confirmed'].includes(o.status) && o.final_amount != null;

  async function pay() {
    if (!features.onlinePayments) { setNote(t('orders.payUnavailable')); return; }
    try {
      const s = await noPayments.createCheckout(o, location.href);
      location.href = s.url;
    } catch { setNote(t('orders.payUnavailable')); }
  }
  const tone = o.status === 'completed' || o.status === 'paid' ? 'ok' : o.status === 'cancelled' ? 'warn' : 'accent';
  return (
    <article className="panel ticket">
      <div className="ticket-top">
        <div>
          <h3>{o.service_title}</h3>
          <p className="muted">{[o.option_label, o.details.date && shortDate(o.details.date, lang), o.details.people && `${o.details.people}×`].filter(Boolean).join(' · ')}</p>
        </div>
        <Chip tone={tone}>{t(`orders.status.${o.status}`)}</Chip>
      </div>
      {o.ticket_code && (
        <div className="ticket-code"><Ticket size={18} /><span>{t('orders.ticketCode')}</span><strong>{o.ticket_code}</strong></div>
      )}
      <div className="ticket-bottom">
        <span className="muted">{dateTime(o.created_at, lang)}</span>
        {amount != null && <strong>{thb(amount, o.currency)}</strong>}
      </div>
      {payable && <Button variant="soft" icon={<CreditCard size={16} />} onClick={pay}>{t('orders.pay')}</Button>}
      {note && <p className="muted small">{note}</p>}
    </article>
  );
}
