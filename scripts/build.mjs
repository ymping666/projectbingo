import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { loadEnv } from 'vite';
const supplied = {
  ...loadEnv('production', process.cwd(), ''),
  ...process.env,
};
const target = process.argv[2] || 'production';
if (!['production', 'preview'].includes(target))
  throw new Error('Unknown build target.');
const preview = target === 'preview';
const env = {
  ...supplied,
  ASTRO_TELEMETRY_DISABLED: '1',
  PUBLIC_DEPLOYMENT: target,
  PUBLIC_SITE_URL: preview
    ? 'https://ymping666.github.io'
    : 'https://bingocardkit.com',
  PUBLIC_BASE_PATH: preview ? '/projectbingo/' : '/',
  INDEXABLE_BUILD: preview ? 'false' : (supplied.INDEXABLE_BUILD ?? 'true'),
  ...(preview ? { PUBLIC_GA4_ID: '', PUBLIC_GA4_MANUAL_ONLY: 'false' } : {}),
};
const result = spawnSync(
  process.execPath,
  ['node_modules/astro/astro.js', 'build'],
  { env, stdio: 'inherit' },
);
if (
  result.status === 0 &&
  !preview &&
  env.INDEXABLE_BUILD === 'true' &&
  /^G-[A-Z0-9]{6,20}$/.test(env.PUBLIC_GA4_ID || '') &&
  env.PUBLIC_GA4_MANUAL_ONLY === 'true'
) {
  const headers = readFileSync('dist/_headers', 'utf8')
    .replace(
      "script-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
    )
    .replace(
      "connect-src 'self'",
      "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com",
    );
  writeFileSync('dist/_headers', headers);
}
process.exit(result.status ?? 1);
