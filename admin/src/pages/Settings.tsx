import { useCatalog } from '@/providers/CatalogProvider';
import Chip from '@/components/ui/Chip';

export default function Settings() {
  const { cat, features, live } = useCatalog();
  return (
    <>
      <h1>Settings</h1>
      <div className="list">
        <section className="panel stack">
          <h3>Feature switches</h3>
          <p className="muted">These come from the <code>features</code> block of <code>properties.json</code>. Change them there and push. No redeploy needed.</p>
          <div className="row-between"><span>Services tab</span><Chip tone={features.services ? 'ok' : 'warn'}>{features.services ? 'On' : 'Off'}</Chip></div>
          <div className="row-between"><span>Online payments</span><Chip tone={features.onlinePayments ? 'ok' : 'warn'}>{features.onlinePayments ? 'On' : 'Off'}</Chip></div>
        </section>
        <section className="panel stack">
          <h3>Catalog</h3>
          <div className="row-between"><span>Version</span><span className="muted">{cat.version} · {cat.updatedAt}</span></div>
          <div className="row-between"><span>Source</span><span className="muted">{live ? 'Remote JSON' : 'Bundled copy'}</span></div>
          <div className="row-between"><span>Properties / units / services</span><span className="muted">{cat.projects.length} / {cat.units.length} / {cat.services?.length ?? 0}</span></div>
        </section>
      </div>
    </>
  );
}
