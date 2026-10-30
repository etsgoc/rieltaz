import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { fromPrice, photos, tourOf, unitsOf } from '@core';
import { useCatalog } from '@/providers/CatalogProvider';
import { useI18n } from '@/providers/I18nProvider';
import { db, hasBackend } from '@/lib/supabase';
import { thb } from '@/lib/format';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import EmptyState from '@/components/ui/EmptyState';
import ContactForm from '@/components/forms/ContactForm';
import Gallery from '@/components/property/Gallery';
import MapView from '@/components/property/MapView';
import ReservePanel from '@/components/property/ReservePanel';
import Tour360 from '@/components/property/Tour360';

export default function PropertyDetail() {
  const { id } = useParams();
  const { cat } = useCatalog();
  const { t } = useI18n();
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasBackend) return;
    db.rpc('taken_units').then(({ data }) => {
      if (data) setTaken(new Set((data as { project_id: string; unit_id: string }[]).map(r => `${r.project_id}:${r.unit_id}`)));
    });
  }, [id]);

  const p = cat.projects.find(x => x.id === id);
  if (!p) return <div className="wrap section"><EmptyState title={t('prop.notFound')}><Button to="/properties" variant="soft">{t('prop.back')}</Button></EmptyState></div>;

  const units = unitsOf(cat, p.id).filter(u => u.status === 'available' && !taken.has(`${p.id}:${u.id}`));
  const tour = tourOf(p);
  const amenities = (p.amenities as string[] | undefined) ?? [];
  const from = fromPrice(cat, p);

  return (
    <div className="wrap section detail">
      <Link to="/properties" className="back"><ArrowLeft size={16} />{t('prop.back')}</Link>
      <div className="detail-head">
        <h1>{p.name}</h1>
        <p className="muted loc"><MapPin size={15} />{p.location.area}, {p.location.city}</p>
        <div className="chips">
          {p.ownership.map(o => <Chip key={o}>{t(p.ownership.length === 1 && o === 'leasehold' ? 'own.leaseOnly' : `own.${o}`)}</Chip>)}
          {p.handover ? <Chip>{t('prop.handover')} {String(p.handover)}</Chip> : null}
          {p.furnished ? <Chip>{t('prop.furnished')}</Chip> : null}
        </div>
      </div>

      <Gallery photos={photos(cat, p)} seed={p.id} />

      <div className="detail-grid">
        <div className="detail-main">
          {p.summary && <><h2>{t('prop.about')}</h2><p className="body-text">{p.summary}</p></>}
          {p.leaseTerms ? <><h2>{t('prop.leaseTerms')}</h2><p className="body-text">{String(p.leaseTerms)}</p></> : null}
          {p.management ? <><h2>{t('prop.management')}</h2><p className="body-text">{String(p.management)}</p></> : null}
          {amenities.length > 0 && <><h2>{t('prop.amenities')}</h2><div className="chips">{amenities.map(a => <Chip key={a}>{a}</Chip>)}</div></>}
          {tour && <><h2>{t('prop.tour')}</h2><Tour360 tour={tour} /></>}
          <h2>{t('prop.map')}</h2>
          <MapView lat={p.location.lat} lng={p.location.lng} name={p.name} />
        </div>
        <aside className="detail-side" id="reserve" ref={panel}>
          <div className="panel sticky">
            {units.length ? <ReservePanel p={p} units={units} /> : (
              <div className="stack"><h3>{t('prop.availabilityTitle')}</h3><p className="muted">{t('prop.availabilityHint')}</p><ContactForm subject={p.name} compact /></div>
            )}
          </div>
        </aside>
      </div>

      <div className="reserve-bar only-small">
        <div><span className="muted">{t('common.from')}</span><strong>{from ? thb(from) : t('common.onRequest')}</strong></div>
        <Button onClick={() => panel.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>{units.length ? t('res.title') : t('nav.contact')}</Button>
      </div>
    </div>
  );
}
