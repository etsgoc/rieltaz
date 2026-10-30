import { useEffect, useState } from 'react';
import { buildQuote } from '@core';
import type { Ownership } from '@core';
import { db } from '@/lib/supabase';
import { thb } from '@/lib/format';
import { useCatalog } from '@/providers/CatalogProvider';
import Button from '../ui/Button';
import type { Deal } from './DealCard';

interface Pay { id: string; label: string; amount: number; position: number; paid_at: string | null }

export default function PaymentsPanel({ r }: { r: Deal }) {
  const { cat } = useCatalog();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Pay[] | null>(null);
  const [err, setErr] = useState('');

  async function load() {
    const { data } = await db.from('payments').select('*').eq('reservation_id', r.id).order('position');
    setRows((data as Pay[]) ?? []);
  }
  useEffect(() => { if (open && !rows) load(); }, [open]);

  async function create() {
    setErr('');
    const unit = cat.units.find(u => u.id === r.unit_id && u.projectId === r.project_id);
    if (!unit) { setErr('This unit is no longer in the listings JSON.'); return; }
    try {
      const q = buildQuote(cat, { ...unit, status: 'available' }, r.ownership as Ownership);
      const list = [{ label: 'Reservation fee', amount: q.reservationFee }, ...q.schedule.map(s => ({ label: s.label, amount: s.amount }))];
      const { error } = await db.from('payments').insert(list.map((x, i) => ({ ...x, reservation_id: r.id, position: i })));
      if (error) setErr(error.message); else load();
    } catch (e) { setErr((e as Error).message); }
  }
  async function toggle(p: Pay) {
    await db.from('payments').update({ paid_at: p.paid_at ? null : new Date().toISOString() }).eq('id', p.id);
    load();
  }
  const paid = rows?.filter(p => p.paid_at).reduce((a, p) => a + Number(p.amount), 0) ?? 0;
  const total = rows?.reduce((a, p) => a + Number(p.amount), 0) ?? 0;

  return (
    <div className="full">
      <Button variant="soft" onClick={() => setOpen(!open)}>{open ? 'Hide payments' : 'Payments'}</Button>
      {open && rows && (
        <div className="stack" style={{ marginTop: 14 }}>
          {!rows.length && <Button onClick={create}>Create payment schedule</Button>}
          {rows.length > 0 && <p className="muted">Paid {thb(paid)} of {thb(total)}</p>}
          <table><tbody>
            {rows.map(p => (
              <tr key={p.id}>
                <td><label className="check"><input type="checkbox" checked={!!p.paid_at} onChange={() => toggle(p)} />{p.label}</label></td>
                <td>{thb(p.amount)}</td>
              </tr>
            ))}
          </tbody></table>
          {err && <p className="err">{err}</p>}
        </div>
      )}
    </div>
  );
}
