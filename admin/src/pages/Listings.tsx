import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import type { Catalog } from '@core';
import { useCatalog } from '@/providers/CatalogProvider';
import { downloadJson } from '@/lib/download';
import Button from '@/components/ui/Button';
import ServicesEditor from '@/components/listings/ServicesEditor';
import SwitchesEditor from '@/components/listings/SwitchesEditor';
import UnitsEditor from '@/components/listings/UnitsEditor';

const TABS = [{ id: 'units', label: 'Units' }, { id: 'services', label: 'Services' }, { id: 'switches', label: 'Switches' }] as const;

export default function Listings() {
  const { cat } = useCatalog();
  const [draft, setDraft] = useState<Catalog>(() => structuredClone(cat));
  const [tab, setTab] = useState<typeof TABS[number]['id']>('units');
  const changed = useMemo(() => JSON.stringify(draft) !== JSON.stringify(cat), [draft, cat]);

  const update = (fn: (c: Catalog) => void) => setDraft(prev => { const next = structuredClone(prev); fn(next); return next; });
  const publish = () => downloadJson('properties.json', { ...draft, version: draft.version + 1, updatedAt: new Date().toISOString().slice(0, 10) });

  return (
    <>
      <div className="page-head">
        <h1>Listings</h1>
        <Button icon={<Download size={16} />} onClick={publish} disabled={!changed}>Download properties.json</Button>
      </div>
      <p className="muted" style={{ marginBottom: 18 }}>
        Change prices, availability and services here, then download the file and commit it to <code>data/properties.json</code> in your GitHub repo.
        The apps pick it up automatically. The version number goes up by one on download.
      </p>
      <div className="seg tabs">
        {TABS.map(t => <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>{t.label}</button>)}
      </div>
      {tab === 'units' && <UnitsEditor draft={draft} update={update} />}
      {tab === 'services' && <ServicesEditor draft={draft} update={update} />}
      {tab === 'switches' && <SwitchesEditor draft={draft} update={update} />}
    </>
  );
}
