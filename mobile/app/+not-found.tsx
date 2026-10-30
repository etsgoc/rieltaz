import { useRouter } from 'expo-router';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import Screen from '@/components/ui/Screen';
import { useI18n } from '@/i18n/I18nProvider';

export default function NotFound() {
  const router = useRouter();
  const { t } = useI18n();
  return <Screen><EmptyState title={t('error.notFound')}><Button label={t('nav.browse')} onPress={() => router.replace('/')} variant="soft" compact /></EmptyState></Screen>;
}
