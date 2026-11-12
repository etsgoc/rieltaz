import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import type { Tour } from '@core';
import { useI18n } from '@/providers/I18nProvider';
import Tour360 from './Tour360';

/** One or several 360 tours. With several (for example one per tower) the visitor picks one. */
export default function TourPicker({ tours }: { tours: Tour[] }) {
  const { t } = useI18n();
  const [i, setI] = useState(0);
  const tour = tours[Math.min(i, tours.length - 1)];
  return (
    <div className="stack">
      {tours.length > 1 && (
        <div className="chips-row" role="tablist" aria-label={t('tour.choose')}>
          {tours.map((x, k) => <button key={x.url} role="tab" aria-selected={k === i} className={`pill${k === i ? ' on' : ''}`} onClick={() => setI(k)}>{x.label ?? `360 ${k + 1}`}</button>)}
        </div>
      )}
      <Tour360 key={tour.url} tour={tour} />
      {tour.type === 'embed' && <p className="map-links"><a href={tour.url} target="_blank" rel="noreferrer"><ExternalLink size={14} /> {t('tour.openTab')}</a></p>}
    </div>
  );
}
