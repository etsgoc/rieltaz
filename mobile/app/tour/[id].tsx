import { useLocalSearchParams, useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tourOf } from '@core';
import { useCatalog } from '@/providers/CatalogProvider';
import Pano from '@/components/web/Pano';

export default function TourScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cat } = useCatalog();
  const p = cat.projects.find(x => x.id === id);
  const tour = p ? tourOf(p) : null;
  if (!tour) return null;
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <Pano tour={tour} />
      <Pressable onPress={() => router.back()} style={{ position: 'absolute', top: insets.top + 8, right: 16, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' }}>
        <X size={22} color="#fff" />
      </Pressable>
    </View>
  );
}
