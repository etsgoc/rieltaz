import type { ReactNode } from 'react';

export default function StatCard({ label, value, hint, icon }: { label: string; value: ReactNode; hint?: string; icon?: ReactNode }) {
  return (
    <div className="stat">
      <div className="stat-top"><span className="muted">{label}</span>{icon}</div>
      <strong>{value}</strong>
      {hint && <span className="muted small">{hint}</span>}
    </div>
  );
}
