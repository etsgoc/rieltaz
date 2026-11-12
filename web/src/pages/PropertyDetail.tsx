import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Clock, MapPin, Orbit, Share2, TrendingUp } from 'lucide-react';
import { categoryOf, factsOf, investmentReturn, layoutOf, money, photos, placeOf, priceOf, toursOf, unitsOf } from '@core';
import type { InquiryContext, Ownership, Unit } from '@core';
import { useCatalog } from '@/providers/CatalogProvider';
import { useI18n } from '@/providers/I18nProvider';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import EmptyState from '@/components/ui/EmptyState';
import ConsentGate from '@/components/ui/ConsentGate';
import AgentCard from '@/components/contact/AgentCard';
import ContactActions from '@/components/contact/ContactActions';
import ContactForm from '@/components/forms/ContactForm';
import { usePageMeta } from '@/lib/meta';
import FactIcon from '@/components/property/FactIcon';
import FactTiles from '@/components/property/FactTiles';
import Gallery from '@/components/property/Gallery';
import HeartButton from '@/components/property/HeartButton';
import InvestmentPanel from '@/components/property/InvestmentPanel';
import MapView from '@/components/property/MapView';
import PriceTag from '@/components/property/PriceTag';
import RentalPanel from '@/components/property/RentalPanel';
import PhotoGroups from '@/components/property/PhotoGroups';
import TourPicker from '@/components/property/TourPicker';
import UnitExplorer from '@/components/property/UnitExplorer';

export default function PropertyDetail() {
  const { id } = useParams();
  const { cat } = useCatalog();
  const { t } = useI18n();
  const [sel, setSel] = useState<{ unit?: Unit; own?: Ownership }>({});
  const [copied, setCopied] = useState(false);
  const picked = useRef<string>('');

  const p = cat.projects.find(x => x.id === id);
  usePageMeta(p?.name, p?.tagline);
  if (!p) return <div className="wrap section"><EmptyState title={t('prop.notFound')}><Button to="/properties" variant="soft">{t('prop.back')}</Button></EmptyState></div>;

  const kind = categoryOf(cat, p);
  const layout = layoutOf(cat, p);
  const price = priceOf(cat, p);
  const units = unitsOf(cat, p.id).filter(u => u.status === 'available');
  const tours = toursOf(p);
  const tour = tours[0];
  const groups = (p.media.groups ?? []).filter(g => g.images.length);
  const amenities = p.amenities ?? [];
  const cur = p.pricing?.currency ?? 'THB';
  const facts = factsOf(cat, p);

  const ctx: InquiryContext = {
    property: p.name,
    ...(layout === 'units' && sel.unit ? {
      unit: `${sel.unit.id}, ${sel.unit.type}, ${sel.unit.sqm} m²`,
      ownership: sel.own ? t(`own.${sel.own}`) : undefined,
      price: money(sel.unit.price, cur),
    } : {}),
    details: [`${placeOf(p)}`, `${location.origin}${location.pathname}`],
  };

  const tiles = [
    ...facts.filter(f => f.key !== 'units' || layout === 'units').map(f => ({ icon: <FactIcon k={f.key} />, label: t(`fact.${f.key}` as 'fact.beds'), value: f.value })),
    ...(layout === 'units' && p.handover ? [{ icon: <Clock size={18} />, label: t('fact.handover'), value: String(p.handover) }] : []),
    ...(layout === 'rental' && p.rental?.minNights ? [{ icon: <Clock size={18} />, label: t('fact.minStay'), value: t('fact.nights', { n: p.rental.minNights }) }] : []),
    ...(layout === 'investment' && p.investment ? [
      { icon: <TrendingUp size={18} />, label: t('fact.roi'), value: `${investmentReturn(p.investment).pct}%` },
      ...(p.investment.timelineMonths ? [{ icon: <Clock size={18} />, label: t('fact.timeline'), value: t('fact.months', { n: p.investment.timelineMonths }) }] : []),
    ] : []),
  ];

  async function share() {
    try {
      if (navigator.share) await navigator.share({ title: p!.name, url: location.href });
      else { await navigator.clipboard.writeText(location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    } catch { /* cancelled */ }
  }

  return (
    <div className="wrap section detail">
      <Link to="/properties" className="back"><ArrowLeft size={16} />{t('prop.back')}</Link>

      <div className="detail-head">
        <div className="detail-title">
          <div className="chips">
            <Chip tone="accent">{t(`cat.${kind}` as 'cat.resale')}</Chip>
            {layout !== 'rental' && p.ownership.map(o => <Chip key={o}>{t(p.ownership.length === 1 && o === 'leasehold' ? 'own.leaseOnly' : `own.${o}`)}</Chip>)}
            {p.furnished ? <Chip>{t('prop.furnished')}</Chip> : null}
          </div>
          <h1>{p.name}</h1>
          <p className="muted loc"><MapPin size={15} />{placeOf(p)}</p>
        </div>
        <div className="detail-price">
          <PriceTag price={price} big />
          <div className="detail-tools">
            {tour && <a className="btn btn-soft btn-md" href="#tour"><Orbit size={16} />360</a>}
            <button className="btn btn-soft btn-md" onClick={share}><Share2 size={16} />{copied ? t('prop.shared') : t('prop.share')}</button>
            <HeartButton id={p.id} inline />
          </div>
        </div>
      </div>

      <Gallery photos={photos(cat, p)} seed={p.id} />
      <FactTiles tiles={tiles} />

      <div className="detail-grid">
        <div className="detail-main">
          {p.summary && <><h2>{t('prop.about')}</h2><p className="body-text">{p.summary}</p></>}

          {layout === 'units' && units.length > 0 && <><h2>{t('prop.layout.units')}</h2><UnitExplorer p={p} units={units} onSelect={(unit, own) => { const k = `${unit.id}:${own}`; if (picked.current !== k) { picked.current = k; setSel({ unit, own }); } }} /></>}
          {layout === 'rental' && <><h2>{t('rent.title')}</h2><RentalPanel p={p} /></>}
          {layout === 'investment' && <><h2>{t('inv.title')}</h2><InvestmentPanel p={p} /></>}

          {p.leaseTerms ? <><h2>{t('prop.leaseTerms')}</h2><p className="body-text">{String(p.leaseTerms)}</p></> : null}
          {p.management ? <><h2>{t('prop.management')}</h2><p className="body-text">{String(p.management)}</p></> : null}
          {amenities.length > 0 && <><h2>{t('prop.amenities')}</h2><ul className="amenity-grid">{amenities.map(a => <li key={a}><Check size={16} />{a}</li>)}</ul></>}
          {groups.length > 0 && <><h2>{t('photos.title')}</h2><PhotoGroups groups={groups} /></>}
          {tour && <><h2 id="tour">{t('prop.tour')}</h2><ConsentGate><TourPicker tours={tours} /></ConsentGate></>}
          <h2>{t('prop.map')}</h2>
          <ConsentGate><MapView lat={p.location.lat} lng={p.location.lng} name={p.name} /></ConsentGate>
        </div>

        <aside className="detail-side" id="contact">
          <div className="panel sticky contact-panel">
            <div className="stack">
              <PriceTag price={price} big />
              <h3>{t('prop.contactTitle')}</h3>
              <p className="muted small">{t('prop.contactHint')}</p>
              <AgentCard />
              <ContactActions ctx={ctx} layout="stack" />
              <details className="inq-details">
                <summary>{t('inq.title')}</summary>
                <ContactForm ctx={ctx} compact />
              </details>
            </div>
          </div>
        </aside>
      </div>

      <div className="contact-bar only-small">
        <PriceTag price={price} />
        <ContactActions ctx={ctx} layout="bar" />
      </div>
    </div>
  );
}
