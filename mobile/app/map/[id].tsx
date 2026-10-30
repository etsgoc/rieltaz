import { useLocalSearchParams, useRouter } from 'expo-router';
import { ExternalLink, X } from 'lucide-react-native';
import { Linking, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mapsLink } from '@core';
import { useI18n } from '@/i18n/I18nProvider';
import { useCatalog } from '@/providers/CatalogProvider';
import { useTheme } from '@/theme/ThemeProvider';
import Button from '@/components/ui/Button';
import Txt from '@/components/ui/Txt';
import MapFrame from '@/components/web/MapFrame';

export default function MapScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { cat } = useCatalog();
  const { t } = useI18n();
  const p = cat.projects.find(x => x.id === id);
  if (!p) return null;
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <MapFrame lat={p.location.lat} lng={p.location.lng} span={0.012} />
      <Pressable onPress={() => router.back()} style={{ position: 'absolute', top: insets.top + 8, right: 16, width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line }}>
        <X size={22} color={colors.text} />
      </Pressable>
      <View style={{ position: 'absolute', left: 16, right: 16, bottom: insets.bottom + 14, gap: 10, padding: 14, borderRadius: 24, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line }}>
        <Txt weight="bold">{p.name}</Txt>
        <Button label={t('prop.openMaps')} icon={<ExternalLink size={16} color={colors.accentInk} />} onPress={() => Linking.openURL(mapsLink(p.location.lat, p.location.lng))} compact />
      </View>
    </View>
  );
}
