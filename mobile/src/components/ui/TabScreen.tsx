import { ScrollView, StyleSheet, View, type RefreshControlProps } from 'react-native';
import type { ReactElement, ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { TAB_SPACE } from '@/theme/colors';
import Txt from './Txt';

interface Props {
  title: string;
  icon?: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
  refreshControl?: ReactElement<RefreshControlProps>;
}

/** Tab screen with a fixed header. Only the content below it scrolls. */
export default function TabScreen({ title, icon, extra, children, refreshControl }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 18, paddingBottom: 12, backgroundColor: colors.bg, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line, zIndex: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {icon}
          <Txt size={30} weight="heavy" numberOfLines={1}>{title}</Txt>
        </View>
        {extra ? <View style={{ marginTop: 12 }}>{extra}</View> : null}
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 18, paddingBottom: TAB_SPACE }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} refreshControl={refreshControl}>
        {children}
      </ScrollView>
    </View>
  );
}
