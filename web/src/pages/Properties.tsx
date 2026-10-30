import { useSearchParams } from 'react-router-dom';
import { useCatalog } from '@/providers/CatalogProvider';
import { useI18n } from '@/providers/I18nProvider';
import Button from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';
import EmptyState from '@/components/ui/EmptyState';
import PropertyCard from '@/components/property/PropertyCard';

export default function Properties() {
  const { cat } = useCatalog();
  const { t } = useI18n();
  const [params, setParams] = useSearchParams();
  const area = params.get('area') ?? 'all';
  const own = params.get('own') ?? 'all';
  const areas = [...new Set(cat.projects.map(p => p.location.area))];
  const set = (k: string, v: string) => { const n = new URLSearchParams(params); n.set(k, v); setParams(n, { replace: true }); };
  const list = cat.projects.filter(p => (area === 'all' || p.location.area === area) && (own === 'all' || p.ownership.includes(own as 'leasehold')));

  return (
    <div className="wrap section">
      <h1>{t('nav.browse')}</h1>
      <div className="filters">
        <Dropdown label={t('filters.area')} value={area} onChange={v => set('area', v)}
          options={[{ value: 'all', label: t('filters.allAreas') }, ...areas.map(a => ({ value: a, label: a }))]} />
        <Dropdown label={t('filters.ownership')} value={own} onChange={v => set('own', v)}
          options={[{ value: 'all', label: t('filters.anyOwnership') }, { value: 'leasehold', label: t('own.leasehold') }, { value: 'freehold', label: t('own.freehold') }]} />
      </div>
      {list.length ? <div className="grid">{list.map(p => <PropertyCard key={p.id} p={p} />)}</div> : (
        <EmptyState title={t('filters.noResults')}><Button variant="soft" onClick={() => setParams({}, { replace: true })}>{t('filters.reset')}</Button></EmptyState>
      )}
    </div>
  );
}
