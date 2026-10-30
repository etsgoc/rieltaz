import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { fromPrice, media, unitsOf } from '@core';
import type { Project } from '@core';
import { useCatalog } from '@/providers/CatalogProvider';
import { useI18n } from '@/providers/I18nProvider';
import { thb } from '@/lib/format';
import Chip from '../ui/Chip';
import Cover from '../ui/Cover';
import HeartButton from './HeartButton';

export default function PropertyCard({ p }: { p: Project }) {
  const { cat } = useCatalog();
  const { t } = useI18n();
  const from = fromPrice(cat, p);
  const count = unitsOf(cat, p.id).length;
  return (
    <Link to={`/properties/${p.id}`} className="card property-card">
      <div className="card-media"><Cover src={media(cat, p.media.cover)} seed={p.id} alt={p.name} /><HeartButton id={p.id} /></div>
      <div className="card-body">
        <h3>{p.name}</h3>
        <p className="muted loc"><MapPin size={14} />{p.location.area}, {p.location.city}</p>
        {p.tagline && <p className="tagline">{p.tagline}</p>}
        <div className="chips">
          {p.ownership.map(o => <Chip key={o}>{t(p.ownership.length === 1 && o === 'leasehold' ? 'own.leaseOnly' : `own.${o}`)}</Chip>)}
          {count > 0 && <Chip>{count} {t('prop.units')}</Chip>}
        </div>
        <p className="price">{from ? <><span className="muted">{t('common.from')}</span> {thb(from)}</> : <span className="muted">{t('common.onRequest')}</span>}</p>
      </div>
    </Link>
  );
}
