import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { estimate } from '@core';
import { useI18n } from '@/i18n/I18nProvider';
import { thb } from '@/lib/format';
import { useCatalog } from '@/providers/CatalogProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/colors';
import ContactActions from '@/components/contact/ContactActions';
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
  const { colors } = useTheme();
  const { cat } = useCatalog();
  const { t, lang } = useI18n();
  const s = cat.services?.find(x => x.id === id);
  const [option, setOption] = useState(s?.options?.[0]?.id ?? '');
  const [date, setDate] = useState('');
  const [people, setPeople] = useState(1);
  const [notes, setNotes] = useState('');

  if (!s) return <Screen><Header close /><Txt color="muted">{t('svc.empty')}</Txt></Screen>;
  const total = estimate(s, option, people);

  const chosen = s.options?.find(o => o.id === option);
  const details = [
    chosen && `${t('svc.option')}: ${chosen.label}`,
    s.needsDate && date && `${t('svc.date')}: ${date}`,
    s.needsPeople && `${t('svc.people')}: ${people}`,
    total != null && `${t('svc.estimate')}: ${thb(total, s.currency)}`,
  ].filter(Boolean) as string[];

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
      <Txt color="muted" size={14} style={{ marginBottom: 10 }}>{t('svc.contactHint')}</Txt>
      <ContactActions ctx={{ service: s.title, details, note: notes || undefined }} />
    </Screen>
  );
}
