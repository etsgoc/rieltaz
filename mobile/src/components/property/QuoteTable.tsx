import { View } from 'react-native';
import type { buildQuote } from '@core';
import { useI18n } from '@/i18n/I18nProvider';
import { thb } from '@/lib/format';
import { useTheme } from '@/theme/ThemeProvider';
import Txt from '../ui/Txt';

type Quote = ReturnType<typeof buildQuote>;

function Row({ a, b }: { a: string; b: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 14, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: colors.line }}>
      <Txt size={14.5} style={{ flex: 1 }}>{a}</Txt><Txt size={14.5} weight="semibold">{b}</Txt>
    </View>
  );
}

export default function QuoteTable({ quote }: { quote: Quote }) {
  const { t } = useI18n();
  const a = quote.additional;
  return (
    <View>
      <Txt size={14} weight="semibold" color="muted" style={{ marginTop: 6 }}>{t('res.schedule')}</Txt>
      <Row a={t('res.fee')} b={thb(quote.reservationFee)} />
      {quote.schedule.map(s => <Row key={s.label} a={s.label} b={thb(s.amount)} />)}
      <Txt size={14} weight="semibold" color="muted" style={{ marginTop: 16 }}>{t('res.afterCompletion')}</Txt>
      <Row a={t('res.commonArea')} b={thb(a.commonArea)} />
      <Row a={t('res.sinking')} b={thb(a.sinkingFund)} />
      <Row a={t('res.meters')} b={thb(a.meters)} />
      {a.admin > 0 ? <Row a={t('res.setup')} b={thb(a.admin)} /> : null}
      <Row a={t('res.transfer')} b={thb(a.transferEstimate)} />
      <Txt size={13} color="muted" style={{ marginTop: 10 }}>{t('res.refundNote')}</Txt>
    </View>
  );
}
