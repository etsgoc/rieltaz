import { Monitor, Moon, Sun } from 'lucide-react';
import { useI18n } from '@/providers/I18nProvider';
import { useTheme, type Mode } from '@/providers/ThemeProvider';

const items: { mode: Mode; icon: typeof Sun; key: 'common.light' | 'common.dark' | 'common.system' }[] = [
  { mode: 'light', icon: Sun, key: 'common.light' },
  { mode: 'dark', icon: Moon, key: 'common.dark' },
  { mode: 'system', icon: Monitor, key: 'common.system' },
];

export default function ThemeToggle({ labels }: { labels?: boolean }) {
  const { mode, setMode } = useTheme();
  const { t } = useI18n();
  return (
    <div className="seg" role="group" aria-label={t('common.theme')}>
      {items.map(({ mode: m, icon: Icon, key }) => (
        <button key={m} className={mode === m ? 'on' : ''} onClick={() => setMode(m)} aria-label={t(key)} title={t(key)}>
          <Icon size={16} />{labels && <span>{t(key)}</span>}
        </button>
      ))}
    </div>
  );
}
