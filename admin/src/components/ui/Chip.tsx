import type { ReactNode } from 'react';

export default function Chip({ children, tone }: { children: ReactNode; tone?: 'ok' | 'warn' | 'accent' }) {
  return <span className={`chip${tone ? ' chip-' + tone : ''}`}>{children}</span>;
}
