import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, Hammer, Home as HomeIcon, KeyRound, MapPin, Search, type LucideIcon } from 'lucide-react';
import { categoryOf, CATEGORIES, enabledCategories } from '@core';
import type { PropertyCategory } from '@core';
import { useCatalog } from '@/providers/CatalogProvider';
import { useI18n } from '@/providers/I18nProvider';
import Button from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';
import ContactActions from '@/components/contact/ContactActions';
import PropertyCard from '@/components/property/PropertyCard';
import { categoryIcon } from '@/components/services/icons';
import { placeOptions } from '@/lib/places';
import { usePageMeta } from '@/lib/meta';

const ICONS: Record<PropertyCategory, LucideIcon> = { 'new-build': Building2, resale: HomeIcon, rental: KeyRound, investment: Hammer };

export default function Home() {
  const { cat } = useCatalog();
  const serviceCats = enabledCategories(cat);
  const { t } = useI18n();
  const nav = useNavigate();
  usePageMeta(undefined, t('home.subtitle'));
  const [place, setPlace] = useState('all');
  const [type, setType] = useState('all');
  const places = useMemo(() => placeOptions(cat), [cat]);
  const hero = cat.hero?.image || `${import.meta.env.BASE_URL}hero.svg`;
  const counts = useMemo(() => Object.fromEntries(CATEGORIES.map(c => [c, cat.projects.filter(p => categoryOf(cat, p) === c).length])) as Record<PropertyCategory, number>, [cat]);
  const featured = useMemo(() => { const f = cat.projects.filter(p => p.featured); return (f.length >= 3 ? f : cat.projects).slice(0, 6); }, [cat]);

  return (
    <>
      <section className="hero">
        <div className="hero-bg">
          <img src={hero} alt="" fetchPriority="high" />
          <div className="hero-shade" />
          <div className="hero-copy">
            <div className="wrap hero-copy-in">
              <span className="hero-badge">{t('hero.badge')}</span>
              <h1>{t('home.title')}</h1>
              <p className="hero-lead">{t('home.subtitle')}</p>
            </div>
          </div>
        </div>
        <div className="wrap hero-search-wrap">
          <div className="hero-search" role="search">
            <Dropdown label={t('hero.location')} icon={<MapPin size={17} />} value={place} onChange={setPlace}
              options={[{ value: 'all', label: t('hero.anywhere') }, ...places]} />
            <Dropdown label={t('hero.category')} value={type} onChange={setType}
              options={[{ value: 'all', label: t('cat.all') }, ...CATEGORIES.map(c => ({ value: c, label: t(`cat.${c}` as 'cat.resale') }))]} />
            <Button size="lg" icon={<Search size={18} />} onClick={() => nav(`/properties?place=${encodeURIComponent(place)}&cat=${type}`)}>{t('hero.search')}</Button>
          </div>
        </div>
      </section>

      <section className="wrap section">
        <div className="section-head"><h2>{t('home.browseBy')}</h2></div>
        <div className="type-grid">
          {CATEGORIES.map(c => {
            const Icon = ICONS[c];
            return (
              <Link key={c} to={`/properties?cat=${c}`} className="card type-card">
                <span className="cat-icon"><Icon size={22} /></span>
                <h3>{t(`cat.${c}` as 'cat.resale')}</h3>
                <p className="muted">{t(`cat.${c}.d` as 'cat.resale.d')}</p>
                <span className="type-count">{t('home.countProps', { n: counts[c] })}<ArrowRight size={15} /></span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="wrap section">
        <div className="section-head"><h2>{t('home.latest')}</h2><Link to="/properties" className="more">{t('common.seeAll')} <ArrowRight size={16} /></Link></div>
        <div className="grid">{featured.map(p => <PropertyCard key={p.id} p={p} />)}</div>
      </section>

      <section className="wrap section">
        <div className="section-head"><div><h2>{t('home.howTitle')}</h2><p className="muted">{t('home.howSub')}</p></div></div>
        <ol className="steps">
          {(['1', '2', '3'] as const).map(n => (
            <li key={n} className="step"><span className="step-n">{n}</span><h3>{t(`home.step${n}` as 'home.step1')}</h3><p className="muted">{t(`home.step${n}d` as 'home.step1d')}</p></li>
          ))}
        </ol>
      </section>

      {serviceCats.length > 0 && (
        <section className="wrap section">
          <div className="section-head">
            <div><h2>{t('home.servicesTitle')}</h2><p className="muted">{t('home.servicesSubtitle')}</p></div>
            <Link to="/services" className="more">{t('common.seeAll')} <ArrowRight size={16} /></Link>
          </div>
          <div className="cat-grid">
            {serviceCats.map(c => {
              const Icon = categoryIcon(c.icon);
              return (
                <Link key={c.id} to={`/services/${c.id}`} className="card cat-card">
                  <span className="cat-icon"><Icon size={22} /></span>
                  <h3>{c.title}</h3><p className="muted">{c.blurb}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="wrap section">
        <div className="cta">
          <div className="cta-copy">
            <h2>{t('home.cta')}</h2>
            <p>{t('home.ctaSub')}</p>
          </div>
          <div className="cta-actions"><ContactActions layout="stack" tone="dark" /></div>
        </div>
      </section>
    </>
  );
}
