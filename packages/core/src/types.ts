export type Ownership = 'leasehold' | 'freehold';
export type UnitStatus = 'available' | 'reserved' | 'sold';

export interface PlanStep { label: string; pct: number; extra?: number; lessReservation?: boolean; when?: string }
export interface PaymentPlan { name?: string; reservation: number; steps: PlanStep[] }
export interface FeeSchedule {
  commonAreaPerSqmMonth: number; sinkingPerSqm: number; meters: number; admin: number;
  transferPct: Partial<Record<Ownership, number>>;
}
export interface Unit {
  id: string; projectId: string; tower: string; floor: number;
  type: string; sqm: number; pricePerSqm: number; price: number; status: UnitStatus;
  /** Price per ownership type when they differ (for example freehold above leasehold). `price` is the default. */
  prices?: Partial<Record<Ownership, number>>;
  /** Payment plan key when this unit uses a different plan than the project (for example a nearly finished tower). */
  plan?: string;
  /** Free text shown beside the type, for example "Premium pool access, high ceiling 3.75 m". */
  style?: string; view?: string;
}
export interface Tour { type: 'pano' | 'embed'; url: string }
export type PropertyCategory = 'new-build' | 'resale' | 'rental' | 'investment';

/** Optional quick facts. Any of them can be left out. */
export interface Facts { bedrooms?: number; bathrooms?: number; area?: number; plot?: number; guests?: number; year?: number; floor?: number; parking?: number }
/** Short stay or long let listing, for example one scouted on Airbnb. */
export interface RentalInfo {
  nightly?: number; monthly?: number; currency?: string; minNights?: number; cleaningFee?: number; deposit?: number;
  occupancyPct?: number; rating?: number; reviews?: number; source?: string; sourceUrl?: string; availableFrom?: string; rules?: string[];
}
/** Renovation or investor opportunity. */
export interface InvestmentInfo {
  purchasePrice: number; renovationBudget: number; afterRepairValue: number; currency?: string;
  strategy?: string; timelineMonths?: number; targetRaise?: number; raised?: number; minTicket?: number; roiPct?: number; scope?: string[];
}
export interface Project {
  id: string; name: string; developerId?: string; ownership: Ownership[];
  category?: PropertyCategory; paymentPlan?: string;
  /** Other payment plans buyers can choose between, by key in `paymentPlans`. */
  altPaymentPlans?: string[]; fees?: string; status: string;
  tagline?: string; summary?: string; featured?: boolean;
  location: { area: string; city: string; country?: string; lat: number; lng: number };
  media: { cover: string; gallery: string[]; tour360: Tour | string | null };
  pricing?: { from: number | null; currency: string };
  facts?: Facts; rental?: RentalInfo; investment?: InvestmentInfo;
  amenities?: string[];
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
export interface Contact {
  phone: string; email: string; whatsapp?: string; hours?: string; city?: string;
  /** Optional free form endpoint (Formspree, Web3Forms). Without it the form opens the visitor's email app. */
  formEndpoint?: string; formKey?: string;
}
/** `serviceCategories` picks which service categories show when `services` is on. Empty means all of them. */
export interface Features { services: boolean; onlinePayments: boolean; serviceCategories: string[] }

export interface Catalog {
  version: number; updatedAt: string; mediaBase: string;
  features?: Partial<Features>;
  contact?: Contact;
  agent?: { name: string; title?: string; photo?: string; languages?: string[] };
  hero?: { image?: string };
  /** Approximate value of one unit of each currency in USD. Only used to sort listings priced in different currencies. */
  rates?: Record<string, number>;
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
