import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Heart, Menu, Phone } from 'lucide-react';
import { telHref } from '@core';
import { useI18n } from '@/providers/I18nProvider';
import { useCatalog } from '@/providers/CatalogProvider';
import { useIsMobile } from '@/lib/hooks';
import Logo from '../ui/Logo';
import ThemeToggle from '../ui/ThemeToggle';
import LanguageMenu from '../ui/LanguageMenu';
import NavSheet from './NavSheet';

export default function Header() {
  const { t } = useI18n();
  const { cat, features } = useCatalog();
  const mobile = useIsMobile();
  const [menu, setMenu] = useState(false);

  return (
    <header className="header">
      <div className="wrap header-row">
        <Logo />
        {!mobile && (
          <nav className="nav">
            <NavLink to="/properties">{t('nav.browse')}</NavLink>
            {features.services && <NavLink to="/services">{t('nav.services')}</NavLink>}
            <NavLink to="/about">{t('nav.about')}</NavLink>
            <NavLink to="/contact">{t('nav.contact')}</NavLink>
          </nav>
        )}
        <div className="header-tools">
          {!mobile && <><LanguageMenu /><ThemeToggle /></>}
          <Link className="icon-btn" to="/saved" aria-label={t('nav.saved')}><Heart size={20} /></Link>
          {!mobile && cat.contact?.phone && <a className="btn btn-primary btn-md" href={telHref(cat.contact.phone)}><Phone size={16} />{cat.contact.phone}</a>}
          {mobile && <button className="icon-btn" onClick={() => setMenu(true)} aria-label={t('nav.menu')}><Menu size={22} /></button>}
        </div>
      </div>
      {mobile && <NavSheet open={menu} onClose={() => setMenu(false)} />}
    </header>
  );
}
