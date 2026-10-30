import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme, type Mode } from '@/providers/ThemeProvider';

const items: { mode: Mode; icon: typeof Sun; label: string }[] = [
  { mode: 'light', icon: Sun, label: 'Light' },
  { mode: 'dark', icon: Moon, label: 'Dark' },
  { mode: 'system', icon: Monitor, label: 'System' },
];

export default function ThemeToggle({ labels }: { labels?: boolean }) {
  const { mode, setMode } = useTheme();
  return (
    <div className="seg" role="group" aria-label="Theme">
      {items.map(({ mode: m, icon: Icon, label }) => (
        <button key={m} className={mode === m ? 'on' : ''} onClick={() => setMode(m)} aria-label={label} title={label}>
          <Icon size={16} />{labels && <span>{label}</span>}
        </button>
      ))}
    </div>
  );
}
