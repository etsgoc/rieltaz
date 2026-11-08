import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react-native';
import { View } from 'react-native';
import { useI18n } from '@/i18n/I18nProvider';
import { useCatalog } from '@/providers/CatalogProvider';
import { useTheme } from '@/theme/ThemeProvider';
import ContactActions from '@/components/contact/ContactActions';
import ContactForm from '@/components/contact/ContactForm';
import Card from '@/components/ui/Card';
import TabScreen from '@/components/ui/TabScreen';
import Txt from '@/components/ui/Txt';

export default function ContactTab() {
  const { t } = useI18n();
  const { colors } = useTheme();
  const { cat } = useCatalog();
  const c = cat.contact;
  const a = cat.agent;
  const lines = [
    c?.phone && { Icon: Phone, label: t('act.call'), value: c.phone },
    c?.whatsapp && { Icon: MessageCircle, label: t('act.whatsapp'), value: c.whatsapp },
    c?.email && { Icon: Mail, label: t('act.email'), value: c.email },
    c?.hours && { Icon: Clock, label: t('contact.hours'), value: c.hours },
    c?.city && { Icon: MapPin, label: t('contact.office'), value: c.city },
  ].filter(Boolean) as { Icon: typeof Phone; label: string; value: string }[];
  return (
    <TabScreen title={t('contact.title')}>
      <Txt color="muted" style={{ marginBottom: 16 }}>{t('contact.subtitle')}</Txt>
      <Card style={{ gap: 16, marginBottom: 16 }}>
        {a ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}><Txt size={20} weight="heavy" color="accent">{a.name.slice(0, 1)}</Txt></View>
            <View style={{ flex: 1 }}><Txt weight="bold">{a.name}</Txt><Txt size={13} color="muted">{[a.title, a.languages?.join(', ')].filter(Boolean).join(' · ')}</Txt></View>
          </View>
        ) : null}
        <ContactActions />
      </Card>
      <Card style={{ gap: 14, marginBottom: 16 }}>
        {lines.map(l => (
          <View key={l.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}><l.Icon size={18} color={colors.accent} /></View>
            <View style={{ flex: 1 }}><Txt size={12} color="muted">{l.label}</Txt><Txt weight="semibold">{l.value}</Txt></View>
          </View>
        ))}
      </Card>
      <Card style={{ gap: 12 }}>
        <Txt size={18} weight="bold">{t('contact.formTitle')}</Txt>
        <ContactForm />
      </Card>
    </TabScreen>
  );
}
