import { Pressable, ScrollView } from 'react-native';
import type { ServiceCategory } from '@core';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/colors';
import Txt from '../ui/Txt';
import { categoryIcon } from './icons';

/** Horizontal top bar of service categories. */
export default function CategoryBar({ categories, value, onChange }: { categories: ServiceCategory[]; value: string; onChange: (id: string) => void }) {
  const { colors } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 18 }} style={{ flexGrow: 0, marginHorizontal: -18 }}>
      {categories.map(c => {
        const on = c.id === value;
        const Icon = categoryIcon(c.icon);
        return (
          <Pressable key={c.id} onPress={() => onChange(c.id)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 15, borderRadius: radius.pill, backgroundColor: on ? colors.accent : colors.surface, borderWidth: 1, borderColor: on ? 'transparent' : colors.line }}>
            <Icon size={17} color={on ? colors.accentInk : colors.muted} />
            <Txt size={14} weight="semibold" color={on ? 'accentInk' : 'text'}>{c.title}</Txt>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
