import { Check, ExternalLink } from 'lucide-react';
import { money } from '@core';
import type { Project } from '@core';
import { useI18n } from '@/providers/I18nProvider';
import { shortDate } from '@/lib/format';
import Spec from './Spec';

export default function RentalPanel({ p }: { p: Project }) {
  const { t, lang } = useI18n();
  const r = p.rental;
  if (!r) return null;
  const cur = r.currency ?? p.pricing?.currency ?? 'USD';
  return (
    <>
      <Spec rows={[
        { label: t('rent.nightly'), value: r.nightly && money(r.nightly, cur) },
        { label: t('rent.monthly'), value: r.monthly && money(r.monthly, cur) },
        { label: t('rent.cleaning'), value: r.cleaningFee && money(r.cleaningFee, cur) },
        { label: t('rent.deposit'), value: r.deposit && money(r.deposit, cur) },
        { label: t('fact.minStay'), value: r.minNights && t('fact.nights', { n: r.minNights }) },
        { label: t('rent.occupancy'), value: r.occupancyPct && `${r.occupancyPct}%` },
        { label: t('rent.rating'), value: r.rating && `★ ${r.rating}${r.reviews ? ` · ${t('rent.reviews', { n: r.reviews })}` : ''}` },
        { label: t('rent.available'), value: r.availableFrom && shortDate(r.availableFrom, lang) },
        { label: t('rent.source'), value: r.source },
      ]} />
      {r.rules && r.rules.length > 0 && (
        <>
          <h3 className="sub">{t('rent.rules')}</h3>
          <ul className="ticks">{r.rules.map(x => <li key={x}><Check size={16} />{x}</li>)}</ul>
        </>
      )}
      {r.sourceUrl && <p className="map-links"><a href={r.sourceUrl} target="_blank" rel="noreferrer"><ExternalLink size={14} /> {t('rent.viewListing')}</a></p>}
    </>
  );
}
