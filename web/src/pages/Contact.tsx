import { Mail, Phone } from 'lucide-react';
import { useCatalog } from '@/providers/CatalogProvider';
import { useI18n } from '@/providers/I18nProvider';
import ContactForm from '@/components/forms/ContactForm';

export default function Contact() {
  const { cat } = useCatalog();
  const { t } = useI18n();
  return (
    <div className="wrap section narrow">
      <h1>{t('contact.title')}</h1>
      <p className="muted">{t('contact.subtitle')}</p>
      <div className="panel"><ContactForm compact /></div>
      <div className="contact-lines">
        {cat.contact?.email && <a href={`mailto:${cat.contact.email}`}><Mail size={18} />{cat.contact.email}</a>}
        {cat.contact?.phone && <a href={`tel:${cat.contact.phone.replace(/\s/g, '')}`}><Phone size={18} />{cat.contact.phone}</a>}
      </div>
    </div>
  );
}
