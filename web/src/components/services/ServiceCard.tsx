import type { Service } from '@core';
import { useI18n } from '@/providers/I18nProvider';
import { thb } from '@/lib/format';
import Cover from '../ui/Cover';

export default function ServiceCard({ s, onOpen }: { s: Service; onOpen: () => void }) {
  const { t } = useI18n();
  const from = s.options?.length ? Math.min(...s.options.map(o => o.price)) : s.priceFrom;
  return (
    <button className="card service-card" onClick={onOpen}>
      <div className="card-media"><Cover src={s.image} seed={s.id} alt={s.title} /></div>
      <div className="card-body">
        <h3>{s.title}</h3>
        <p className="muted">{s.blurb}</p>
        <p className="price">{from && !s.requestOnly ? <><span className="muted">{t('svc.from')}</span> {thb(from, s.currency)}{s.unit && <span className="muted"> · {s.unit}</span>}</> : <span className="muted">{t('svc.quoteOnly')}</span>}</p>
      </div>
    </button>
  );
}
