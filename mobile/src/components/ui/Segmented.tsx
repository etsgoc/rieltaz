import { Pressable, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/colors';
import Txt from './Txt';

export default function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', backgroundColor: colors.surface2, borderRadius: radius.pill, padding: 3, borderWidth: 1, borderColor: colors.line }}>
      {options.map(o => (
        <Pressable key={o.value} onPress={() => onChange(o.value)} style={{ flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: radius.pill, backgroundColor: o.value === value ? colors.surface : 'transparent' }}>
          <Txt size={14} weight={o.value === value ? 'semibold' : 'medium'} color={o.value === value ? 'text' : 'muted'}>{o.label}</Txt>
        </Pressable>
      ))}
    </View>
  );
}
