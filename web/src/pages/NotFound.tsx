import { useI18n } from '@/providers/I18nProvider';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';

export default function NotFound() {
  const { t } = useI18n();
  return <div className="wrap section"><EmptyState title={t('error.notFound')}><Button to="/" variant="soft">{t('nav.browse')}</Button></EmptyState></div>;
}
