import { Link, useParams } from 'react-router-dom';
import { LEGAL_IDS, legalDocs } from '@core';
import { useCatalog } from '@/providers/CatalogProvider';
import { useI18n } from '@/providers/I18nProvider';
import { usePageMeta } from '@/lib/meta';
import { useConsent } from '@/providers/ConsentProvider';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';

export default function Legal() {
  const { doc } = useParams();
  const { cat } = useCatalog();
  const { t } = useI18n();
  const { reopen } = useConsent();
  const entity = cat.legal ?? { company: 'Reeltaz', email: cat.contact?.email ?? '', address: '' };
  const docs = legalDocs(entity);
  const found = docs.find(d => d.id === doc);
  usePageMeta(found?.title);
  if (!found) return <div className="wrap section"><EmptyState title={t('error.notFound')} /></div>;
  return (
    <div className="wrap section legal">
      <nav className="legal-nav">
        {LEGAL_IDS.map(id => <Link key={id} to={`/legal/${id}`} className={id === found.id ? 'on' : ''}>{t(`legal.${id}`)}</Link>)}
      </nav>
      <article>
        <h1>{found.title}</h1>
        <p className="muted small">{t('legal.updated', { date: found.updated })}</p>
        <p className="notice">{t('legal.notice')}</p>
        {found.sections.map(s => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            {s.paragraphs.map((p, i) => <p key={i} className="body-text">{p}</p>)}
          </section>
        ))}
        {found.id === 'cookies' && <Button variant="soft" onClick={reopen}>{t('cookie.settings')}</Button>}
      </article>
    </div>
  );
}
