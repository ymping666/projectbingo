export const productionOrigin = 'https://bingocardkit.com';
const env = import.meta.env || {};
export const deployment = {
  target: env.PUBLIC_DEPLOYMENT || 'development',
  indexable: env.PUBLIC_INDEXABLE_BUILD === 'true',
  origin: env.PUBLIC_SITE_URL || '',
  base: env.BASE_URL || '/',
};
export const productionBuild =
  deployment.target === 'production' &&
  deployment.indexable &&
  deployment.origin.replace(/\/$/, '') === productionOrigin &&
  deployment.base === '/';
