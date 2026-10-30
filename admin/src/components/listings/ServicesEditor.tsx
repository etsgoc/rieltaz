import type { Catalog } from '@core';
import { Input } from '../ui/Field';

interface Props { draft: Catalog; update: (fn: (c: Catalog) => void) => void }

export default function ServicesEditor({ draft, update }: Props) {
  const edit = (id: string, patch: (s: NonNullable<Catalog['services']>[number]) => void) =>
    update(c => { const s = c.services?.find(x => x.id === id); if (s) patch(s); });
  const catName = (id: string) => draft.serviceCategories?.find(c => c.id === id)?.title ?? id;

  return (
    <div className="panel table-wrap">
      <table>
        <thead><tr><th>Service</th><th>Starting price</th><th>Quote only</th><th>Hidden</th></tr></thead>
        <tbody>
          {draft.services?.map(s => (
            <tr key={s.id}>
              <td><strong>{s.title}</strong><br /><span className="muted small">{catName(s.categoryId)}</span></td>
              <td>
                {s.options?.length
                  ? <span className="muted small">Set per option in the JSON</span>
                  : <Input type="number" min={0} value={s.priceFrom ?? ''} placeholder="No price" onChange={e => edit(s.id, x => { x.priceFrom = e.target.value === '' ? null : Number(e.target.value); })} />}
              </td>
              <td><input type="checkbox" checked={!!s.requestOnly} onChange={e => edit(s.id, x => { x.requestOnly = e.target.checked; })} /></td>
              <td><input type="checkbox" checked={!!s.hidden} onChange={e => edit(s.id, x => { x.hidden = e.target.checked; })} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
