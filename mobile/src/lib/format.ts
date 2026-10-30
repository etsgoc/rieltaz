export const thb = (n: number, currency = 'THB') => Math.round(n).toLocaleString('en-US') + ' ' + currency;
export const dateTime = (iso: string, locale?: string) => new Date(iso).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' });
export const shortDate = (iso: string, locale?: string) => new Date(iso).toLocaleDateString(locale, { dateStyle: 'medium' });
