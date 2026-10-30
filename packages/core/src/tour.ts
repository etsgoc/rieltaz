import type { Project, Tour } from './types';

export function tourOf(p: Project): Tour | null {
  const t = p.media.tour360;
  if (!t || (typeof t === 'string' && t.startsWith('DRIVE_'))) return null;
  if (typeof t !== 'string') return t.url ? t : null;
  if (/\.(jpe?g|png|webp)(\?|$)/i.test(t)) return { type: 'pano', url: t };
  return { type: 'embed', url: t.startsWith('http') ? t : `https://drive.google.com/file/d/${t}/preview` };
}

export const PANNELLUM_JS = 'https://cdnjs.cloudflare.com/ajax/libs/pannellum/2.5.6/pannellum.js';
export const PANNELLUM_CSS = 'https://cdnjs.cloudflare.com/ajax/libs/pannellum/2.5.6/pannellum.css';

export const mapEmbedUrl = (lat: number, lng: number, span = 0.02) =>
  `https://www.openstreetmap.org/export/embed.html?bbox=${lng - span},${lat - span * 0.75},${lng + span},${lat + span * 0.75}&layer=mapnik&marker=${lat},${lng}`;
export const mapsLink = (lat: number, lng: number) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
