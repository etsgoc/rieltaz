import { useState } from 'react';
import { ExternalLink, Maximize2 } from 'lucide-react';
import { mapEmbedUrl, mapsLink } from '@core';
import { useI18n } from '@/providers/I18nProvider';
import Button from '../ui/Button';
import Fullscreen from '../ui/Fullscreen';

export default function MapView({ lat, lng, name }: { lat: number; lng: number; name: string }) {
  const { t } = useI18n();
  const [full, setFull] = useState(false);
  return (
    <>
      <div className="map-wrap">
        <iframe className="frame" src={mapEmbedUrl(lat, lng)} title={name} loading="lazy" />
        <button className="map-expand only-small" onClick={() => setFull(true)}><Maximize2 size={16} />{t('common.expand')}</button>
      </div>
      <p className="map-links"><a href={mapsLink(lat, lng)} target="_blank" rel="noreferrer"><ExternalLink size={14} /> {t('prop.openMaps')}</a></p>
      {full && (
        <Fullscreen onClose={() => setFull(false)} footer={<Button href={mapsLink(lat, lng)} icon={<ExternalLink size={16} />}>{t('prop.openMaps')}</Button>}>
          <iframe className="fs-map" src={mapEmbedUrl(lat, lng, 0.012)} title={name} />
        </Fullscreen>
      )}
    </>
  );
}
