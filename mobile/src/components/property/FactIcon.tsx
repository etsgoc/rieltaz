import { Bath, BedDouble, Building2, CalendarDays, Maximize, Ruler, Users } from 'lucide-react-native';
import type { FactKey } from '@core';

const map = { beds: BedDouble, baths: Bath, area: Ruler, guests: Users, plot: Maximize, year: CalendarDays, units: Building2 } as const;
export default function FactIcon({ k, size = 16, color }: { k: FactKey; size?: number; color: string }) {
  const I = map[k];
  return <I size={size} color={color} />;
}
