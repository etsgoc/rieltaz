import { useRouter } from 'expo-router';
import { Check, ChevronRight, Globe, Heart, Mail, ShieldCheck } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { LANGS } from '@core';
import { useI18n } from '@/i18n/I18nProvider';
import { useTheme, type Mode } from '@/theme/ThemeProvider';
import Card from '@/components/ui/Card';
import TabScreen from '@/components/ui/TabScreen';
import Segmented from '@/components/ui/Segmented';
import Sheet from '@/components/ui/Sheet';
import Txt from '@/components/ui/Txt';

function Row({ icon, label, value, onPress }: { icon: React.ReactNode; label: string; value?: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 }}>
      {icon}<Txt weight="medium" style={{ flex: 1 }}>{label}</Txt>
      {value ? <Txt color="muted">{value}</Txt> : null}<ChevronRight size={18} color={colors.muted} />
    </Pressable>
  );
}

export default function Account() {
  const router = useRouter();
  const { colors, mode, setMode } = useTheme();
  const { lang, setLang, t } = useI18n();
  const [sheet, setSheet] = useState(false);

  return (
    <TabScreen title={t('nav.account')}>
      <Card style={{ gap: 12, marginBottom: 16 }}>
        <Txt weight="semibold">{t('common.theme')}</Txt>
        <Segmented<Mode> value={mode} onChange={setMode} options={[{ value: 'light', label: t('common.light') }, { value: 'dark', label: t('common.dark') }, { value: 'system', label: t('common.system') }]} />
      </Card>

      <Card style={{ paddingVertical: 4 }}>
        <Row icon={<Globe size={20} color={colors.muted} />} label={t('common.language')} value={LANGS.find(l => l.code === lang)?.label} onPress={() => setSheet(true)} />
        <View style={{ height: 1, backgroundColor: colors.line }} />
        <Row icon={<Heart size={20} color={colors.muted} />} label={t('saved.title')} onPress={() => router.push('/saved')} />
        <View style={{ height: 1, backgroundColor: colors.line }} />
        <Row icon={<Mail size={20} color={colors.muted} />} label={t('nav.contact')} onPress={() => router.push('/contact')} />
      </Card>

      <Card style={{ paddingVertical: 4, marginTop: 16 }}>
        {(['terms', 'privacy', 'refunds', 'cookies'] as const).map((id, i) => (
          <View key={id}>
            {i > 0 ? <View style={{ height: 1, backgroundColor: colors.line }} /> : null}
            <Row icon={<ShieldCheck size={20} color={colors.muted} />} label={t(`legal.${id}`)} onPress={() => router.push(`/legal/${id}`)} />
          </View>
        ))}
      </Card>

      <Sheet open={sheet} onClose={() => setSheet(false)} title={t('common.language')}>
        {LANGS.map(l => (
          <Pressable key={l.code} onPress={() => { setLang(l.code); setSheet(false); }} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}>
            <Txt size={17} weight="medium" style={{ flex: 1 }}>{l.label}</Txt>{l.code === lang ? <Check size={20} color={colors.accent} /> : null}
          </Pressable>
        ))}
      </Sheet>
    </TabScreen>
  );
}
