import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/colors';

export default function Card({ style, ...rest }: ViewProps & { style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme();
  return <View {...rest} style={[{ backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1, borderColor: colors.line, padding: 18, shadowColor: colors.shadow, shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 2 }, style]} />;
}
