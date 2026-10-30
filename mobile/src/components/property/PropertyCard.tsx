import { useRouter } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { fromPrice, media, unitsOf } from '@core';
import type { Project } from '@core';
import { useI18n } from '@/i18n/I18nProvider';
import { thb } from '@/lib/format';
import { useCatalog } from '@/providers/CatalogProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/colors';
import Chip from '../ui/Chip';
import Cover from '../ui/Cover';
import Txt from '../ui/Txt';
import HeartButton from './HeartButton';

export default function PropertyCard({ p }: { p: Project }) {
  const router = useRouter();
  const { colors } = useTheme();
  const { cat } = useCatalog();
  const { t } = useI18n();
  const from = fromPrice(cat, p);
  const count = unitsOf(cat, p.id).length;
  return (
    <Pressable onPress={() => router.push(`/property/${p.id}`)}
      style={({ pressed }) => ({ backgroundColor: colors.surface, borderRadius: radius.card, borderWidth: 1, borderColor: colors.line, overflow: 'hidden', transform: [{ scale: pressed ? 0.985 : 1 }] })}>
      <View>
        <Cover uri={media(cat, p.media.cover)} seed={p.id} style={{ height: 190, width: '100%' }} />
        <HeartButton id={p.id} style={{ position: 'absolute', top: 12, right: 12 }} />
      </View>
      <View style={{ padding: 16, gap: 8 }}>
        <Txt size={19} weight="bold">{p.name}</Txt>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <MapPin size={14} color={colors.muted} /><Txt size={14} color="muted">{p.location.area}, {p.location.city}</Txt>
        </View>
        {p.tagline ? <Txt size={15}>{p.tagline}</Txt> : null}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {p.ownership.map(o => <Chip key={o} label={t(p.ownership.length === 1 && o === 'leasehold' ? 'own.leaseOnly' : `own.${o}`)} />)}
          {count > 0 ? <Chip label={`${count} ${t('prop.units')}`} /> : null}
        </View>
        <Txt weight="bold">{from ? `${t('common.from')} ${thb(from)}` : t('common.onRequest')}</Txt>
      </View>
    </Pressable>
  );
}
