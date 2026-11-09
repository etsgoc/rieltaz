import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, List } from 'lucide-react';
import { CATEGORIES, categoryOf, maxBedrooms, priceOf, usdOf } from '@core';
import type { Project } from '@core';
import { useCatalog } from '@/providers/CatalogProvider';
import { useI18n } from '@/providers/I18nProvider';
import Button from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';
import EmptyState from '@/components/ui/EmptyState';
import PropertyCard from '@/components/property/PropertyCard';
import { placeOptions } from '@/lib/places';
import { useDragScroll } from '@/lib/dragScroll';
import { usePageMeta } from '@/lib/meta';

const VIEW_KEY = 'propView';
const readView = () => { try { return localStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'grid'; } catch { return 'grid'; } };

export default function Properties() {
  const { cat } = useCatalog();
  const { t } = useI18n();
  const [params, setParams] = useSearchParams();
  const tabsRef = useDragScroll<HTMLDivElement>();
  usePageMeta(t('nav.browse'), t('home.subtitle'));
  const kind = params.get('cat') ?? 'all';
  const place = params.get('place') ?? 'all';
  const beds = params.get('beds') ?? 'any';
  const own = params.get('own') ?? 'all';
  const sort = params.get('sort') ?? 'featured';
  const view = params.get('view') ?? readView();
  const set = (k: string, v: string) => {
    if (k === 'view') { try { localStorage.setItem(VIEW_KEY, v); } catch { /* storage blocked */ } }
    const n = new URLSearchParams(params); n.set(k, v); setParams(n, { replace: true });
  };

  const places = useMemo(() => placeOptions(cat), [cat]);
  const counts = useMemo(() => {
    const m: Record<string, number> = { all: cat.projects.length };
    CATEGORIES.forEach(c => { m[c] = cat.projects.filter(p => categoryOf(cat, p) === c).length; });
    return m;
  }, [cat]);

  const list = useMemo(() => {
    const price = (p: Project) => { const x = priceOf(cat, p); return usdOf(cat, x.amount, x.currency); };
    const out = cat.projects.filter(p =>
      (kind === 'all' || categoryOf(cat, p) === kind) &&
      (place === 'all' || p.location.city === place) &&
      (beds === 'any' || (maxBedrooms(p) ?? 0) >= Number(beds)) &&
      (own === 'all' || p.ownership.includes(own as 'leasehold')));
    if (sort === 'priceAsc') out.sort((a, b) => price(a) - price(b));
    if (sort === 'priceDesc') out.sort((a, b) => price(b) - price(a));
    if (sort === 'featured') out.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    return out;
  }, [cat, kind, place, beds, own, sort]);

  return (
    <div className="wrap section">
      <div className="page-head">
        <h1>{kind === 'all' ? t('nav.browse') : t(`cat.${kind}` as 'cat.resale')}</h1>
        <p className="muted">{list.length === 1 ? t('filters.result') : t('filters.results', { n: list.length })}</p>
      </div>

      <div className="tabs-scroll" role="tablist" ref={tabsRef}>
        {['all', ...CATEGORIES].map(c => (
          <button key={c} role="tab" aria-selected={kind === c} className={`pill${kind === c ? ' on' : ''}`} onClick={() => set('cat', c)}>
            {t(`cat.${c}` as 'cat.resale')}<span>{counts[c]}</span>
          </button>
        ))}
      </div>

      <div className="filters">
        <Dropdown label={t('filters.location')} value={place} onChange={v => set('place', v)} options={[{ value: 'all', label: t('filters.anywhere') }, ...places]} />
        <Dropdown label={t('filters.beds')} value={beds} onChange={v => set('beds', v)}
          options={[{ value: 'any', label: t('filters.anyBeds') }, { value: '1', label: t('filters.beds1') }, { value: '2', label: t('filters.beds2') }, { value: '3', label: t('filters.beds3') }, { value: '4', label: t('filters.beds4') }]} />
        {(kind === 'all' || kind === 'new-build' || kind === 'resale') && (
          <Dropdown label={t('filters.ownership')} value={own} onChange={v => set('own', v)}
            options={[{ value: 'all', label: t('filters.anyOwnership') }, { value: 'leasehold', label: t('own.leasehold') }, { value: 'freehold', label: t('own.freehold') }]} />
        )}
        <Dropdown label={t('filters.sort')} value={sort} onChange={v => set('sort', v)}
          options={[{ value: 'featured', label: t('sort.featured') }, { value: 'priceAsc', label: t('sort.priceAsc') }, { value: 'priceDesc', label: t('sort.priceDesc') }]} />
        <div className="seg view-toggle" role="group">
          <button className={view === 'grid' ? 'on' : ''} onClick={() => set('view', 'grid')} aria-label={t('view.grid')}><LayoutGrid size={16} /></button>
          <button className={view === 'list' ? 'on' : ''} onClick={() => set('view', 'list')} aria-label={t('view.list')}><List size={16} /></button>
        </div>
      </div>

      {list.length ? <div className={`grid${view === 'list' ? ' list' : ''}`}>{list.map(p => <PropertyCard key={p.id} p={p} />)}</div> : (
        <EmptyState title={t('filters.noResults')}><Button variant="soft" onClick={() => setParams({}, { replace: true })}>{t('filters.reset')}</Button></EmptyState>
      )}
    </div>
  );
}
