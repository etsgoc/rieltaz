export const thb = (n: number, currency = 'THB') =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n) + ' ' + currency;

export const dateTime = (iso: string, locale?: string) =>
  new Date(iso).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' });

export const shortDate = (iso: string, locale?: string) =>
  new Date(iso).toLocaleDateString(locale, { dateStyle: 'medium' });
