import * as Haptics from 'expo-haptics';
import { Mail, MessageCircle, Phone } from 'lucide-react-native';
import { Linking, Pressable, View } from 'react-native';
import { inquirySubject, inquiryText, mailHref, telHref, whatsappHref, whatsappNumber } from '@core';
import type { InquiryContext } from '@core';
import { useI18n } from '@/i18n/I18nProvider';
import { useCatalog } from '@/providers/CatalogProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/colors';
import Txt from '../ui/Txt';

/** Call, WhatsApp and email. No account and no backend needed. `compact` shows round icon buttons only. */
export default function ContactActions({ ctx = {}, compact, dark }: { ctx?: InquiryContext; compact?: boolean; dark?: boolean }) {
  const { cat } = useCatalog();
  const { colors } = useTheme();
  const { t } = useI18n();
  const c = cat.contact;
  if (!c) return null;
  const text = inquiryText(ctx);
  const wa = whatsappNumber(c);
  const items = [
    c.phone && { k: 'call', href: telHref(c.phone), Icon: Phone, label: t('act.callNow'), bg: colors.accent, fg: colors.accentInk },
    wa && { k: 'wa', href: whatsappHref(wa, text), Icon: MessageCircle, label: t('act.writeWhatsapp'), bg: '#1FA855', fg: '#FFFFFF' },
    c.email && { k: 'mail', href: mailHref(c.email, inquirySubject(ctx), text), Icon: Mail, label: t('act.writeEmail'), bg: dark ? 'rgba(255,255,255,0.1)' : colors.surface2, fg: dark ? '#EDEDED' : colors.text },
  ].filter(Boolean) as { k: string; href: string; Icon: typeof Phone; label: string; bg: string; fg: string }[];
  const open = (href: string) => { Haptics.selectionAsync().catch(() => {}); Linking.openURL(href).catch(() => {}); };
  if (compact) {
    return (
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {items.map(i => (
          <Pressable key={i.k} accessibilityLabel={i.label} onPress={() => open(i.href)} style={({ pressed }) => ({ width: 46, height: 46, borderRadius: 23, backgroundColor: i.bg, alignItems: 'center', justifyContent: 'center', borderWidth: i.k === 'mail' && !dark ? 1 : 0, borderColor: colors.line, transform: [{ scale: pressed ? 0.94 : 1 }] })}>
            <i.Icon size={20} color={i.fg} />
          </Pressable>
        ))}
      </View>
    );
  }
  return (
    <View style={{ gap: 10 }}>
      {items.map(i => (
        <Pressable key={i.k} onPress={() => open(i.href)} style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 15, borderRadius: radius.button, backgroundColor: i.bg, borderWidth: i.k === 'mail' && !dark ? 1 : 0, borderColor: colors.line, transform: [{ scale: pressed ? 0.98 : 1 }] })}>
          <i.Icon size={19} color={i.fg} /><Txt weight="semibold" style={{ color: i.fg }}>{i.label}</Txt>
        </Pressable>
      ))}
    </View>
  );
}
