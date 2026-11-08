import { useCatalog } from '@/providers/CatalogProvider';
import { useI18n } from '@/providers/I18nProvider';

export default function AgentCard() {
  const { cat } = useCatalog();
  const { t } = useI18n();
  const a = cat.agent;
  if (!a) return null;
  return (
    <div className="agent">
      {a.photo ? <img src={a.photo} alt="" className="agent-pic" /> : <span className="agent-pic agent-initial" aria-hidden>{a.name.slice(0, 1)}</span>}
      <div>
        <span className="muted small">{t('prop.agent')}</span>
        <strong>{a.name}</strong>
        <span className="muted small">{[a.title, a.languages?.join(', ')].filter(Boolean).join(' · ')}</span>
      </div>
    </div>
  );
}
