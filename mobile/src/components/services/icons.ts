import { BellRing, Car, KeyRound, Plane, Scale, Sofa, Sparkles, Stamp } from 'lucide-react-native';

const map = { car: Car, plane: Plane, passport: Stamp, scale: Scale, key: KeyRound, sofa: Sofa, bell: BellRing, sparkles: Sparkles } as const;
export const categoryIcon = (name: string) => (map as Record<string, typeof Car>)[name] ?? Sparkles;
