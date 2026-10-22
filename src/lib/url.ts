// One path policy for domain-root deployments and GitHub project Pages.
export const basePath = (import.meta.env?.BASE_URL || '/').replace(/\/?$/, '/');
export const withBase = (path = '') => basePath + path.replace(/^\/+/, '');
export const routePath = (pathname: string) =>
  pathname.startsWith(basePath)
    ? '/' + pathname.slice(basePath.length)
    : pathname;
