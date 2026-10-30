import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export interface Option<T extends string> { value: T; label: string }
interface Props<T extends string> {
  value: T; options: Option<T>[]; onChange: (v: T) => void;
  label?: string; icon?: ReactNode; align?: 'left' | 'right'; compact?: boolean;
}

export default function Dropdown<T extends string>({ value, options, onChange, label, icon, align = 'left', compact }: Props<T>) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    addEventListener('mousedown', close);
    addEventListener('keydown', esc);
    return () => { removeEventListener('mousedown', close); removeEventListener('keydown', esc); };
  }, []);
  const current = options.find(o => o.value === value);
  return (
    <div className={`dd${compact ? ' dd-compact' : ''}`} ref={box}>
      {label && <span className="dd-label">{label}</span>}
      <button type="button" className="dd-btn" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(!open)}>
        {icon}<span className="dd-value">{current?.label ?? ''}</span>
        <ChevronDown size={16} className={open ? 'flip' : ''} />
      </button>
      {open && (
        <ul className={`dd-list dd-${align}`} role="listbox">
          {options.map(o => (
            <li key={o.value} role="option" aria-selected={o.value === value} className={o.value === value ? 'on' : ''}
              onClick={() => { onChange(o.value); setOpen(false); }}>{o.label}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
