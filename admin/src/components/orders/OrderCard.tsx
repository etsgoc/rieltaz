import { useState } from 'react';
import { Ticket } from 'lucide-react';
import { splitAmount } from '@core';
import type { Order } from '@core';
import { db } from '@/lib/supabase';
import { dateTime, thb } from '@/lib/format';
import { ORDER_STATUSES, label, tone } from '@/lib/stages';
import { useCatalog } from '@/providers/CatalogProvider';
import Button from '../ui/Button';
import Chip from '../ui/Chip';
import Dropdown from '../ui/Dropdown';
import { Field, Input } from '../ui/Field';

export default function OrderCard({ o, who, onSaved }: { o: Order; who?: string; onSaved: () => void }) {
  const { cat } = useCatalog();
  const service = cat.services?.find(s => s.id === o.service_id);
  const [status, setStatus] = useState<string>(o.status);
  const [amount, setAmount] = useState(String(o.final_amount ?? o.quoted_amount ?? ''));
  const [partner, setPartner] = useState(o.partner_id ?? service?.partnerId ?? '');
  const [pct, setPct] = useState(String(service?.commissionPct ?? 15));
  const [state, setState] = useState('');

  const value = Number(amount);
  const split = value > 0 ? splitAmount(value, Number(pct) || 0) : null;

  async function save() {
    setState('Saving');
    const patch: Record<string, unknown> = { status, partner_id: partner || null };
    if (value > 0) Object.assign(patch, { final_amount: value, platform_fee: split?.platform, partner_amount: split?.partner });
    const { error } = await db.from('service_orders').update(patch).eq('id', o.id);
    setState(error ? error.message : 'Saved');
    if (!error) onSaved();
  }

  return (
    <article className="panel deal">
      <div className="stack">
        <div className="row-between"><h3>{o.service_title}</h3><Chip tone={tone(o.status)}>{label(o.status)}</Chip></div>
        <p className="muted">{[o.option_label, o.details.date, o.details.people && `${o.details.people} people`].filter(Boolean).join(' · ')}</p>
        {o.details.notes && <p>{o.details.notes}</p>}
        <p className="muted small">{who} · {dateTime(o.created_at)}</p>
        {o.ticket_code && <p className="ticket-code"><Ticket size={16} /><strong>{o.ticket_code}</strong></p>}
      </div>
      <div className="stack">
        <Field label={`Final amount (${o.currency})`}><Input type="number" min={0} value={amount} onChange={e => setAmount(e.target.value)} /></Field>
        <Field label="Platform share %"><Input type="number" min={0} max={100} value={pct} onChange={e => setPct(e.target.value)} /></Field>
        {split && <p className="muted small">Your share {thb(split.platform, o.currency)} · Partner {thb(split.partner, o.currency)}</p>}
      </div>
      <div className="stack">
        <Dropdown label="Status" value={status} onChange={setStatus} options={ORDER_STATUSES.map(s => ({ value: s, label: label(s) }))} />
        <Dropdown label="Partner" value={partner} onChange={setPartner}
          options={[{ value: '', label: 'None' }, ...(cat.partners ?? []).map(p => ({ value: p.id, label: p.name }))]} />
        <div className="row"><Button onClick={save}>Save</Button><span className="muted">{state}</span></div>
        <p className="muted small">A ticket code is created when the status becomes Confirmed.</p>
      </div>
    </article>
  );
}
