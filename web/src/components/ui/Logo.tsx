
import { Link } from 'react-router-dom';
import { BRAND } from '@/config';

export function Mark({ size = 30 }: { size?: number }) {
  return (
    <img
      src="/favicon.svg"
      alt=""
      width={size}
      height={size}
      aria-hidden="true"
    />
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


