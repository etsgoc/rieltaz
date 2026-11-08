import { BedDouble, Bath, Building2, CalendarDays, Maximize, Ruler, Users } from 'lucide-react';
import type { FactKey } from '@core';

const map = { beds: BedDouble, baths: Bath, area: Ruler, guests: Users, plot: Maximize, year: CalendarDays, units: Building2 } as const;
export default function FactIcon({ k, size = 18 }: { k: FactKey; size?: number }) {
  const I = map[k];
  return <I size={size} aria-hidden />;
}
