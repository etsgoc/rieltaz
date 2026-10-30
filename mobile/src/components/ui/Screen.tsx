import { ScrollView, View, type RefreshControlProps } from 'react-native';
import type { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { TAB_SPACE } from '@/theme/colors';

interface Props { children: ReactNode; tabs?: boolean; scroll?: boolean; padded?: boolean; bottom?: number; refreshControl?: React.ReactElement<RefreshControlProps> }

export default function Screen({ children, tabs, scroll = true, padded = true, bottom = 0, refreshControl }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const pad = { paddingTop: insets.top + 8, paddingBottom: (tabs ? TAB_SPACE : insets.bottom + 24) + bottom, paddingHorizontal: padded ? 18 : 0 };
  if (!scroll) return <View style={{ flex: 1, backgroundColor: colors.bg, ...pad }}>{children}</View>;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={pad} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} refreshControl={refreshControl}>
      {children}
    </ScrollView>
  );
}
