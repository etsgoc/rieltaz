import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

function envSite() {
  if (process.env.VITE_SITE_URL) return process.env.VITE_SITE_URL;
  const file = join(root, '.env');
  if (existsSync(file)) {
    const m = readFileSync(file, 'utf8').match(/^VITE_SITE_URL=(.+)$/m);
    if (m) return m[1].trim();
  }
  return 'https://reeltaz.com';
}

const site = envSite().replace(/\/$/, '');
const cat = JSON.parse(readFileSync(join(root, '..', 'data', 'properties.json'), 'utf8'));
const paths = ['/', '/properties', '/about', '/contact', '/legal/terms', '/legal/privacy', '/legal/refunds', '/legal/cookies'];
cat.projects.forEach(p => paths.push(`/properties/${p.id}`));
if (cat.features?.services) {
  paths.push('/services');
  (cat.serviceCategories ?? []).forEach(c => paths.push(`/services/${c.id}`));
}
const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(p => `  <url><loc>${site}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`;
writeFileSync(join(root, 'public', 'sitemap.xml'), xml);
writeFileSync(join(root, 'public', 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
console.log(`sitemap: ${paths.length} urls for ${site}`);
