import * as Haptics from 'expo-haptics';
import { ConciergeBell, Compass, MessageCircle, UserRound } from 'lucide-react-native';
import type { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n } from '@/i18n/I18nProvider';
import { useCatalog } from '@/providers/CatalogProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/colors';
import Txt from './ui/Txt';

const icons = { index: Compass, services: ConciergeBell, contact: MessageCircle, account: UserRound } as const;
const labels = { index: 'nav.browse', services: 'nav.services', contact: 'nav.contact', account: 'nav.account' } as const;
type Name = keyof typeof icons;

function Item({ name, active, onPress }: { name: Name; active: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const Icon = icons[name];
  const anim = useAnimatedStyle(() => ({
    backgroundColor: active ? colors.accentSoft : 'transparent',
    transform: [{ scale: withSpring(active ? 1 : 0.96, { damping: 16, stiffness: 300 }) }],
  }));
  return (
    <Pressable onPress={onPress} accessibilityRole="tab" accessibilityState={{ selected: active }} style={{ flex: 1 }}>
      <Animated.View style={[s.item, anim]}>
        <Icon size={22} color={active ? colors.accent : colors.muted} />
        <Txt size={11.5} weight={active ? 'semibold' : 'medium'} color={active ? 'accent' : 'muted'}>{t(labels[name])}</Txt>
      </Animated.View>
    </Pressable>
  );
}

type BarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

export function FloatingTabBar({ state, navigateToTab }: BarProps) {
  const { colors } = useTheme();
  const { features } = useCatalog();
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={[s.wrap, { bottom: Math.max(insets.bottom, 10) + 4 }]}>
      <View style={[s.bar, { backgroundColor: colors.surface, borderColor: colors.line, shadowColor: colors.shadow }]}>
        {state.routes.map((route, i) => {
          const name = route.name as Name;
          if (!icons[name] || (name === 'services' && !features.services)) return null;
          return (
            <Item key={route.key} name={name} active={state.index === i}
              onPress={() => { if (state.index !== i) { Haptics.selectionAsync().catch(() => {}); navigateToTab(route.key); } }} />
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16 },
  bar: { flexDirection: 'row', padding: 8, gap: 4, borderRadius: radius.float, borderWidth: 1, shadowOpacity: 0.18, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 10 },
  item: { alignItems: 'center', justifyContent: 'center', gap: 3, paddingVertical: 9, borderRadius: 18 },
});
