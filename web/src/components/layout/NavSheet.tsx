import { NavLink } from 'react-router-dom';
import { useI18n } from '@/providers/I18nProvider';
import { useCatalog } from '@/providers/CatalogProvider';
import Sheet from '../ui/Sheet';
import ThemeToggle from '../ui/ThemeToggle';
import LanguageMenu from '../ui/LanguageMenu';

export default function NavSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const { features } = useCatalog();
  const links = [
    { to: '/properties', label: t('nav.browse') },
    ...(features.services ? [{ to: '/services', label: t('nav.services') }] : []),
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
    { to: '/saved', label: t('nav.saved') },
  ];
  return (
    <Sheet open={open} onClose={onClose} title={t('nav.menu')}>
      <nav className="pick-list">
        <ul>{links.map(l => <li key={l.to}><NavLink to={l.to} onClick={onClose}>{l.label}</NavLink></li>)}</ul>
      </nav>
      <div className="sheet-row"><span>{t('common.theme')}</span><ThemeToggle /></div>
      <div className="sheet-row"><span>{t('common.language')}</span><LanguageMenu /></div>
    </Sheet>
  );
}
