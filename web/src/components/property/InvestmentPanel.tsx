import { Check } from 'lucide-react';
import { investmentReturn, money } from '@core';
import type { Project } from '@core';
import { useI18n } from '@/providers/I18nProvider';
import Spec from './Spec';

export default function InvestmentPanel({ p }: { p: Project }) {
  const { t } = useI18n();
  const i = p.investment;
  if (!i) return null;
  const cur = i.currency ?? p.pricing?.currency ?? 'USD';
  const r = investmentReturn(i);
  const pct = i.targetRaise ? Math.min(100, Math.round(((i.raised ?? 0) / i.targetRaise) * 100)) : null;
  return (
    <>
      <Spec rows={[
        { label: t('inv.strategy'), value: i.strategy },
        { label: t('inv.purchase'), value: money(i.purchasePrice, cur) },
        { label: t('inv.reno'), value: money(i.renovationBudget, cur) },
        { label: t('inv.total'), value: money(r.total, cur) },
        { label: t('inv.arv'), value: money(i.afterRepairValue, cur) },
        { label: t('inv.profit'), value: money(r.profit, cur), tone: 'ok' },
        { label: t('inv.roi'), value: `${r.pct}%`, tone: 'ok' },
        { label: t('inv.timeline'), value: i.timelineMonths && t('fact.months', { n: i.timelineMonths }) },
        { label: t('inv.minTicket'), value: i.minTicket && money(i.minTicket, cur) },
      ]} />
      {pct != null && i.targetRaise && (
        <div className="raise">
          <div className="raise-row"><span>{t('inv.raised')}</span><strong>{money(i.raised ?? 0, cur)} <span className="muted">/ {money(i.targetRaise, cur)}</span></strong></div>
          <div className="progress"><span style={{ width: `${pct}%` }} /></div>
        </div>
      )}
      {i.scope && i.scope.length > 0 && (
        <>
          <h3 className="sub">{t('inv.scope')}</h3>
          <ul className="ticks">{i.scope.map(x => <li key={x}><Check size={16} />{x}</li>)}</ul>
        </>
      )}
      <p className="muted small">{t('inv.note')}</p>
    </>
  );
}
