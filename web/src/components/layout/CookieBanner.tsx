import { Link } from 'react-router-dom';
import { useConsent } from '@/providers/ConsentProvider';
import { useI18n } from '@/providers/I18nProvider';
import Button from '../ui/Button';

export default function CookieBanner() {
  const { bannerOpen, choose } = useConsent();
  const { t } = useI18n();
  if (!bannerOpen) return null;
  return (
    <div className="cookie" role="dialog" aria-label={t('cookie.title')}>
      <h4>{t('cookie.title')}</h4>
      <p className="muted small">{t('cookie.body')} <Link to="/legal/cookies">{t('legal.cookies')}</Link></p>
      <div className="cookie-actions">
        <Button variant="soft" onClick={() => choose('essential')}>{t('cookie.essential')}</Button>
        <Button onClick={() => choose('all')}>{t('cookie.accept')}</Button>
      </div>
    </div>
  );
}
