import type { ReactNode } from 'react';
import { useI18n } from '@/providers/I18nProvider';
import { useConsent } from '@/providers/ConsentProvider';
import Button from './Button';

/** Shows third-party content only after the visitor allows it. */
export default function ConsentGate({ children }: { children: ReactNode }) {
  const { consent, choose } = useConsent();
  const { t } = useI18n();
  if (consent === 'all') return <>{children}</>;
  return (
    <div className="gate">
      <p className="muted">{t('cookie.blocked')}</p>
      <Button variant="soft" onClick={() => choose('all')}>{t('cookie.load')}</Button>
    </div>
  );
}
