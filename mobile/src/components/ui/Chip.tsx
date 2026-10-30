import { Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/colors';
import Txt from './Txt';

export default function Chip({ label, on, onPress, tone }: { label: string; on?: boolean; onPress?: () => void; tone?: 'ok' | 'warn' | 'accent' }) {
  const { colors } = useTheme();
  const bg = on ? colors.accent : tone === 'ok' ? colors.okSoft : tone === 'warn' ? colors.warnSoft : tone === 'accent' ? colors.accentSoft : colors.surface2;
  const fg = on ? 'accentInk' : tone === 'ok' ? 'ok' : tone === 'warn' ? 'warn' : tone === 'accent' ? 'accent' : 'text';
  return (
    <Pressable disabled={!onPress} onPress={onPress} style={[s.chip, { backgroundColor: bg, borderColor: on || tone ? 'transparent' : colors.line }]}>
      <Txt size={13} weight="medium" color={fg}>{label}</Txt>
    </Pressable>
  );
}
const s = StyleSheet.create({ chip: { borderRadius: radius.pill, paddingVertical: 6, paddingHorizontal: 13, borderWidth: 1 } });
