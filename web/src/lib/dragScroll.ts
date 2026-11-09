import { useEffect, useRef } from 'react';

/** Lets a horizontally scrolling row be dragged with a mouse and scrolled with the wheel. Touch scrolling already works natively. */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let down = false, moved = false, startX = 0, startLeft = 0;
    const onDown = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; startX = e.clientX; startLeft = el.scrollLeft; };
    const onMove = (e: PointerEvent) => { if (!down) return; const dx = e.clientX - startX; if (Math.abs(dx) > 4) { moved = true; el.classList.add('dragging'); } if (moved) el.scrollLeft = startLeft - dx; };
    const end = () => { down = false; el.classList.remove('dragging'); };
    const onClick = (e: MouseEvent) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } };
    const onWheel = (e: WheelEvent) => { if (el.scrollWidth > el.clientWidth && Math.abs(e.deltaY) > Math.abs(e.deltaX)) { el.scrollLeft += e.deltaY; e.preventDefault(); } };
    el.addEventListener('pointerdown', onDown); window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', end);
    el.addEventListener('click', onClick, true); el.addEventListener('wheel', onWheel, { passive: false });
    return () => { el.removeEventListener('pointerdown', onDown); window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', end); el.removeEventListener('click', onClick, true); el.removeEventListener('wheel', onWheel); };
  }, []);
  return ref;
}
