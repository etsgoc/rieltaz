import { useEffect, useState } from 'react';

export function useMediaQuery(query: string) {
  const [match, setMatch] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const mq = matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

export const useIsMobile = () => useMediaQuery('(max-width: 860px)');

export function useLockScroll(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [active]);
}

let assets: Promise<void> | null = null;
export function loadPannellum(js: string, css: string) {
  if (assets) return assets;
  assets = new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = css;
    document.head.appendChild(link);
    const s = document.createElement('script');
    s.src = js; s.onload = () => resolve(); s.onerror = () => { assets = null; reject(new Error('pannellum')); };
    document.head.appendChild(s);
  });
  return assets;
}
