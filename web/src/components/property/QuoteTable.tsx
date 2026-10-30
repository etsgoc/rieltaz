import type { buildQuote } from '@core';
import { useI18n } from '@/providers/I18nProvider';
import { thb } from '@/lib/format';

type Quote = ReturnType<typeof buildQuote>;

export default function QuoteTable({ quote }: { quote: Quote }) {
  const { t } = useI18n();
  const a = quote.additional;
  return (
    <div className="quote">
      <h4>{t('res.schedule')}</h4>
      <table><tbody>
        <tr><td>{t('res.fee')}</td><td>{thb(quote.reservationFee)}</td></tr>
        {quote.schedule.map(s => <tr key={s.label}><td>{s.label}</td><td>{thb(s.amount)}</td></tr>)}
      </tbody></table>
      <h4>{t('res.afterCompletion')}</h4>
      <table><tbody>
        <tr><td>{t('res.commonArea')}</td><td>{thb(a.commonArea)}</td></tr>
        <tr><td>{t('res.sinking')}</td><td>{thb(a.sinkingFund)}</td></tr>
        <tr><td>{t('res.meters')}</td><td>{thb(a.meters)}</td></tr>
        {a.admin > 0 && <tr><td>{t('res.setup')}</td><td>{thb(a.admin)}</td></tr>}
        <tr><td>{t('res.transfer')}</td><td>{thb(a.transferEstimate)}</td></tr>
      </tbody></table>
      <p className="muted small">{t('res.refundNote')}</p>
    </div>
  );
}
