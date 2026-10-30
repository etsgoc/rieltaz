import { useState } from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import Cover from '../ui/Cover';
import Txt from '../ui/Txt';

const W = Dimensions.get('window').width;

export default function Gallery({ photos, seed }: { photos: string[]; seed: string }) {
  const { colors } = useTheme();
  const [i, setI] = useState(0);
  const data = photos.length ? photos : [''];
  return (
    <View>
      <FlatList data={data} horizontal pagingEnabled showsHorizontalScrollIndicator={false} keyExtractor={(_, k) => String(k)}
        onMomentumScrollEnd={e => setI(Math.round(e.nativeEvent.contentOffset.x / W))}
        renderItem={({ item, index }) => <Cover uri={item} seed={seed + index} style={{ width: W, height: 330 }} />} />
      <View style={{ position: 'absolute', right: 16, bottom: 14, backgroundColor: colors.surface, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 }}>
        <Txt size={13} weight="semibold">{i + 1} / {data.length}</Txt>
      </View>
    </View>
  );
}
