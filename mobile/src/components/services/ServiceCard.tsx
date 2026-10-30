import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import type { Service } from '@core';
import { useI18n } from '@/i18n/I18nProvider';
import { thb } from '@/lib/format';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/colors';
import Cover from '../ui/Cover';
import Txt from '../ui/Txt';

export default function ServiceCard({ s }: { s: Service }) {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useI18n();
  const from = s.options?.length ? Math.min(...s.options.map(o => o.price)) : s.priceFrom;
  return (
    <Pressable onPress={() => router.push(`/service/${s.id}`)}
      style={({ pressed }) => ({ backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1, borderColor: colors.line, overflow: 'hidden', transform: [{ scale: pressed ? 0.985 : 1 }] })}>
      <Cover uri={s.image} seed={s.id} style={{ height: 150, width: '100%' }} />
      <View style={{ padding: 16, gap: 6 }}>
        <Txt size={18} weight="bold">{s.title}</Txt>
        <Txt size={14.5} color="muted">{s.blurb}</Txt>
        <Txt weight="bold">{from && !s.requestOnly ? `${t('svc.from')} ${thb(from, s.currency)}${s.unit ? ' · ' + s.unit : ''}` : t('svc.quoteOnly')}</Txt>
      </View>
    </Pressable>
  );
}
