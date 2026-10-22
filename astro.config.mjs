import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { loadEnv } from 'vite';
const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');
const site = process.env.PUBLIC_SITE_URL || env.PUBLIC_SITE_URL;
if (site) {
  const u = new URL(site);
  if (
    u.protocol !== 'https:' ||
    /localhost|example\.|\.pages\.dev$|\.workers\.dev$|\.vercel\.app$|\.netlify\.app$|\.test$|\.invalid$/.test(
      u.hostname,
    ) ||
    !u.hostname.includes('.') ||
    /^[\d.]+$/.test(u.hostname) ||
    u.username ||
    u.password ||
    u.search ||
    u.hash ||
    u.pathname !== '/'
  )
    throw new Error(
      'PUBLIC_SITE_URL must be your real HTTPS production origin.',
    );
}
if ((process.env.INDEXABLE_BUILD || env.INDEXABLE_BUILD) === 'true' && !site)
  throw new Error('An indexable build requires PUBLIC_SITE_URL.');
export default defineConfig({
  site,
  output: 'static',
  integrations: [react()],
  trailingSlash: 'always',
});
