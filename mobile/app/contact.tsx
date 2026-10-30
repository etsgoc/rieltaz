import ContactForm from '@/components/auth/ContactForm';
import Header from '@/components/ui/Header';
import Screen from '@/components/ui/Screen';
import Txt from '@/components/ui/Txt';
import { useI18n } from '@/i18n/I18nProvider';

export default function ContactScreen() {
  const { t } = useI18n();
  return (
    <Screen>
      <Header title={t('contact.title')} />
      <Txt color="muted" style={{ marginBottom: 16 }}>{t('contact.subtitle')}</Txt>
      <ContactForm />
    </Screen>
  );
}
