import { useState } from 'react';
import { db } from '@/lib/supabase';
import { dateTime, thb } from '@/lib/format';
import { STAGES, label, tone } from '@/lib/stages';
import Button from '../ui/Button';
import Chip from '../ui/Chip';
import Dropdown from '../ui/Dropdown';
import { Input, Textarea } from '../ui/Field';
import PaymentsPanel from './PaymentsPanel';

export interface Deal { id: string; user_id: string; project_id: string; unit_id: string; ownership: string; quoted_price: number; stage: string; meeting_at: string | null; meet_link: string | null; notes: string | null; created_at: string }
export interface Person { id: string; full_name: string | null; email: string | null; phone: string | null }

export default function DealCard({ r, person, onSaved }: { r: Deal; person?: Person; onSaved: () => void }) {
  const [stage, setStage] = useState(r.stage);
  const [link, setLink] = useState(r.meet_link ?? '');
  const [notes, setNotes] = useState(r.notes ?? '');
  const [state, setState] = useState('');

  async function save() {
    setState('Saving');
    const { error } = await db.from('reservations').update({ stage, meet_link: link || null, notes: notes || null }).eq('id', r.id);
    setState(error ? error.message : 'Saved');
    if (!error) onSaved();
  }
  return (
    <article className="panel deal">
      <div className="stack">
        <div className="row-between"><h3>{r.unit_id}</h3><Chip tone={tone(r.stage)}>{label(r.stage)}</Chip></div>
        <p className="muted">{r.project_id} · {label(r.ownership)} · {thb(r.quoted_price)}</p>
        <p className="muted small">Created {dateTime(r.created_at)}</p>
        <p>Call: {r.meeting_at ? dateTime(r.meeting_at) : 'not requested'}</p>
      </div>
      <div className="stack">
        <strong>{person?.full_name || 'Client'}</strong>
        <p className="muted">{person?.email}</p>
        <p className="muted">{person?.phone}</p>
      </div>
      <div className="stack">
        <Dropdown label="Stage" value={stage} onChange={setStage} options={STAGES.map(s => ({ value: s, label: label(s) }))} />
        <Input placeholder="Google Meet link" value={link} onChange={e => setLink(e.target.value)} />
        <Textarea rows={2} placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} />
        <div className="row"><Button onClick={save}>Save</Button><span className="muted">{state}</span></div>
      </div>
      <PaymentsPanel r={r} />
    </article>
  );
}
