import type { APIRoute } from 'astro';
import { withBase } from '../lib/url';
export const GET: APIRoute = ({ site }) =>
  new Response(
    site
      ? `User-agent: *\nAllow: ${withBase('')}\nDisallow: ${withBase('host/')}\nSitemap: ${new URL(withBase('sitemap.xml'), site).href}\n`
      : 'User-agent: *\nDisallow: /\n',
    { headers: { 'Content-Type': 'text/plain' } },
  );
