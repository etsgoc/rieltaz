import { X } from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import { FlatList, Image, Modal, Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { media } from '@core';
import type { PhotoGroup } from '@core';
import { useI18n } from '@/i18n/I18nProvider';
import { useCatalog } from '@/providers/CatalogProvider';
import { useTheme } from '@/theme/ThemeProvider';
import Button from '../ui/Button';
import Chip from '../ui/Chip';
import Txt from '../ui/Txt';

const PAGE = 18;

/** Photos split into areas with chips to switch, a two column grid and a swipeable full screen viewer. */
export default function PhotoGroups({ groups }: { groups: PhotoGroup[] }) {
  const { cat } = useCatalog();
  const { t } = useI18n();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState('all');
  const [shown, setShown] = useState(PAGE);
  const [open, setOpen] = useState<number | null>(null);
  const pager = useRef<FlatList<string>>(null);

  const all = useMemo(() => groups.flatMap(g => g.images), [groups]);
  const urls = (active === 'all' ? all : groups.find(g => g.id === active)?.images ?? []).map(i => media(cat, i));
  const tile = (width - 36 - 8) / 2;
  const pick = (id: string) => { setActive(id); setShown(PAGE); };

  return (
    <View style={{ gap: 12 }}>
      {groups.length > 1 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginHorizontal: -18 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 18 }}>
          <Chip label={`${t('photos.all')} ${all.length}`} on={active === 'all'} onPress={() => pick('all')} />
          {groups.map(g => <Chip key={g.id} label={`${g.label} ${g.images.length}`} on={active === g.id} onPress={() => pick(g.id)} />)}
        </ScrollView>
      ) : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {urls.slice(0, shown).map((src, i) => (
          <Pressable key={src} onPress={() => setOpen(i)} style={{ width: tile, height: tile * 0.75, borderRadius: 12, overflow: 'hidden', backgroundColor: colors.surface2 }}>
            <Image source={{ uri: src }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          </Pressable>
        ))}
      </View>
      {urls.length > shown ? <Button variant="soft" label={`${t('photos.more')} (${urls.length - shown})`} onPress={() => setShown(s => s + PAGE)} /> : null}

      <Modal visible={open !== null} animationType="fade" onRequestClose={() => setOpen(null)} statusBarTranslucent>
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          {open !== null ? (
            <FlatList ref={pager} data={urls} horizontal pagingEnabled showsHorizontalScrollIndicator={false} keyExtractor={u => u}
              initialScrollIndex={open} getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
              onMomentumScrollEnd={e => setOpen(Math.round(e.nativeEvent.contentOffset.x / width))}
              renderItem={({ item }) => <View style={{ width, flex: 1, justifyContent: 'center' }}><Image source={{ uri: item }} style={{ width, height: '100%' }} resizeMode="contain" /></View>} />
          ) : null}
          <Pressable onPress={() => setOpen(null)} style={{ position: 'absolute', top: insets.top + 8, right: 16, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' }}><X size={22} color="#fff" /></Pressable>
          {open !== null ? <Txt style={{ position: 'absolute', bottom: insets.bottom + 18, alignSelf: 'center', color: '#fff' }}>{open + 1} / {urls.length}</Txt> : null}
        </View>
      </Modal>
    </View>
  );
}
