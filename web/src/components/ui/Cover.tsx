import { useState } from 'react';
import { Mark } from './Logo';

const hue = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7);

export default function Cover({ src, seed, alt = '', className = '' }: { src?: string; seed: string; alt?: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    const h = hue(seed);
    return (
      <div className={`cover-fallback ${className}`} style={{ background: `linear-gradient(135deg, hsl(${h} 38% 32%), hsl(${(h + 40) % 360} 32% 20%))` }}>
        <Mark size={44} />
      </div>
    );
  }
  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}
