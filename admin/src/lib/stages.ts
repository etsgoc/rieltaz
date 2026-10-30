export const STAGES = ['requested', 'meeting_booked', 'documents', 'reservation_signed', 'fee_paid', 'contract_signed', 'closed', 'cancelled'] as const;
export const ORDER_STATUSES = ['requested', 'quoted', 'confirmed', 'paid', 'completed', 'cancelled'] as const;
export const label = (s: string) => { const t = s.replace(/_/g, ' '); return t[0].toUpperCase() + t.slice(1); };
export const tone = (s: string) => (['closed', 'completed', 'paid', 'contract_signed'].includes(s) ? 'ok' : s === 'cancelled' ? 'warn' : 'accent') as 'ok' | 'warn' | 'accent';
