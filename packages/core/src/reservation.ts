import type { Catalog, Ownership, Unit } from './types';

const baht = (n: number) => Math.round(n * 100) / 100;

export function buildQuote(cat: Catalog, unit: Unit, ownership: Ownership) {
  const project = cat.projects.find(p => p.id === unit.projectId);
  if (!project) throw new Error('Unknown project');
  if (!project.ownership.includes(ownership)) {
    throw new Error(`${project.name} is not sold as ${ownership}`);
  }
  if (unit.status !== 'available') throw new Error('This unit is no longer available');

  const plan = cat.paymentPlans[project.paymentPlan];
  const fees = cat.feeSchedules[project.fees];
  const schedule = plan.steps.map(s => {
    let amount = unit.price * s.pct / 100 + (s.extra ?? 0);
    if (s.lessReservation) amount -= plan.reservation;
    return { label: s.label, when: s.when ?? null, amount: baht(amount) };
  });

  const additional = {
    commonArea: baht(fees.commonAreaPerSqmMonth * 12 * unit.sqm),
    sinkingFund: baht(fees.sinkingPerSqm * unit.sqm),
    meters: fees.meters,
    admin: fees.admin,
    transferEstimate: baht(unit.price * ((fees.transferPct[ownership] ?? 0) / 100)),
  };
  return { unit, ownership, reservationFee: plan.reservation, schedule, additional };
}

export const STAGES = [
  'requested', 'meeting_booked', 'documents', 'reservation_signed',
  'fee_paid', 'contract_signed', 'closed', 'cancelled',
] as const;
export type Stage = typeof STAGES[number];
