import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useI18n } from '@/providers/I18nProvider';
import { useLockScroll } from '@/lib/hooks';

export default function Fullscreen({ onClose, children, footer }: { onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  const { t } = useI18n();
  useLockScroll(true);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  }, [onClose]);
  return createPortal(
    <div className="fullscreen">
      <button className="fs-close" onClick={onClose} aria-label={t('common.close')}><X size={22} /></button>
      <div className="fs-body">{children}</div>
      {footer && <div className="fs-footer">{footer}</div>}
    </div>,
    document.body,
  );
}
