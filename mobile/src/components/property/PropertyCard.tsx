import { useRouter } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { categoryOf, factsOf, investmentReturn, media, money, placeOf, priceOf } from '@core';
import type { Project } from '@core';
import { useI18n } from '@/i18n/I18nProvider';
import { useCatalog } from '@/providers/CatalogProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/colors';
import Chip from '../ui/Chip';
import Cover from '../ui/Cover';
import Txt from '../ui/Txt';
import FactIcon from './FactIcon';
import HeartButton from './HeartButton';

const CARD_FACTS = ['beds', 'baths', 'area', 'guests', 'units'];

export function priceLabel(t: ReturnType<typeof useI18n>['t'], price: ReturnType<typeof priceOf>) {
  if (price.amount == null) return t('common.onRequest');
  const lead = price.label === 'from' ? `${t('common.from')} ` : '';
  return `${lead}${money(price.amount, price.currency)}${price.suffix ? ` / ${t(`price.${price.suffix}`)}` : ''}`;
}

export default function PropertyCard({ p }: { p: Project }) {
  const router = useRouter();
  const { colors } = useTheme();
  const { cat } = useCatalog();
  const { t } = useI18n();
  const kind = categoryOf(cat, p);
  const facts = factsOf(cat, p).filter(f => CARD_FACTS.includes(f.key)).slice(0, 3);
  const roi = p.investment ? investmentReturn(p.investment).pct : null;
  return (
    <Pressable onPress={() => router.push(`/property/${p.id}`)}
      style={({ pressed }) => ({ backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1, borderColor: colors.line, overflow: 'hidden', transform: [{ scale: pressed ? 0.985 : 1 }] })}>
      <View>
        <Cover uri={media(cat, p.media.cover)} seed={p.id} style={{ height: 210, width: '100%' }} />
        <View style={{ position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(20,22,28,0.74)', borderRadius: 999, paddingVertical: 5, paddingHorizontal: 11 }}>
          <Txt size={12} weight="semibold" style={{ color: '#fff' }}>{t(`cat.${kind}` as 'cat.resale')}</Txt>
        </View>
        <HeartButton id={p.id} style={{ position: 'absolute', top: 12, right: 12 }} />
        <View style={{ position: 'absolute', left: 12, bottom: 12, backgroundColor: colors.surface, borderRadius: 999, paddingVertical: 7, paddingHorizontal: 13 }}>
          <Txt size={14} weight="heavy">{priceLabel(t, priceOf(cat, p))}</Txt>
        </View>
      </View>
      <View style={{ padding: 16, gap: 8 }}>
        <Txt size={19} weight="bold">{p.name}</Txt>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <MapPin size={14} color={colors.muted} /><Txt size={14} color="muted" numberOfLines={1} style={{ flex: 1 }}>{placeOf(p)}</Txt>
        </View>
        {facts.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 18, paddingTop: 12, marginTop: 4, borderTopWidth: 1, borderTopColor: colors.line }}>
            {facts.map(f => (
              <View key={f.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                <FactIcon k={f.key} color={colors.muted} />
                <View><Txt size={14} weight="semibold" style={{ lineHeight: 17 }}>{f.value}</Txt><Txt size={11.5} color="muted" style={{ lineHeight: 14 }}>{t(`fact.${f.key}` as 'fact.beds')}</Txt></View>
              </View>
            ))}
          </View>
        ) : null}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {kind === 'new-build' ? p.ownership.map(o => <Chip key={o} label={t(p.ownership.length === 1 && o === 'leasehold' ? 'own.leaseOnly' : `own.${o}`)} />) : null}
          {roi != null ? <Chip tone="ok" label={`${t('fact.roi')} ${roi}%`} /> : null}
          {p.rental?.rating ? <Chip label={`★ ${p.rental.rating}`} /> : null}
        </View>
      </View>
    </Pressable>
  );
}
