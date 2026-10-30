import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, UserRound } from 'lucide-react';
import { useI18n } from '@/providers/I18nProvider';
import { useCatalog } from '@/providers/CatalogProvider';
import { useSession } from '@/providers/SessionProvider';
import { useIsMobile } from '@/lib/hooks';
import Logo from '../ui/Logo';
import ThemeToggle from '../ui/ThemeToggle';
import LanguageMenu from '../ui/LanguageMenu';
import NavSheet from './NavSheet';

export default function Header() {
  const { t } = useI18n();
  const { features } = useCatalog();
  const { session } = useSession();
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
          <Link className="btn btn-soft btn-md" to="/account"><UserRound size={16} />{session ? t('nav.account') : t('nav.signIn')}</Link>
          {mobile && <button className="icon-btn" onClick={() => setMenu(true)} aria-label={t('nav.menu')}><Menu size={22} /></button>}
        </div>
      </div>
      {mobile && <NavSheet open={menu} onClose={() => setMenu(false)} />}
    </header>
  );
}
