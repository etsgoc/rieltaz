import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ticket } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { estimate } from '@core';
import { useI18n } from '@/i18n/I18nProvider';
import { thb } from '@/lib/format';
import { db } from '@/lib/supabase';
import { useCatalog } from '@/providers/CatalogProvider';
import { useSession } from '@/providers/SessionProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/colors';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';
import Cover from '@/components/ui/Cover';
import Field from '@/components/ui/Field';
import Header from '@/components/ui/Header';
import Screen from '@/components/ui/Screen';
import Txt from '@/components/ui/Txt';

const days = () => Array.from({ length: 10 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i + 1); return d; });

export default function ServiceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { cat } = useCatalog();
  const { session } = useSession();
  const { t, lang } = useI18n();
  const s = cat.services?.find(x => x.id === id);
  const [option, setOption] = useState(s?.options?.[0]?.id ?? '');
  const [date, setDate] = useState('');
  const [people, setPeople] = useState(1);
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [sent, setSent] = useState(false);

  if (!s) return <Screen><Header close /><Txt color="muted">{t('svc.empty')}</Txt></Screen>;
  const total = estimate(s, option, people);

  async function submit() {
    if (!session || !s) return;
    setBusy(true); setErr('');
    const { error } = await db.from('service_orders').insert({
      user_id: session.user.id, service_id: s.id, service_title: s.title,
      option_label: s.options?.find(o => o.id === option)?.label ?? null, quantity: s.needsPeople ? people : 1,
      details: { date: date || undefined, people: s.needsPeople ? people : undefined, notes: notes || undefined },
      quoted_amount: total, currency: s.currency ?? 'THB', partner_id: s.partnerId ?? null,
    });
    setBusy(false);
    if (error) setErr(error.message); else setSent(true);
  }

  if (sent) {
    return (
      <Screen>
        <Header close title={t('svc.sent')} />
        <View style={{ alignItems: 'center', gap: 14, paddingVertical: 24 }}>
          <Ticket size={44} color={colors.accent} />
          <Txt color="muted" style={{ textAlign: 'center' }}>{t('svc.sentHint')}</Txt>
          <Button label={t('nav.bookings')} onPress={() => { router.dismissAll(); router.navigate('/bookings'); }} style={{ alignSelf: 'stretch' }} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen bottom={40}>
      <Header close title={s.title} />
      <Cover uri={s.image} seed={s.id} style={{ height: 180, width: '100%', borderRadius: radius.card, overflow: 'hidden' }} />
      <Txt color="muted" style={{ marginVertical: 14 }}>{s.blurb}</Txt>
      {s.options?.length ? <><Txt weight="semibold" style={{ marginBottom: 8 }}>{t('svc.option')}</Txt>
        <View style={{ gap: 8, marginBottom: 14 }}>{s.options.map(o => <Chip key={o.id} label={`${o.label} · ${thb(o.price, s.currency)}`} on={o.id === option} onPress={() => setOption(o.id)} />)}</View></> : null}
      {s.needsDate ? <><Txt weight="semibold" style={{ marginBottom: 8 }}>{t('svc.date')}</Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          {days().map(d => { const v = d.toISOString().slice(0, 10); return <Chip key={v} label={d.toLocaleDateString(lang, { weekday: 'short', day: 'numeric', month: 'short' })} on={v === date} onPress={() => setDate(v)} />; })}
        </View></> : null}
      {s.needsPeople ? <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <Txt weight="semibold" style={{ flex: 1 }}>{t('svc.people')}</Txt>
        <Button variant="soft" label="−" compact onPress={() => setPeople(Math.max(1, people - 1))} />
        <Txt size={18} weight="bold">{people}</Txt>
        <Button variant="soft" label="+" compact onPress={() => setPeople(Math.min(30, people + 1))} />
      </View> : null}
      <Field label={t('svc.notes')} placeholder={t('svc.notesHint')} value={notes} onChangeText={setNotes} multiline />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, marginVertical: 16, borderRadius: radius.button, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.line, gap: 12 }}>
        <Txt color="muted">{t('svc.estimate')}</Txt>
        <Txt weight="bold" style={{ flexShrink: 1, textAlign: 'right' }}>{total != null ? thb(total, s.currency) : t('svc.quoteOnly')}</Txt>
      </View>
      {session ? <Button label={t('svc.request')} onPress={submit} loading={busy} /> : <><Button label={t('auth.signIn')} onPress={() => router.push('/auth')} /><Txt color="muted" size={14} style={{ marginTop: 8 }}>{t('svc.signInFirst')}</Txt></>}
      {err ? <Txt color="danger" size={14} style={{ marginTop: 10 }}>{err}</Txt> : null}
    </Screen>
  );
}
