import { useEffect, useRef, useState } from 'react';
import { PANNELLUM_CSS, PANNELLUM_JS } from '@core';
import type { Tour } from '@core';
import { useI18n } from '@/providers/I18nProvider';
import { loadPannellum } from '@/lib/hooks';

export default function Tour360({ tour }: { tour: Tour }) {
  const { t } = useI18n();
  const box = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (tour.type !== 'pano') return;
    let dead = false;
    let viewer: { destroy?: () => void; on: (e: string, cb: () => void) => void } | undefined;
    loadPannellum(PANNELLUM_JS, PANNELLUM_CSS)
      .then(() => {
        if (dead || !box.current) return;
        viewer = (window as any).pannellum.viewer(box.current, {
          type: 'equirectangular', panorama: tour.url, autoLoad: true, compass: false, hfov: 105, showZoomCtrl: true,
        });
        viewer?.on('error', () => setFailed(true));
      })
      .catch(() => setFailed(true));
    return () => { dead = true; viewer?.destroy?.(); };
  }, [tour.type, tour.url]);

  if (tour.type === 'embed') {
    return <iframe className="frame" src={tour.url} allow="fullscreen; gyroscope; accelerometer" allowFullScreen title="360" />;
  }
  return (
    <div className="tour">
      <div ref={box} className="frame" />
      {failed ? <p className="err tour-msg">{t('prop.tourFail')}</p> : <span className="tour-hint">{t('prop.dragTour')}</span>}
    </div>
  );
}
