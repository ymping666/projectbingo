import type { APIRoute } from 'astro';
import { publicPaths } from '../lib/routes';
import { withBase } from '../lib/url';
import { deployment, productionOrigin } from '../lib/deployment';
export const GET: APIRoute = ({ site }) =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${deployment.indexable ? publicPaths.map((path) => `<url><loc>${new URL(withBase(path), productionOrigin).href}</loc></url>`).join('') : ''}</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
