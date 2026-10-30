import { Text, type TextProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import type { Palette } from '@/theme/colors';

interface Props extends TextProps {
  size?: number; weight?: 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy'; color?: keyof Palette;
}
const W = { regular: '400', medium: '500', semibold: '600', bold: '700', heavy: '800' } as const;

export default function Txt({ size = 16, weight = 'regular', color = 'text', style, ...rest }: Props) {
  const { colors } = useTheme();
  return <Text {...rest} style={[{ fontSize: size, fontWeight: W[weight], color: colors[color], lineHeight: Math.round(size * 1.4) }, style]} />;
}
