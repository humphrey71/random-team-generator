import fs from 'fs';
import path from 'path';

const DOMAIN = 'https://rollsquad.com';

const ROUTES = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: '/random-nfl-team-generator', priority: '0.9', changefreq: 'weekly' },
  { path: '/random-nba-team-generator', priority: '0.8', changefreq: 'weekly' },
  { path: '/random-mlb-team-generator', priority: '0.8', changefreq: 'weekly' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'monthly' },
  { path: '/terms', priority: '0.3', changefreq: 'monthly' },
];

export function generateSitemapXml(): string {
  const today = new Date().toISOString().slice(0, 10);
  const urls = ROUTES.map(r => `  <url>
    <loc>${DOMAIN}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

Sitemap: ${DOMAIN}/sitemap.xml
`;
}

// Run directly
const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), generateSitemapXml());
fs.writeFileSync(path.join(publicDir, 'robots.txt'), generateRobotsTxt());

console.log('Successfully generated sitemap.xml and robots.txt in public/');
