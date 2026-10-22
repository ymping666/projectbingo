import type { APIRoute } from 'astro';
import { templates } from '../lib/templates';
import { withBase } from '../lib/url';
export const GET: APIRoute = ({ site }) =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${site ? ['', 'templates/', 'how-to-play/', 'printing-guide/', 'about/', 'privacy/', ...templates.map((t) => `templates/${t.id}/`)].map((path) => `<url><loc>${new URL(withBase(path), site).href}</loc></url>`).join('') : ''}</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
