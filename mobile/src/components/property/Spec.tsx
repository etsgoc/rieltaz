import { View } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme } from '@/theme/ThemeProvider';
import Txt from '../ui/Txt';

/** Label and value rows for rental terms and investment numbers. Rows without a value are skipped. */
export default function Spec({ rows }: { rows: ({ label: string; value?: ReactNode; ok?: boolean } | false | null | undefined)[] }) {
  const { colors } = useTheme();
  return (
    <View>
      {rows.filter((r): r is { label: string; value?: ReactNode; ok?: boolean } => Boolean(r && r.value != null && r.value !== '')).map(r => (
        <View key={r.label} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.line }}>
          <Txt color="muted" style={{ flex: 1 }}>{r.label}</Txt>
          <Txt weight="semibold" color={r.ok ? 'ok' : 'text'} style={{ flexShrink: 1, textAlign: 'right' }}>{r.value}</Txt>
        </View>
      ))}
    </View>
  );
}
