import type { ReactNode } from 'react';

/** Label and value rows, used for rental terms and investment numbers. Rows with no value are skipped. */
export default function Spec({ rows }: { rows: ({ label: string; value?: ReactNode; tone?: 'ok' } | false | null | undefined)[] }) {
  return (
    <table className="spec"><tbody>
      {rows.filter((r): r is { label: string; value?: ReactNode; tone?: 'ok' } => Boolean(r && r.value != null && r.value !== '')).map(r => (
        <tr key={r.label}><td>{r.label}</td><td className={r.tone ? `tone-${r.tone}` : ''}>{r.value}</td></tr>
      ))}
    </tbody></table>
  );
}
