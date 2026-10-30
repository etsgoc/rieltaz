import type { Catalog, Features, Service } from './types';

export const ORDER_STATUSES = ['requested', 'quoted', 'confirmed', 'paid', 'completed', 'cancelled'] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];

export interface OrderDetails { date?: string; people?: number; notes?: string }
export interface Order {
  id: string; user_id: string; service_id: string; service_title: string;
  option_label: string | null; quantity: number; details: OrderDetails;
  quoted_amount: number | null; final_amount: number | null; currency: string;
  status: OrderStatus; ticket_code: string | null; partner_id: string | null;
  platform_fee: number | null; partner_amount: number | null; payment_ref: string | null;
  created_at: string;
}

export const features = (cat: Catalog): Features => ({
  services: cat.features?.services ?? false,
  onlinePayments: cat.features?.onlinePayments ?? false,
});

export const servicesIn = (cat: Catalog, categoryId: string): Service[] =>
  (cat.services ?? []).filter(s => s.categoryId === categoryId && !s.hidden);

export function estimate(service: Service, optionId?: string, people = 1): number | null {
  const opt = service.options?.find(o => o.id === optionId);
  const base = opt?.price ?? service.priceFrom ?? null;
  if (base == null || service.requestOnly) return null;
  return Math.round(base * (service.needsPeople ? Math.max(1, people) : 1) * 100) / 100;
}

export function splitAmount(amount: number, commissionPct: number) {
  const platform = Math.round(amount * commissionPct) / 100;
  return { platform, partner: Math.round((amount - platform) * 100) / 100 };
}
