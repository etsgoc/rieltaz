import { Video } from 'lucide-react-native';
import { Linking, View } from 'react-native';
import { useI18n } from '@/i18n/I18nProvider';
import { dateTime, thb } from '@/lib/format';
import { useTheme } from '@/theme/ThemeProvider';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Chip from '../ui/Chip';
import Txt from '../ui/Txt';

export interface Reservation { id: string; project_id: string; unit_id: string; ownership: string; quoted_price: number; stage: string; meeting_at: string | null; meet_link: string | null }
export interface PaymentRow { reservation_id: string; amount: number; paid_at: string | null }

export default function ReservationCard({ r, payments, projectName }: { r: Reservation; payments: PaymentRow[]; projectName: string }) {
  const { t, lang } = useI18n();
  const { colors } = useTheme();
  const total = payments.reduce((a, p) => a + Number(p.amount), 0);
  const paid = payments.filter(p => p.paid_at).reduce((a, p) => a + Number(p.amount), 0);
  return (
    <Card style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Txt size={18} weight="bold">{r.unit_id}</Txt>
          <Txt size={14} color="muted">{projectName} · {t(`own.${r.ownership as 'leasehold' | 'freehold'}`)}</Txt>
        </View>
        <Chip tone={r.stage === 'cancelled' ? 'warn' : 'accent'} label={t(`stage.${r.stage}` as 'stage.requested')} />
      </View>
      <Txt weight="bold">{thb(r.quoted_price)}</Txt>
      {total > 0 ? (
        <View style={{ gap: 6 }}>
          <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.surface2, overflow: 'hidden' }}>
            <View style={{ height: 8, width: `${Math.round((paid / total) * 100)}%`, backgroundColor: colors.ok }} />
          </View>
          <Txt size={13} color="muted">{t('bookings.paid')}: {thb(paid)} / {thb(total)}</Txt>
        </View>
      ) : null}
      <Txt size={14} color="muted">{t('bookings.meeting')}: {r.meeting_at ? dateTime(r.meeting_at, lang) : t('bookings.noMeeting')}</Txt>
      {r.meet_link ? <Button label={t('bookings.join')} icon={<Video size={16} color={colors.accentInk} />} onPress={() => Linking.openURL(r.meet_link!)} /> : null}
    </Card>
  );
}
