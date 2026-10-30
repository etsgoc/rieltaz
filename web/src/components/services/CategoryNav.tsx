import { NavLink } from 'react-router-dom';
import type { ServiceCategory } from '@core';
import { useI18n } from '@/providers/I18nProvider';
import { categoryIcon } from './icons';

/** Sidebar on large screens, scrolling top bar on small ones. */
export default function CategoryNav({ categories }: { categories: ServiceCategory[] }) {
  const { t } = useI18n();
  return (
    <nav className="cat-nav" aria-label={t('svc.categories')}>
      <h4 className="cat-title">{t('svc.categories')}</h4>
      {categories.map(c => {
        const Icon = categoryIcon(c.icon);
        return <NavLink key={c.id} to={`/services/${c.id}`}><Icon size={18} /><span>{c.title}</span></NavLink>;
      })}
    </nav>
  );
}
