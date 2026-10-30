import { Link } from 'react-router-dom';
import { BRAND } from '@/config';

export function Mark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" aria-hidden>
      <rect width="512" height="512" rx="112" className="mark-bg" />
      <path d="M112 266 L256 140 L400 266" fill="none" strokeWidth="40" strokeLinecap="round" strokeLinejoin="round" className="mark-fg-stroke" />
      <path d="M158 262 L256 176 L354 262 V388 a28 28 0 0 1 -28 28 H186 a28 28 0 0 1 -28 -28 Z" className="mark-fg" />
      <path d="M222 416 V350 a34 34 0 0 1 68 0 V416 Z" className="mark-door" />
    </svg>
  );
}

export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label={BRAND.name}>
      <Mark />
      <span>{BRAND.name}</span>
    </Link>
  );
}
