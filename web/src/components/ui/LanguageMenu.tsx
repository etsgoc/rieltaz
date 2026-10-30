import { useState } from 'react';
import { Check, Globe } from 'lucide-react';
import { LANGS } from '@core';
import type { Lang } from '@core';
import { useI18n } from '@/providers/I18nProvider';
import { useIsMobile } from '@/lib/hooks';
import Dropdown from './Dropdown';
import Sheet from './Sheet';

/** Dropdown on desktop, bottom sheet on mobile. */
export default function LanguageMenu() {
  const { lang, setLang, t } = useI18n();
  const mobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const current = LANGS.find(l => l.code === lang)!;

  if (!mobile) {
    return (
      <Dropdown compact align="right" value={lang} onChange={setLang} icon={<Globe size={16} />}
        options={LANGS.map(l => ({ value: l.code, label: l.label }))} />
    );
  }
  return (
    <>
      <button className="dd-btn dd-compact-btn" onClick={() => setOpen(true)} aria-label={t('common.language')}>
        <Globe size={16} /><span>{current.label}</span>
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title={t('common.language')}>
        <ul className="pick-list">
          {LANGS.map(l => (
            <li key={l.code}>
              <button onClick={() => { setLang(l.code as Lang); setOpen(false); }}>
                <span>{l.label}</span>{l.code === lang && <Check size={18} />}
              </button>
            </li>
          ))}
        </ul>
      </Sheet>
    </>
  );
}
