import { View } from 'react-native';
import type { LegalDoc } from '@core';
import { useI18n } from '@/i18n/I18nProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/colors';
import Txt from '../ui/Txt';

export default function LegalDocument({ doc }: { doc: LegalDoc }) {
  const { t } = useI18n();
  const { colors } = useTheme();
  return (
    <View style={{ gap: 12 }}>
      <Txt size={13} color="muted">{t('legal.updated', { date: doc.updated })}</Txt>
      <View style={{ padding: 14, borderRadius: radius.button, backgroundColor: colors.accentSoft }}>
        <Txt size={14} color="accent">{t('legal.notice')}</Txt>
      </View>
      {doc.sections.map(s => (
        <View key={s.heading} style={{ gap: 6, marginTop: 8 }}>
          <Txt size={18} weight="bold">{s.heading}</Txt>
          {s.paragraphs.map((p, i) => <Txt key={i} size={15} color="muted">{p}</Txt>)}
        </View>
      ))}
    </View>
  );
}
