import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { servicesIn } from '@core';
import type { Service } from '@core';
import { useCatalog } from '@/providers/CatalogProvider';
import { useI18n } from '@/providers/I18nProvider';
import EmptyState from '@/components/ui/EmptyState';
import { usePageMeta } from '@/lib/meta';
import Sheet from '@/components/ui/Sheet';
import CategoryNav from '@/components/services/CategoryNav';
import ServiceCard from '@/components/services/ServiceCard';
import ServiceRequestForm from '@/components/services/ServiceRequestForm';

export default function Services() {
  const { cat, features } = useCatalog();
  const { t } = useI18n();
  const { category } = useParams();
  const [open, setOpen] = useState<Service | null>(null);
  usePageMeta(t('svc.title'), t('svc.subtitle'));
  const cats = cat.serviceCategories ?? [];

  if (!features.services || !cats.length) return <div className="wrap section"><EmptyState title={t('svc.unavailable')} /></div>;
  const current = cats.find(c => c.id === category);
  if (!current) return <Navigate to={`/services/${cats[0].id}`} replace />;
  const list = servicesIn(cat, current.id);

  return (
    <div className="wrap section services">
      <CategoryNav categories={cats} />
      <div className="services-main">
        <h1>{current.title}</h1>
        <p className="muted">{current.blurb}</p>
        {list.length ? <div className="grid">{list.map(s => <ServiceCard key={s.id} s={s} onOpen={() => setOpen(s)} />)}</div> : <EmptyState title={t('svc.empty')} />}
      </div>
      <Sheet open={!!open} onClose={() => setOpen(null)} title={open?.title}>
        {open && <ServiceRequestForm key={open.id} s={open} />}
      </Sheet>
    </div>
  );
}
