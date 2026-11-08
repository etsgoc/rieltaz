import { useEffect } from 'react';
import { BRAND } from '@/config';

export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${BRAND.name}` : `${BRAND.name} | Properties worldwide`;
    if (description) document.querySelector('meta[name=description]')?.setAttribute('content', description);
  }, [title, description]);
}
