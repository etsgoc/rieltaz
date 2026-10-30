import { View } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/colors';
import Txt from './Txt';

export default function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ alignItems: 'center', gap: 14, padding: 32, borderRadius: radius.card, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.line }}>
      <Txt weight="semibold" style={{ textAlign: 'center' }}>{title}</Txt>
      {children}
    </View>
  );
}
