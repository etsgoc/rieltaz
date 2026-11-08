import { money } from '@core';
import type { PriceInfo } from '@core';
import { useI18n } from '@/providers/I18nProvider';

export default function PriceTag({ price, big }: { price: PriceInfo; big?: boolean }) {
  const { t } = useI18n();
  if (price.amount == null) return <span className="price-tag muted">{t('common.onRequest')}</span>;
  return (
    <span className={`price-tag${big ? ' big' : ''}`}>
      {price.label === 'from' && <small>{t('common.from')}</small>}
      {price.label === 'purchase' && <small>{t('price.purchase')}</small>}
      <strong>{money(price.amount, price.currency)}</strong>
      {price.suffix && <small>/ {t(`price.${price.suffix}`)}</small>}
    </span>
  );
}
