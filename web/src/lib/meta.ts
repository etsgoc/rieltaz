import { useEffect } from 'react';

export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | Reeltaz` : 'Reeltaz | Residences and services in Phuket';
    if (description) document.querySelector('meta[name=description]')?.setAttribute('content', description);
  }, [title, description]);
}
