// Fills media for every listing from the folders in web/public/images/<imageFolder or listing id>/.
// Run from the repo root after adding photos:  node scripts/sync-media.mjs
//   cover.*              used as the cover (otherwise the first photo)
//   360.* or pano*       used as a 360 panorama image (top level of the folder only)
//   sub folders          each one becomes a photo area (Kitchen, Pool, a unit type...), nested folders are joined
//   photos in the root   go to an area called General
//   _labels.json         optional, maps a folder path to its display name (the Colab notebook writes it)
// 360 links to other sites live in the JSON itself, see data/BLUEPRINTS.md. This script keeps them.
// Then commit data/properties.json together with the images.
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const file = 'data/properties.json';
const root = 'web/public/images';
const data = JSON.parse(readFileSync(file, 'utf8'));
const isImage = n => /\.(jpe?g|png|webp|avif)$/i.test(n);
const natural = (a, b) => a.localeCompare(b, undefined, { numeric: true });
const pretty = s => s.replace(/[-_]+/g, ' ').replace(/^./, c => c.toUpperCase());

function walk(base, dir = base, out = new Map()) {
  const names = readdirSync(dir).sort(natural);
  const here = names.filter(n => isImage(n) && statSync(join(dir, n)).isFile());
  if (here.length) out.set(relative(base, dir).split(sep).join('/'), here);
  for (const n of names) if (statSync(join(dir, n)).isDirectory()) walk(base, join(dir, n), out);
  return out;
}

// External and Facilities come before the unit types
const FIRST = ['external', 'exterior', 'facilities'];
const rank = rel => { const i = FIRST.indexOf(rel.split('/')[0]); return i === -1 ? FIRST.length : i; };

let changed = 0;
for (const p of data.projects) {
  const folder = p.imageFolder ?? p.id;
  const base = join(root, folder);
  if (!existsSync(base)) continue;
  const dirs = walk(base);
  if (!dirs.size) continue;
  const labels = existsSync(join(base, '_labels.json')) ? JSON.parse(readFileSync(join(base, '_labels.json'), 'utf8')) : {};
  const path = (rel, n) => [folder, rel, n].filter(Boolean).join('/');

  const rootFiles = dirs.get('') ?? [];
  const pano = rootFiles.find(n => /^(360|pano)/i.test(n));
  if (pano) dirs.set('', rootFiles.filter(n => n !== pano));

  const groups = [...dirs.entries()].filter(([, f]) => f.length).sort(([a], [b]) => (a === '' ? -1 : b === '' ? 1 : rank(a) - rank(b) || natural(a, b)))
    .map(([rel, f]) => ({
      id: rel === '' ? 'general' : rel.replace(/\//g, '-'),
      label: rel === '' ? 'General' : labels[rel] ?? rel.split('/').map(s => labels[s] ?? pretty(s)).join(' / '),
      images: f.map(n => path(rel, n)),
    }));

  const flat = groups.flatMap(g => g.images);
  const cover = flat.find(i => /\/cover\.[a-z]+$/i.test(i)) ?? flat[0];
  const mosaic = [];                                          // one photo from each area first, then fill up
  for (let round = 0; mosaic.length < 8 && round < 4; round++)
    for (const g of groups) { const i = g.images[round]; if (i && i !== cover && !mosaic.includes(i) && mosaic.length < 8) mosaic.push(i); }

  p.media = {
    ...p.media,
    cover,
    gallery: mosaic,
    groups,
    tour360: pano ? { type: 'pano', url: `${data.mediaBase}${path('', pano)}` } : (p.media?.tour360 ?? null),
  };
  changed++;
  console.log(`${p.id}: ${flat.length} photos in ${groups.length} areas${pano ? ', 360 image' : ''}`);
}
if (changed) { data.version = (data.version ?? 0) + 1; data.updatedAt = new Date().toISOString().slice(0, 10); writeFileSync(file, JSON.stringify(data, null, 2) + '\n'); }
console.log(changed ? `Updated ${changed} listings, version ${data.version}.` : `No image folders found. Create ${root}/<listing id>/ and add photos.`);
