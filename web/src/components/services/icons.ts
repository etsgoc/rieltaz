import { BellRing, Car, KeyRound, Plane, Scale, Sofa, Sparkles, Stamp, type LucideIcon } from 'lucide-react';

const map: Record<string, LucideIcon> = { car: Car, plane: Plane, passport: Stamp, scale: Scale, key: KeyRound, sofa: Sofa, bell: BellRing, sparkles: Sparkles };
export const categoryIcon = (name: string): LucideIcon => map[name] ?? Sparkles;
