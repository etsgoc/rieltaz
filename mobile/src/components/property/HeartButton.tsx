import * as Haptics from 'expo-haptics';
import { Heart } from 'lucide-react-native';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { useI18n } from '@/i18n/I18nProvider';
import { useFavorites } from '@/providers/FavoritesProvider';
import { useTheme } from '@/theme/ThemeProvider';

export default function HeartButton({ id, style }: { id: string; style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const { has, toggle } = useFavorites();
  const on = has(id);
  return (
    <Pressable
      accessibilityLabel={on ? t('saved.remove') : t('saved.add')}
      hitSlop={8}
      onPress={() => { Haptics.selectionAsync().catch(() => {}); toggle(id); }}
      style={[{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Heart size={19} color={on ? colors.danger : colors.text} fill={on ? colors.danger : 'transparent'} />
    </Pressable>
  );
}
