import { Mail, MessageCircle, Phone } from 'lucide-react';
import { inquirySubject, inquiryText, mailHref, telHref, whatsappHref, whatsappNumber } from '@core';
import type { InquiryContext } from '@core';
import { useCatalog } from '@/providers/CatalogProvider';
import { useI18n } from '@/providers/I18nProvider';

interface Props { ctx?: InquiryContext; layout?: 'row' | 'stack' | 'bar'; tone?: 'default' | 'dark' }

/** Call, WhatsApp and email buttons. Every one of them works without an account and without a backend. */
export default function ContactActions({ ctx = {}, layout = 'row', tone = 'default' }: Props) {
  const { cat } = useCatalog();
  const { t } = useI18n();
  const c = cat.contact;
  if (!c) return null;
  const text = inquiryText(ctx);
  const wa = whatsappNumber(c);
  const icon = layout === 'bar' ? 18 : 18;
  const items = [
    c.phone && { key: 'call', href: telHref(c.phone), Icon: Phone, label: t('act.call'), long: t('act.callNow'), cls: 'act-call' },
    wa && { key: 'wa', href: whatsappHref(wa, text), Icon: MessageCircle, label: t('act.whatsapp'), long: t('act.writeWhatsapp'), cls: 'act-wa', ext: true },
    c.email && { key: 'mail', href: mailHref(c.email, inquirySubject(ctx), text), Icon: Mail, label: t('act.email'), long: t('act.writeEmail'), cls: 'act-mail' },
  ].filter(Boolean) as { key: string; href: string; Icon: typeof Phone; label: string; long: string; cls: string; ext?: boolean }[];
  return (
    <div className={`actions actions-${layout} actions-${tone}`}>
      {items.map(i => (
        <a key={i.key} className={`act ${i.cls}`} href={i.href} {...(i.ext ? { target: '_blank', rel: 'noreferrer' } : {})} aria-label={i.long}>
          <i.Icon size={icon} /><span>{layout === 'stack' ? i.long : i.label}</span>
        </a>
      ))}
    </div>
  );
}
