
import { Link } from 'react-router-dom';
import { BRAND } from '@/config';

export function Mark({ size = 30 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        overflow: 'hidden',
        borderRadius: '8px',
      }}
    >
      <img
        src="/favicon.svg"
        alt=""
        width={size}
        height={size}
        style={{
          transform: 'scale(1)',
        }}
      />
    </div>
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


