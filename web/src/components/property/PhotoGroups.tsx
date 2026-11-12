import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { media } from '@core';
import type { PhotoGroup } from '@core';
import { useCatalog } from '@/providers/CatalogProvider';
import { useI18n } from '@/providers/I18nProvider';
import Fullscreen from '../ui/Fullscreen';

const PAGE = 24;

/** Photos split into areas (kitchen, pool, a unit type) with chips to switch between them. */
export default function PhotoGroups({ groups }: { groups: PhotoGroup[] }) {
  const { cat } = useCatalog();
  const { t } = useI18n();
  const [active, setActive] = useState('all');
  const [shown, setShown] = useState(PAGE);
  const [open, setOpen] = useState<number | null>(null);

  const all = useMemo(() => groups.flatMap(g => g.images), [groups]);
  const list = active === 'all' ? all : groups.find(g => g.id === active)?.images ?? [];
  const urls = list.map(i => media(cat, i));
  const step = (d: number) => setOpen(i => (i === null ? i : (i + d + urls.length) % urls.length));
  const pick = (id: string) => { setActive(id); setShown(PAGE); };

  return (
    <>
      {groups.length > 1 && (
        <div className="chips-row" role="tablist">
          <button role="tab" aria-selected={active === 'all'} className={`pill${active === 'all' ? ' on' : ''}`} onClick={() => pick('all')}>{t('photos.all')}<span>{all.length}</span></button>
          {groups.map(g => <button key={g.id} role="tab" aria-selected={active === g.id} className={`pill${active === g.id ? ' on' : ''}`} onClick={() => pick(g.id)}>{g.label}<span>{g.images.length}</span></button>)}
        </div>
      )}
      <div className="photo-grid">
        {urls.slice(0, shown).map((src, i) => (
          <button key={src} className="photo-tile" onClick={() => setOpen(i)} aria-label={`${t('photos.title')} ${i + 1}`}>
            <img src={src} alt="" loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
      {urls.length > shown && <button className="btn btn-soft btn-md photo-more" onClick={() => setShown(s => s + PAGE)}>{t('photos.more')} ({urls.length - shown})</button>}
      {open !== null && (
        <Fullscreen onClose={() => setOpen(null)}
          footer={<div className="lb-nav"><button className="icon-btn" onClick={() => step(-1)}><ChevronLeft /></button><span>{open + 1} / {urls.length}</span><button className="icon-btn" onClick={() => step(1)}><ChevronRight /></button></div>}>
          <img className="lb-img" src={urls[open]} alt="" />
        </Fullscreen>
      )}
    </>
  );
}
