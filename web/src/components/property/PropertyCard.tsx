import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { categoryOf, factsOf, investmentReturn, media, placeOf, priceOf } from '@core';
import type { Project } from '@core';
import { useCatalog } from '@/providers/CatalogProvider';
import { useI18n } from '@/providers/I18nProvider';
import Chip from '../ui/Chip';
import Cover from '../ui/Cover';
import FactIcon from './FactIcon';
import HeartButton from './HeartButton';
import PriceTag from './PriceTag';

const CARD_FACTS = ['beds', 'baths', 'area', 'guests', 'units'];

export default function PropertyCard({ p }: { p: Project }) {
  const { cat } = useCatalog();
  const { t } = useI18n();
  const kind = categoryOf(cat, p);
  const facts = factsOf(cat, p).filter(f => CARD_FACTS.includes(f.key)).slice(0, 3);
  const roi = p.investment ? investmentReturn(p.investment).pct : null;
  return (
    <Link to={`/properties/${p.id}`} className="card property-card">
      <div className="card-media">
        <Cover src={media(cat, p.media.cover)} seed={p.id} alt={p.name} />
        <span className="badge">{t(`cat.${kind}` as 'cat.resale')}</span>
        <HeartButton id={p.id} />
        <span className="price-pill"><PriceTag price={priceOf(cat, p)} /></span>
      </div>
      <div className="card-body">
        <h3>{p.name}</h3>
        <p className="muted loc"><MapPin size={14} />{placeOf(p)}</p>
        {facts.length > 0 && (
          <ul className="facts">
            {facts.map(f => <li key={f.key}><FactIcon k={f.key} size={16} /><span><strong>{f.value}</strong><small>{t(`fact.${f.key}` as 'fact.beds')}</small></span></li>)}
          </ul>
        )}
        <div className="chips">
          {kind === 'new-build' && p.ownership.map(o => <Chip key={o}>{t(p.ownership.length === 1 && o === 'leasehold' ? 'own.leaseOnly' : `own.${o}`)}</Chip>)}
          {roi != null && <Chip tone="ok">{t('fact.roi')} {roi}%</Chip>}
          {p.rental?.rating ? <Chip>★ {p.rental.rating}</Chip> : null}
        </div>
      </div>
    </Link>
  );
}
