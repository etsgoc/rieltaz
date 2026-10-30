import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/colors';
import Txt from './Txt';

interface Props {
  label: string; onPress: () => void; variant?: 'primary' | 'soft' | 'ghost'; icon?: ReactNode;
  loading?: boolean; disabled?: boolean; style?: StyleProp<ViewStyle>; compact?: boolean;
}

export default function Button({ label, onPress, variant = 'primary', icon, loading, disabled, style, compact }: Props) {
  const { colors } = useTheme();
  const bg = variant === 'primary' ? colors.accent : variant === 'soft' ? colors.surface2 : 'transparent';
  const fg = variant === 'primary' ? 'accentInk' : variant === 'soft' ? 'text' : 'muted';
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={() => { Haptics.selectionAsync().catch(() => {}); onPress(); }}
      style={({ pressed }) => [s.btn, { backgroundColor: bg, paddingVertical: compact ? 10 : 15, opacity: disabled ? 0.5 : 1, transform: [{ scale: pressed ? 0.97 : 1 }], borderColor: variant === 'soft' ? colors.line : 'transparent', borderWidth: 1 }, style]}>
      {loading ? <ActivityIndicator color={colors.accentInk} /> : <View style={s.row}>{icon}<Txt weight="semibold" color={fg}>{label}</Txt></View>}
    </Pressable>
  );
}
const s = StyleSheet.create({ btn: { borderRadius: radius.button, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 }, row: { flexDirection: 'row', alignItems: 'center', gap: 8 } });
