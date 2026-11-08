import type { ReactNode } from 'react';

export interface Tile { icon: ReactNode; label: string; value: string }
export default function FactTiles({ tiles }: { tiles: Tile[] }) {
  if (!tiles.length) return null;
  return (
    <div className="fact-tiles">
      {tiles.map(x => <div key={x.label}><span className="fact-ic">{x.icon}</span><strong>{x.value}</strong><small>{x.label}</small></div>)}
    </div>
  );
}
