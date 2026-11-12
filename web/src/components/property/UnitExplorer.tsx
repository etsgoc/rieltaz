import { useEffect, useMemo, useState } from 'react';
import { buildQuote, priceFor } from '@core';
import type { Ownership, Project, Unit } from '@core';
import { useCatalog } from '@/providers/CatalogProvider';
import { useI18n } from '@/providers/I18nProvider';
import { thb } from '@/lib/format';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import QuoteTable from './QuoteTable';

/** Tower, unit and ownership picker with the payment plan for the chosen unit. Shown only for listings that have units. */
export default function UnitExplorer({ p, units, onSelect }: { p: Project; units: Unit[]; onSelect: (u: Unit, o: Ownership) => void }) {
  const { cat } = useCatalog();
  const { t } = useI18n();
  const towers = [...new Set(units.map(u => u.tower))];
  const [tower, setTower] = useState(towers[0]);
  const [unitId, setUnitId] = useState('');
  const [own, setOwn] = useState<Ownership>(p.ownership[0] ?? 'freehold');
  const [planPick, setPlanPick] = useState('');
  const inTower = units.filter(u => u.tower === tower);
  const unit = inTower.find(u => u.id === unitId) ?? inTower[0] ?? units[0];
  const planKeys = unit.plan ? [unit.plan] : [p.paymentPlan ?? '', ...(p.altPaymentPlans ?? [])].filter(Boolean);
  const plan = planKeys.includes(planPick) ? planPick : planKeys[0];
  const quote = useMemo(() => { try { return buildQuote(cat, unit, own, plan); } catch { return null; } }, [cat, unit, own, plan]);
  useEffect(() => { onSelect(unit, own); }, [unit.id, own]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="unit-explorer">
      <div className="stack">
        {towers.length > 1 && <Dropdown label={t('res.tower')} value={tower} onChange={v => { setTower(v); setUnitId(''); }} options={towers.map(x => ({ value: x, label: x }))} />}
        <Dropdown label={t('res.unit')} value={unit.id} onChange={setUnitId} options={inTower.map(u => ({ value: u.id, label: `${u.id} · ${u.type}${u.style ? `, ${u.style}` : ''} · ${u.sqm} m²` }))} />
        {p.ownership.length > 1 && <Dropdown label={t('res.ownership')} value={own} onChange={setOwn} options={p.ownership.map(o => ({ value: o, label: t(`own.${o}`) }))} />}
        {planKeys.length > 1 && <Dropdown label={t('res.plan')} value={plan} onChange={setPlanPick} options={planKeys.map(k => ({ value: k, label: cat.paymentPlans[k]?.name ?? k }))} />}
        <div className="unit-price"><span className="muted small">{unit.id} · {unit.type} · {unit.sqm} m²{unit.view ? ` · ${unit.view}` : ''}</span><div className="big-price">{thb(priceFor(unit, own), p.pricing?.currency)}</div></div>
        <Button block onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>{t('res.cta')}</Button>
      </div>
      <div>
        {quote && <QuoteTable quote={quote} />}
        {typeof p.priceNote === 'string' && <p className="muted small">{p.priceNote}</p>}
      </div>
    </div>
  );
}
