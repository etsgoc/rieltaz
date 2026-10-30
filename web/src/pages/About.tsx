import { useI18n } from '@/providers/I18nProvider';
import { useCatalog } from '@/providers/CatalogProvider';

export default function About() {
  const { t } = useI18n();
  const { cat } = useCatalog();
  return (
    <div className="wrap section narrow">
      <h1>{t('about.title')}</h1>
      <p className="lead">{t('about.body1')}</p>
      <p className="lead">{t('about.body2')}</p>
      <div className="grid one">
        {cat.developers?.map(d => (
          <div className="panel" key={d.id}><h3>{d.name}</h3><p className="muted">{d.area}</p>{d.blurb && <p>{d.blurb}</p>}</div>
        ))}
      </div>
    </div>
  );
}
