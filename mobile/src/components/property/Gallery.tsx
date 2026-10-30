import { useState } from 'react';
import { Dimensions, FlatList, Pressable, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import Cover from '../ui/Cover';
import Txt from '../ui/Txt';
import ImageViewer from './ImageViewer';

const W = Dimensions.get('window').width;

/** Swipe here, or tap a photo to open it full screen. */
export default function Gallery({ photos, seed }: { photos: string[]; seed: string }) {
  const { colors } = useTheme();
  const [i, setI] = useState(0);
  const [viewer, setViewer] = useState<number | null>(null);
  const data = photos.length ? photos : [''];
  return (
    <View>
      <FlatList
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, k) => String(k)}
        onMomentumScrollEnd={e => setI(Math.round(e.nativeEvent.contentOffset.x / W))}
        renderItem={({ item, index }) => (
          <Pressable onPress={() => item && setViewer(index)}>
            <Cover uri={item} seed={seed + index} style={{ width: W, height: 330 }} />
          </Pressable>
        )}
      />
      <View pointerEvents="none" style={{ position: 'absolute', right: 16, bottom: 14, backgroundColor: colors.surface, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 }}>
        <Txt size={13} weight="semibold">{i + 1} / {data.length}</Txt>
      </View>
      {photos.length > 0 && <ImageViewer photos={photos} start={viewer} onClose={() => setViewer(null)} />}
    </View>
  );
}
