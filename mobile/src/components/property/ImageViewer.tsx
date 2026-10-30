import { X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { FlatList, Image, Modal, Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Txt from '../ui/Txt';

interface Props { photos: string[]; start: number | null; onClose: () => void }

/** Full screen viewer. Swipe between photos, pinch to zoom on iOS. */
export default function ImageViewer({ photos, start, onClose }: Props) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [i, setI] = useState(start ?? 0);
  useEffect(() => { if (start !== null) setI(start); }, [start]);

  return (
    <Modal visible={start !== null} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        {start !== null && (
          <FlatList
            key={start}
            data={photos}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={start}
            getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
            keyExtractor={(_, k) => String(k)}
            onMomentumScrollEnd={e => setI(Math.round(e.nativeEvent.contentOffset.x / width))}
            renderItem={({ item }) => (
              <ScrollView style={{ width, height }} contentContainerStyle={{ width, height, justifyContent: 'center' }} maximumZoomScale={3} minimumZoomScale={1} centerContent showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} bouncesZoom>
                <Image source={{ uri: item }} style={{ width, height: height * 0.8 }} resizeMode="contain" />
              </ScrollView>
            )}
          />
        )}
        <Pressable onPress={onClose} hitSlop={10} style={{ position: 'absolute', top: insets.top + 10, right: 16, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' }}>
          <X size={22} color="#fff" />
        </Pressable>
        <View style={{ position: 'absolute', bottom: insets.bottom + 20, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6 }}>
          <Txt size={14} weight="semibold" style={{ color: '#fff' }}>{i + 1} / {photos.length}</Txt>
        </View>
      </View>
    </Modal>
  );
}
