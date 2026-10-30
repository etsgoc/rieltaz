import { useRouter } from 'expo-router';
import { ChevronLeft, X } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import Txt from './Txt';

export default function Header({ title, close, right }: { title?: string; close?: boolean; right?: ReactNode }) {
  const { colors } = useTheme();
  const router = useRouter();
  const Icon = close ? X : ChevronLeft;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} hitSlop={10}
        style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={22} color={colors.text} />
      </Pressable>
      <Txt size={20} weight="bold" style={{ flex: 1 }} numberOfLines={1}>{title}</Txt>
      {right}
    </View>
  );
}
