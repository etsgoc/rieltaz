import { Heart } from 'lucide-react';
import { useFavorites } from '@/providers/FavoritesProvider';
import { useI18n } from '@/providers/I18nProvider';

export default function HeartButton({ id, inline }: { id: string; inline?: boolean }) {
  const { has, toggle } = useFavorites();
  const { t } = useI18n();
  const on = has(id);
  return (
    <button
      type="button"
      className={`heart${inline ? ' heart-inline' : ''}${on ? ' on' : ''}`}
      aria-pressed={on}
      aria-label={on ? t('saved.remove') : t('saved.add')}
      onClick={e => { e.preventDefault(); e.stopPropagation(); toggle(id); }}>
      <Heart size={19} fill={on ? 'currentColor' : 'none'} />
    </button>
  );
}
