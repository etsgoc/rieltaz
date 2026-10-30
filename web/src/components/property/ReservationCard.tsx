import { Video } from 'lucide-react';
import { useI18n } from '@/providers/I18nProvider';
import { dateTime, thb } from '@/lib/format';
import Button from '../ui/Button';
import Chip from '../ui/Chip';

export interface Reservation {
  id: string; project_id: string; unit_id: string; ownership: string; quoted_price: number; stage: string;
  meeting_at: string | null; meet_link: string | null;
}
export interface PaymentRow { reservation_id: string; amount: number; paid_at: string | null }

export default function ReservationCard({ r, payments, projectName }: { r: Reservation; payments: PaymentRow[]; projectName: string }) {
  const { t, lang } = useI18n();
  const total = payments.reduce((a, p) => a + Number(p.amount), 0);
  const paid = payments.filter(p => p.paid_at).reduce((a, p) => a + Number(p.amount), 0);
  const pct = total ? Math.round((paid / total) * 100) : 0;
  return (
    <article className="panel stack">
      <div className="ticket-top">
        <div><h3>{r.unit_id}</h3><p className="muted">{projectName} · {t(`own.${r.ownership as 'leasehold' | 'freehold'}`)}</p></div>
        <Chip tone={r.stage === 'cancelled' ? 'warn' : 'accent'}>{t(`stage.${r.stage}` as 'stage.requested')}</Chip>
      </div>
      <strong>{thb(r.quoted_price)}</strong>
      {total > 0 && (
        <div>
          <div className="progress"><span style={{ width: `${pct}%` }} /></div>
          <p className="muted small">{t('bookings.paid')}: {thb(paid)} / {thb(total)}</p>
        </div>
      )}
      <p className="muted">{t('bookings.meeting')}: {r.meeting_at ? dateTime(r.meeting_at, lang) : t('bookings.noMeeting')}</p>
      {r.meet_link && <Button href={r.meet_link} icon={<Video size={16} />}>{t('bookings.join')}</Button>}
    </article>
  );
}
