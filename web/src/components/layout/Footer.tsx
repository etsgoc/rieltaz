import { Link } from 'react-router-dom';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { mailHref, telHref, whatsappHref, whatsappNumber } from '@core';
import { useI18n } from '@/providers/I18nProvider';
import { useCatalog } from '@/providers/CatalogProvider';
import { useConsent } from '@/providers/ConsentProvider';
import { BRAND } from '@/config';
import Logo from '../ui/Logo';

export default function Footer() {
  const { t } = useI18n();
  const { cat, features } = useCatalog();
  const { reopen } = useConsent();
  const c = cat.contact;
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <Logo />
          <p className="muted">{t('footer.tagline')}</p>
        </div>
        <div>
          <h4>{t('footer.explore')}</h4>
          {(['new-build', 'resale', 'rental', 'investment'] as const).map(k => <Link key={k} to={`/properties?cat=${k}`}>{t(`cat.${k}`)}</Link>)}
          {features.services && <Link to="/services">{t('nav.services')}</Link>}
        </div>
        <div>
          <h4>{t('footer.support')}</h4>
          <Link to="/about">{t('nav.about')}</Link>
          <Link to="/contact">{t('nav.contact')}</Link>
          <Link to="/saved">{t('saved.title')}</Link>
        </div>
        <div className="footer-contact">
          <h4>{t('contact.reachUs')}</h4>
          {c?.phone && <a href={telHref(c.phone)}><Phone size={15} />{c.phone}</a>}
          {whatsappNumber(c) && <a href={whatsappHref(whatsappNumber(c))} target="_blank" rel="noreferrer"><MessageCircle size={15} />WhatsApp</a>}
          {c?.email && <a href={mailHref(c.email, 'Enquiry', '')}><Mail size={15} />{c.email}</a>}
          {c?.city && <span className="muted"><MapPin size={15} />{c.city}</span>}
        </div>
      </div>
      <div className="wrap footer-legal">
        <Link to="/legal/terms">{t('legal.terms')}</Link>
        <Link to="/legal/privacy">{t('legal.privacy')}</Link>
        <Link to="/legal/refunds">{t('legal.refunds')}</Link>
        <Link to="/legal/cookies">{t('legal.cookies')}</Link>
        <button className="footer-link-btn" onClick={reopen}>{t('cookie.settings')}</button>
      </div>
      <div className="wrap footer-end muted">© {new Date().getFullYear()} {BRAND.name}. {t('footer.rights')}</div>
    </footer>
  );
}
