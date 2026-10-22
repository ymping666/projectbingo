import type { APIRoute } from 'astro';
import { withBase } from '../lib/url';
import { deployment, productionOrigin } from '../lib/deployment';
export const GET: APIRoute = ({ site }) =>
  new Response(
    deployment.indexable
      ? `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', productionOrigin).href}\n`
      : 'User-agent: *\nDisallow: /\n',
    { headers: { 'Content-Type': 'text/plain' } },
  );
