import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, Dimensions, Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import Txt from './Txt';

export default function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: ReactNode }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const y = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  useEffect(() => {
    if (open) Animated.spring(y, { toValue: 0, useNativeDriver: true, damping: 22, stiffness: 220 }).start();
    else y.setValue(Dimensions.get('window').height);
  }, [open, y]);
  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={{ flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' }} onPress={onClose}>
        <Animated.View style={{ transform: [{ translateY: y }] }}>
          <Pressable onPress={() => {}} style={{ backgroundColor: colors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: insets.bottom + 16, maxHeight: Dimensions.get('window').height * 0.85 }}>
            <View style={{ alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: colors.line, marginTop: 10 }} />
            {title ? <Txt size={20} weight="bold" style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 6 }}>{title}</Txt> : null}
            <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 8 }}>{children}</ScrollView>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
