import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useI18n } from '@/providers/I18nProvider';
import { useIsMobile, useLockScroll } from '@/lib/hooks';

interface Props { open: boolean; onClose: () => void; title?: string; children: ReactNode }

/** Bottom sheet on small screens, centred dialog on large ones. */
export default function Sheet({ open, onClose, title, children }: Props) {
  const mobile = useIsMobile();
  const { t } = useI18n();
  useLockScroll(open);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div className="overlay" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={mobile ? 'sheet' : 'dialog'} role="dialog" aria-modal aria-label={title}>
        {mobile && <div className="sheet-handle" />}
        <div className="sheet-head">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label={t('common.close')}><X size={20} /></button>
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
