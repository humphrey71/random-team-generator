import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

async function runPrerender() {
  console.log('--- Starting SSG Prerendering for Cloudflare Pages ---');

  if (!fs.existsSync(distDir)) {
    console.error('dist directory does not exist! Run vite build first.');
    process.exit(1);
  }

  const templatePath = path.resolve(distDir, 'index.html');
  const templateHtml = fs.readFileSync(templatePath, 'utf-8');

  // Start Vite dev server in middleware mode to load SSR modules
  const vite = await createServer({
    root: rootDir,
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    const { renderPage, ROUTE_METAS } = await vite.ssrLoadModule('/src/ssr-renderer.ts');

    for (const [routePath, meta] of Object.entries(ROUTE_METAS)) {
      console.log(`Prerendering route: ${routePath}`);
      const { html } = await renderPage(routePath);

      let pageHtml = templateHtml;

      // Replace title
      pageHtml = pageHtml.replace(
        /<title>.*?<\/title>/,
        `<title>${meta.title}</title>\n    <meta name="description" content="${meta.description}" />\n    <link rel="canonical" href="https://rollsquad.com${routePath === '/' ? '' : routePath}" />`
      );

      // Inject rendered markup into #root
      pageHtml = pageHtml.replace(
        '<div id="root"></div>',
        `<div id="root">${html}</div>`
      );

      if (routePath === '/') {
        fs.writeFileSync(path.resolve(distDir, 'index.html'), pageHtml, 'utf-8');
      } else {
        const cleanPath = routePath.replace(/^\//, '');

        // Write both /route.html and /route/index.html for universal CF Pages matching
        fs.writeFileSync(path.resolve(distDir, `${cleanPath}.html`), pageHtml, 'utf-8');

        const nestedDir = path.resolve(distDir, cleanPath);
        if (!fs.existsSync(nestedDir)) {
          fs.mkdirSync(nestedDir, { recursive: true });
        }
        fs.writeFileSync(path.resolve(nestedDir, 'index.html'), pageHtml, 'utf-8');
      }
    }

    // 404 fallback
    fs.copyFileSync(path.resolve(distDir, 'index.html'), path.resolve(distDir, '404.html'));
    console.log('SSG Prerendering successfully completed for all routes!');
  } finally {
    await vite.close();
  }
}

runPrerender().catch(err => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
