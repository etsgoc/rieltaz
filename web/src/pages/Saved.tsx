import { useCatalog } from '@/providers/CatalogProvider';
import { useFavorites } from '@/providers/FavoritesProvider';
import { useI18n } from '@/providers/I18nProvider';
import { usePageMeta } from '@/lib/meta';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import PropertyCard from '@/components/property/PropertyCard';

export default function Saved() {
  const { cat } = useCatalog();
  const { ids } = useFavorites();
  const { t } = useI18n();
  usePageMeta(t('saved.title'));
  const list = ids.map(id => cat.projects.find(p => p.id === id)).filter(Boolean) as typeof cat.projects;
  return (
    <div className="wrap section">
      <h1>{t('saved.title')}</h1>
      {list.length ? <div className="grid">{list.map(p => <PropertyCard key={p.id} p={p} />)}</div> : (
        <EmptyState title={t('saved.empty')}><p className="muted">{t('saved.hint')}</p><Button to="/properties" variant="soft">{t('nav.browse')}</Button></EmptyState>
      )}
    </div>
  );
}
