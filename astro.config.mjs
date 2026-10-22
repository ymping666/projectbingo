import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { loadEnv } from 'vite';
const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');
const site = process.env.PUBLIC_SITE_URL || env.PUBLIC_SITE_URL;
const base = process.env.PUBLIC_BASE_PATH || env.PUBLIC_BASE_PATH || '/';
const target =
  process.env.PUBLIC_DEPLOYMENT || env.PUBLIC_DEPLOYMENT || 'development';
const requestedIndex =
  (process.env.INDEXABLE_BUILD ?? env.INDEXABLE_BUILD) === 'true';
const indexable =
  requestedIndex &&
  target === 'production' &&
  site?.replace(/\/$/, '') === 'https://bingocardkit.com' &&
  base === '/';
if (requestedIndex && !indexable)
  throw new Error(
    'Indexable builds require the production target, https://bingocardkit.com and root base /.',
  );
if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(base))
  throw new Error(
    'PUBLIC_BASE_PATH must be / or a slash-delimited path ending in /.',
  );
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
  base,
  outDir: target === 'preview' ? './dist-preview' : './dist',
  output: 'static',
  integrations: [react()],
  trailingSlash: 'always',
  vite: {
    define: {
      'import.meta.env.PUBLIC_INDEXABLE_BUILD': JSON.stringify(
        String(indexable),
      ),
    },
  },
});
