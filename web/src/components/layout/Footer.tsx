import { Link } from 'react-router-dom';
import { useI18n } from '@/providers/I18nProvider';
import { useCatalog } from '@/providers/CatalogProvider';
import { useConsent } from '@/providers/ConsentProvider';
import Logo from '../ui/Logo';

export default function Footer() {
  const { t } = useI18n();
  const { cat, features } = useCatalog();
  const { reopen } = useConsent();
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <Logo />
          <p className="muted">{t('footer.tagline')}</p>
        </div>
        <div>
          <h4>{t('footer.explore')}</h4>
          <Link to="/properties">{t('nav.browse')}</Link>
          {features.services && <Link to="/services">{t('nav.services')}</Link>}
          <Link to="/about">{t('nav.about')}</Link>
        </div>
        <div>
          <h4>{t('footer.support')}</h4>
          <Link to="/contact">{t('nav.contact')}</Link>
          <Link to="/account">{t('nav.account')}</Link>
          {cat.contact?.email && <a href={`mailto:${cat.contact.email}`}>{cat.contact.email}</a>}
        </div>
      </div>
      <div className="wrap footer-legal">
        <Link to="/legal/terms">{t('legal.terms')}</Link>
        <Link to="/legal/privacy">{t('legal.privacy')}</Link>
        <Link to="/legal/refunds">{t('legal.refunds')}</Link>
        <Link to="/legal/cookies">{t('legal.cookies')}</Link>
        <button className="footer-link-btn" onClick={reopen}>{t('cookie.settings')}</button>
        <Link to="/saved">{t('saved.title')}</Link>
      </div>
      <div className="wrap footer-end muted">© {new Date().getFullYear()} Reeltaz. {t('footer.rights')}</div>
    </footer>
  );
}
