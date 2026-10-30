import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { useCatalog } from '@/providers/CatalogProvider';
import { useI18n } from '@/providers/I18nProvider';
import Button from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';
import PropertyCard from '@/components/property/PropertyCard';
import { categoryIcon } from '@/components/services/icons';

export default function Home() {
  const { cat, features } = useCatalog();
  const { t } = useI18n();
  const nav = useNavigate();
  const [area, setArea] = useState('all');
  const [own, setOwn] = useState('all');
  const areas = [...new Set(cat.projects.map(p => p.location.area))];

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <h1>{t('home.title')}</h1>
            <p className="lead">{t('home.subtitle')}</p>
            <div className="search">
              <Dropdown label={t('filters.area')} value={area} onChange={setArea}
                options={[{ value: 'all', label: t('filters.allAreas') }, ...areas.map(a => ({ value: a, label: a }))]} />
              <Dropdown label={t('filters.ownership')} value={own} onChange={setOwn}
                options={[{ value: 'all', label: t('filters.anyOwnership') }, { value: 'leasehold', label: t('own.leasehold') }, { value: 'freehold', label: t('own.freehold') }]} />
              <Button size="lg" icon={<Search size={18} />} onClick={() => nav(`/properties?area=${area}&own=${own}`)}>{t('nav.browse')}</Button>
            </div>
          </div>
          <div className="stats">
            <div><strong>{cat.developers?.length ?? 0}</strong><span>{t('home.stat1')}</span></div>
            <div><strong>{cat.projects.length}</strong><span>{t('home.stat2')}</span></div>
            <div><strong>{cat.units.length}</strong><span>{t('home.stat3')}</span></div>
          </div>
        </div>
      </section>

      <section className="wrap section">
        <div className="section-head"><h2>{t('home.featured')}</h2><Link to="/properties" className="more">{t('common.seeAll')} <ArrowRight size={16} /></Link></div>
        <div className="grid">{cat.projects.map(p => <PropertyCard key={p.id} p={p} />)}</div>
      </section>

      {features.services && cat.serviceCategories && (
        <section className="wrap section">
          <div className="section-head">
            <div><h2>{t('home.servicesTitle')}</h2><p className="muted">{t('home.servicesSubtitle')}</p></div>
            <Link to="/services" className="more">{t('common.seeAll')} <ArrowRight size={16} /></Link>
          </div>
          <div className="cat-grid">
            {cat.serviceCategories.map(c => {
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
          <h2>{t('home.cta')}</h2>
          <p>{t('contact.subtitle')}</p>
          <Button to="/contact" size="lg" variant="soft">{t('nav.contact')}</Button>
        </div>
      </section>
    </>
  );
}
