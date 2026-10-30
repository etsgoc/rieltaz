import { useState } from 'react';
import { ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { useI18n } from '@/providers/I18nProvider';
import Cover from '../ui/Cover';
import Fullscreen from '../ui/Fullscreen';

export default function Gallery({ photos, seed }: { photos: string[]; seed: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  const shown = photos.length ? photos : [''];
  const step = (d: number) => setOpen(i => (i === null ? i : (i + d + shown.length) % shown.length));

  return (
    <>
      <div className="gallery">
        {shown.slice(0, 5).map((src, i) => (
          <button key={i} className={`gal-item g${i}`} onClick={() => src && setOpen(i)} aria-label={`${t('prop.photos', { n: shown.length })} ${i + 1}`}>
            <Cover src={src} seed={seed + i} />
          </button>
        ))}
        {shown.length > 1 && <span className="gal-count"><Images size={14} />{t('prop.photos', { n: shown.length })}</span>}
      </div>
      {open !== null && (
        <Fullscreen onClose={() => setOpen(null)}
          footer={<div className="lb-nav"><button className="icon-btn" onClick={() => step(-1)}><ChevronLeft /></button><span>{open + 1} / {shown.length}</span><button className="icon-btn" onClick={() => step(1)}><ChevronRight /></button></div>}>
          <img className="lb-img" src={shown[open]} alt="" />
        </Fullscreen>
      )}
    </>
  );
}
