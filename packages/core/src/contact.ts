import type { Contact } from './types';

const digits = (s: string) => s.replace(/[^\d]/g, '');
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
export const whatsappHref = (phone: string, text?: string) => `https://wa.me/${digits(phone)}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
export const mailHref = (email: string, subject: string, body: string) => `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

/** WhatsApp number falls back to the main phone number. */
export const whatsappNumber = (c?: Contact) => c?.whatsapp || c?.phone || '';

export interface InquiryContext { property?: string; unit?: string; ownership?: string; price?: string; service?: string; details?: string[]; note?: string; name?: string }
export function inquiryText(c: InquiryContext) {
  const lines = [c.name ? `Hello, I am ${c.name}.` : 'Hello,'];
  if (c.property) lines.push(`I am interested in ${c.property}.`);
  if (c.service) lines.push(`I would like to request: ${c.service}.`);
  if (c.unit) lines.push(`Unit: ${c.unit}${c.ownership ? `, ${c.ownership}` : ''}${c.price ? `, ${c.price}` : ''}.`);
  (c.details ?? []).forEach(d => lines.push(d));
  if (c.note) lines.push('', c.note);
  return lines.join('\n');
}
export const inquirySubject = (c: InquiryContext) => c.service ? `Service request: ${c.service}` : c.property ? `Enquiry: ${c.property}${c.unit ? ` (${c.unit})` : ''}` : 'Enquiry';
