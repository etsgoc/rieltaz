export type Ownership = 'leasehold' | 'freehold';
export type UnitStatus = 'available' | 'reserved' | 'sold';

export interface PlanStep { label: string; pct: number; extra?: number; lessReservation?: boolean; when?: string }
export interface PaymentPlan { reservation: number; steps: PlanStep[] }
export interface FeeSchedule {
  commonAreaPerSqmMonth: number; sinkingPerSqm: number; meters: number; admin: number;
  transferPct: Partial<Record<Ownership, number>>;
}
export interface Unit {
  id: string; projectId: string; tower: string; floor: number;
  type: string; sqm: number; pricePerSqm: number; price: number; status: UnitStatus;
}
export interface Tour { type: 'pano' | 'embed'; url: string }
export interface Project {
  id: string; name: string; developerId: string; ownership: Ownership[];
  paymentPlan: string; fees: string; status: string;
  tagline?: string; summary?: string;
  location: { area: string; city: string; lat: number; lng: number };
  media: { cover: string; gallery: string[]; tour360: Tour | string | null };
  [key: string]: unknown;
}

export interface ServiceCategory { id: string; title: string; blurb: string; icon: string }
export interface ServiceOption { id: string; label: string; price: number }
export interface Service {
  id: string; categoryId: string; title: string; blurb: string; image?: string;
  priceFrom?: number | null; unit?: string; currency?: string;
  requestOnly?: boolean; needsDate?: boolean; needsPeople?: boolean;
  options?: ServiceOption[]; partnerId?: string; commissionPct?: number; hidden?: boolean;
}
export interface Partner { id: string; name: string; payout?: string }
export interface Features { services: boolean; onlinePayments: boolean }

export interface Catalog {
  version: number; updatedAt: string; mediaBase: string;
  features?: Partial<Features>;
  contact?: { phone: string; email: string };
  developers?: { id: string; name: string; area: string; blurb?: string; email?: string; phone?: string }[];
  projects: Project[]; units: Unit[];
  paymentPlans: Record<string, PaymentPlan>;
  feeSchedules: Record<string, FeeSchedule>;
  serviceCategories?: ServiceCategory[];
  services?: Service[];
  partners?: Partner[];
  legal?: { company: string; email: string; address: string };
  [key: string]: unknown;
}
