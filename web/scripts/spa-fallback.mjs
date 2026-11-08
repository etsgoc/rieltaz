// GitHub Pages and similar hosts need a 404.html that serves the app, so deep links such as /properties/lisbon-chiado-loft work.
import { copyFileSync, existsSync } from 'node:fs';
if (existsSync('dist/index.html')) copyFileSync('dist/index.html', 'dist/404.html');
