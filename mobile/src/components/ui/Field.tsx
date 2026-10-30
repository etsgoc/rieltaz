import { TextInput, View, type TextInputProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/colors';
import Txt from './Txt';

export default function Field({ label, ...rest }: TextInputProps & { label: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <Txt size={13} color="muted">{label}</Txt>
      <TextInput placeholderTextColor={colors.muted} {...rest}
        style={[{ backgroundColor: colors.bg, borderColor: colors.line, borderWidth: 1, borderRadius: radius.input, paddingHorizontal: 14, paddingVertical: 13, fontSize: 16, color: colors.text }, rest.multiline && { minHeight: 96, textAlignVertical: 'top' }]} />
    </View>
  );
}
