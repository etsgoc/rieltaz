import { useMemo, useState } from 'react';
import type { Catalog, UnitStatus } from '@core';
import { thb } from '@/lib/format';
import Dropdown from '../ui/Dropdown';
import { Input } from '../ui/Field';

interface Props { draft: Catalog; update: (fn: (c: Catalog) => void) => void }

const STATUSES: UnitStatus[] = ['available', 'reserved', 'sold'];

export default function UnitsEditor({ draft, update }: Props) {
  const projects = draft.projects.filter(p => draft.units.some(u => u.projectId === p.id));
  const [project, setProject] = useState(projects[0]?.id ?? '');
  const units = useMemo(() => draft.units.filter(u => u.projectId === project), [draft.units, project]);
  const towers = [...new Set(units.map(u => u.tower))];
  const [tower, setTower] = useState('');
  const active = towers.includes(tower) ? tower : towers[0];
  const rows = units.filter(u => u.tower === active);

  const edit = (id: string, patch: (u: Catalog['units'][number]) => void) =>
    update(c => { const u = c.units.find(x => x.id === id && x.projectId === project); if (u) patch(u); });

  if (!projects.length) return <p className="muted">No units in the catalog yet.</p>;
  return (
    <>
      <div className="filters">
        <Dropdown label="Property" value={project} onChange={setProject} options={projects.map(p => ({ value: p.id, label: p.name }))} />
        <Dropdown label="Tower" value={active ?? ''} onChange={setTower} options={towers.map(t => ({ value: t, label: t }))} />
      </div>
      <div className="panel table-wrap">
        <table>
          <thead><tr><th>Unit</th><th>Type</th><th>m²</th><th>Price (THB)</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td><td>{u.type}</td><td>{u.sqm}</td>
                <td>
                  <Input type="number" min={0} value={u.price} onChange={e => {
                    const v = Number(e.target.value) || 0;
                    edit(u.id, x => { x.price = v; x.pricePerSqm = Math.round((v / x.sqm) * 100) / 100; });
                  }} />
                  <span className="muted small">{thb(u.price)}</span>
                </td>
                <td><Dropdown compact value={u.status} onChange={v => edit(u.id, x => { x.status = v as UnitStatus; })} options={STATUSES.map(s => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }))} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
