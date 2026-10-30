import type { Catalog } from '@core';

interface Props { draft: Catalog; update: (fn: (c: Catalog) => void) => void }

const items = [
  { key: 'services', label: 'Services tab', hint: 'Shows or hides the Services section on web and mobile.' },
  { key: 'onlinePayments', label: 'Online payments', hint: 'Shows the Pay button on service tickets. Needs a payment provider first.' },
] as const;

export default function SwitchesEditor({ draft, update }: Props) {
  return (
    <div className="list">
      {items.map(i => (
        <label key={i.key} className="panel row-between check">
          <span><strong>{i.label}</strong><br /><span className="muted small">{i.hint}</span></span>
          <input type="checkbox" checked={!!draft.features?.[i.key]} onChange={e => update(c => { c.features = { ...c.features, [i.key]: e.target.checked }; })} />
        </label>
      ))}
    </div>
  );
}
