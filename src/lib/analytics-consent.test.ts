// @vitest-environment jsdom
// @vitest-environment-options {"url":"https://bingocardkit.com/?private=words#card"}
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  sessionStorage.clear();
  const gaWindow = window as unknown as { dataLayer?: IArguments[] };
  delete gaWindow.dataLayer;
  for (const [key, value] of Object.entries({
    PUBLIC_DEPLOYMENT: 'production',
    PUBLIC_INDEXABLE_BUILD: 'true',
    PUBLIC_SITE_URL: 'https://bingocardkit.com',
    BASE_URL: '/',
    PUBLIC_GA4_ID: 'G-TESTONLY01',
    PUBLIC_GA4_MANUAL_ONLY: 'true',
    MODE: 'production',
  }))
    vi.stubEnv(key, value);
  vi.spyOn(document.head, 'append').mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});
it('requests nothing before opt-in or after rejection; contains script network failure', async () => {
  const a = await import('./analytics');
  expect(a.analyticsConfigured).toBe(true);
  expect(document.head.append).not.toHaveBeenCalled();
  await a.setAnalyticsConsent(false);
  a.track('generation_success', { count: 40 });
  expect(document.head.append).not.toHaveBeenCalled();
  const loading = a.setAnalyticsConsent(true);
  const script = vi.mocked(document.head.append).mock
    .calls[0][0] as HTMLScriptElement;
  expect(script.referrerPolicy).toBe('no-referrer');
  script.dispatchEvent(new Event('error'));
  expect(await loading).toBe(false);
  expect(() => a.track('export_success')).not.toThrow();
});
it('filters default GA page fields and stops events on withdrawal, even while the script loads', async () => {
  const a = await import('./analytics');
  const promise = a.setAnalyticsConsent(true);
  await a.setAnalyticsConsent(false);
  const script = vi.mocked(document.head.append).mock
    .calls[0][0] as HTMLScriptElement;
  script.dispatchEvent(new Event('load'));
  expect(await promise).toBe(false);
  const w = window as unknown as Window & { dataLayer: IArguments[] };
  const before = w.dataLayer.length;
  a.track('export_success');
  expect(w.dataLayer).toHaveLength(before);
  await a.setAnalyticsConsent(true);
  a.track('export_success', { size: 5 });
  const calls = w.dataLayer.map((args) => Array.from(args));
  expect(calls.filter((c) => c[0] === 'event')).toHaveLength(1);
  const sent = JSON.stringify(calls);
  expect(sent).not.toContain('private');
  expect(sent).not.toContain('#card');
  expect(sent).toContain('send_page_view');
  expect(sent).toContain('page_referrer');
  await a.setAnalyticsConsent(false);
  const count = w.dataLayer.length;
  a.track('export_success');
  expect(w.dataLayer).toHaveLength(count);
});
it('prevents all Google script loading in preview and automated browsers', async () => {
  vi.stubEnv('PUBLIC_DEPLOYMENT', 'preview');
  let a = await import('./analytics');
  expect(a.analyticsConfigured).toBe(false);
  expect(await a.setAnalyticsConsent(true)).toBe(false);
  vi.resetModules();
  vi.stubEnv('PUBLIC_DEPLOYMENT', 'production');
  Object.defineProperty(navigator, 'webdriver', {
    configurable: true,
    get: () => true,
  });
  a = await import('./analytics');
  expect(await a.setAnalyticsConsent(true)).toBe(false);
  expect(document.head.append).not.toHaveBeenCalled();
  Object.defineProperty(navigator, 'webdriver', {
    configurable: true,
    get: () => false,
  });
});

it('keeps Google disabled when the manual-only confirmation or real ID is absent', async () => {
  vi.stubEnv('PUBLIC_GA4_MANUAL_ONLY', 'false');
  let a = await import('./analytics');
  expect(a.analyticsConfigured).toBe(false);
  expect(await a.setAnalyticsConsent(true)).toBe(false);
  vi.resetModules();
  vi.stubEnv('PUBLIC_GA4_MANUAL_ONLY', 'true');
  vi.stubEnv('PUBLIC_GA4_ID', '');
  a = await import('./analytics');
  expect(a.analyticsConfigured).toBe(false);
  expect(await a.setAnalyticsConsent(true)).toBe(false);
  expect(document.head.append).not.toHaveBeenCalled();
});

it('sends a fixed referrer for recognized sources and never the original URL', async () => {
  vi.spyOn(document, 'referrer', 'get').mockReturnValue(
    'https://www.reddit.com/r/example/comments/private?words=secret#private',
  );
  const a = await import('./analytics');
  const loading = a.setAnalyticsConsent(true);
  const script = vi.mocked(document.head.append).mock.calls[0][0] as HTMLScriptElement;
  script.dispatchEvent(new Event('load'));
  expect(await loading).toBe(true);
  const w = window as unknown as Window & { dataLayer: IArguments[] };
  const calls = w.dataLayer.map((args) => Array.from(args));
  const json = JSON.stringify(calls);
  expect(json).toContain('https://www.reddit.com/');
  expect(json).not.toContain('/r/example');
  expect(json).not.toContain('secret');
  expect(json).not.toContain('ignore_referrer');
});

it('keeps the sanitized landing page across a template-to-maker navigation', async () => {
  const originalUrl = location.href;
  const load = async () => {
    const a = await import('./analytics');
    const loading = a.setAnalyticsConsent(true);
    const script = vi.mocked(document.head.append).mock.calls.at(-1)![0] as HTMLScriptElement;
    script.dispatchEvent(new Event('load'));
    await loading;
    return a;
  };
  const events = () =>
    (window as unknown as { dataLayer: IArguments[] }).dataLayer
      .map((args) => Array.from(args))
      .filter(([type]) => type === 'event');
  try {
    history.replaceState(null, '', '/classroom-bingo/?private=secret');
    const guide = await load();
    guide.track('template_used', { templateId: 'sight-word-bingo' });
    history.replaceState(null, '', '/?template=sight-word-bingo');
    vi.resetModules();
    const maker = await load();
    maker.track('generation_success');
    maker.track('export_success');
    for (const name of ['template_used', 'generation_success', 'export_success'])
      expect(events().find((event) => event[1] === name)?.[2]).toMatchObject({
        landing_page_path: '/classroom-bingo/',
      });
    expect(JSON.stringify(events())).not.toContain('secret');
    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 30 * 60 * 1000);
    maker.track('export_success');
    expect(events().at(-1)?.[2]).toMatchObject({ landing_page_path: '/' });
    await maker.setAnalyticsConsent(false);
    expect(sessionStorage.getItem('bingo-card-kit:analytics-landing')).toBeNull();
  } finally {
    history.replaceState(null, '', originalUrl);
  }
});
