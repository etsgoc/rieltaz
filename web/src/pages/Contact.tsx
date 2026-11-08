import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { mailHref, telHref, whatsappHref, whatsappNumber } from '@core';
import { useCatalog } from '@/providers/CatalogProvider';
import { useI18n } from '@/providers/I18nProvider';
import AgentCard from '@/components/contact/AgentCard';
import ContactActions from '@/components/contact/ContactActions';
import ContactForm from '@/components/forms/ContactForm';
import { usePageMeta } from '@/lib/meta';

export default function Contact() {
  const { cat } = useCatalog();
  const { t } = useI18n();
  const c = cat.contact;
  usePageMeta(t('nav.contact'), t('contact.subtitle'));
  const lines = [
    c?.phone && { icon: Phone, label: t('act.call'), value: c.phone, href: telHref(c.phone) },
    whatsappNumber(c) && { icon: MessageCircle, label: t('act.whatsapp'), value: whatsappNumber(c), href: whatsappHref(whatsappNumber(c)) },
    c?.email && { icon: Mail, label: t('act.email'), value: c.email, href: mailHref(c.email, 'Enquiry', '') },
    c?.hours && { icon: Clock, label: t('contact.hours'), value: c.hours },
    c?.city && { icon: MapPin, label: t('contact.office'), value: c.city },
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href?: string }[];
  return (
    <div className="wrap section">
      <div className="page-head"><h1>{t('contact.title')}</h1><p className="muted">{t('contact.subtitle')}</p></div>
      <div className="contact-grid">
        <div className="panel stack">
          <AgentCard />
          <ContactActions layout="stack" />
          <ul className="contact-list">
            {lines.map(l => (
              <li key={l.label}>
                <span className="fact-ic"><l.icon size={18} /></span>
                <span><small className="muted">{l.label}</small>{l.href ? <a href={l.href}>{l.value}</a> : <strong>{l.value}</strong>}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel">
          <h2 className="form-title">{t('contact.formTitle')}</h2>
          <ContactForm compact />
        </div>
      </div>
    </div>
  );
}
