import { templates } from './templates';
import { productionBuild, productionOrigin } from './deployment';
import type { Project } from './model';
export type AnalyticsEvent =
  | 'template_used'
  | 'generation_success'
  | 'export_success'
  | 'export_error'
  | 'host_start'
  | 'project_import_success';
export type EventInput = {
  templateId?: unknown;
  size?: unknown;
  count?: unknown;
  paper?: unknown;
  perPage?: unknown;
  exportType?: unknown;
  errorCode?: unknown;
};
export type SafePayload = Record<string, string | number | boolean>;
const events = new Set<AnalyticsEvent>([
  'template_used',
  'generation_success',
  'export_success',
  'export_error',
  'host_start',
  'project_import_success',
]);
const knownTemplates = new Set(templates.map((t) => t.id));
const errors = new Set([
  'font_load',
  'unsupported_glyph',
  'text_overflow',
  'download_error',
  'export_failed',
]);
const routes = new Set([
  '/',
  '/templates/',
  '/about/',
  '/privacy/',
  '/how-to-play/',
  '/printing-guide/',
  '/host/',
  ...templates.map((t) => `/templates/${t.id}/`),
]);
export function safeParameters(input: EventInput = {}): SafePayload {
  const result: SafePayload = {};
  if (
    typeof input.templateId === 'string' &&
    knownTemplates.has(input.templateId)
  )
    result.template_id = input.templateId;
  if (input.size === 3 || input.size === 5) result.grid_size = input.size;
  if (
    typeof input.count === 'number' &&
    Number.isInteger(input.count) &&
    input.count >= 1 &&
    input.count <= 200
  )
    result.card_count = input.count;
  if (input.paper === 'A4' || input.paper === 'Letter')
    result.paper = input.paper;
  if (input.perPage === 1 || input.perPage === 2 || input.perPage === 4)
    result.cards_per_page = input.perPage;
  if (['cards', 'game_pack', 'sample'].includes(input.exportType as string))
    result.export_type = input.exportType as string;
  if (typeof input.errorCode === 'string' && errors.has(input.errorCode))
    result.error_code = input.errorCode;
  return result;
}
export function safePageLocation(pathname: string) {
  const path = pathname.split(/[?#]/)[0];
  return productionOrigin + (routes.has(path) ? path : '/404/');
}
export function createTracker(
  emit: (event: string, payload: SafePayload) => void,
  enabled: () => boolean,
  path: () => string,
) {
  const sent = new Set<string>();
  return (
    event: AnalyticsEvent,
    input: EventInput = {},
    localOnceKey?: string,
  ) => {
    try {
      if (
        !events.has(event) ||
        !enabled() ||
        (localOnceKey && sent.has(localOnceKey))
      )
        return;
      if (localOnceKey) sent.add(localOnceKey);
      emit(event, {
        ...safeParameters(input),
        page_location: safePageLocation(path()),
        page_title: 'Bingo Card Kit',
        page_referrer: '',
      });
    } catch {
      /* Usage measurement must never interrupt an activity. */
    }
  };
}
const env = import.meta.env || {};
export const measurementId = env.PUBLIC_GA4_ID || '';
// Enable only after the property owner has turned OFF every GA4 Enhanced Measurement option.
export const analyticsConfigured =
  productionBuild &&
  /^G-[A-Z0-9]{6,20}$/.test(measurementId) &&
  env.PUBLIC_GA4_MANUAL_ONLY === 'true';
const CONSENT_KEY = 'bingo-card-kit:analytics-consent';
let consent = false,
  active = false,
  loaded = false,
  loading: Promise<boolean> | undefined;
type GAWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};
const eligible = () =>
  analyticsConfigured &&
  typeof window !== 'undefined' &&
  window.location.origin === productionOrigin &&
  !navigator.webdriver &&
  env.MODE !== 'test';
export function readConsent(): boolean | undefined {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === 'allow' ? true : v === 'deny' ? false : undefined;
  } catch {
    return undefined;
  }
}
function disableCookies() {
  for (const part of document.cookie.split(';')) {
    const name = part.trim().split('=')[0];
    if (name.startsWith('bck_ga'))
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure`;
  }
}
export async function setAnalyticsConsent(allow: boolean): Promise<boolean> {
  consent = allow;
  try {
    localStorage.setItem(CONSENT_KEY, allow ? 'allow' : 'deny');
  } catch {}
  if (typeof window === 'undefined') return false;
  const w = window as GAWindow;
  (w as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] =
    !allow;
  if (!allow) {
    active = false;
    disableCookies();
    return true;
  }
  if (!eligible()) return false;
  if (loaded) {
    active = true;
    return true;
  }
  if (loading) {
    const ok = await loading;
    active = consent && ok;
    return active;
  }
  w.dataLayer = w.dataLayer || [];
  w.gtag = function () {
    w.dataLayer!.push(arguments);
  };
  // The Google script is requested only after opt-in; there are no pre-consent pings.
  w.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  w.gtag('set', {
    page_location: safePageLocation(location.pathname),
    page_title: 'Bingo Card Kit',
    page_referrer: '',
    ads_data_redaction: true,
    url_passthrough: false,
  });
  w.gtag('js', new Date());
  w.gtag('config', measurementId, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    ignore_referrer: true,
    page_location: safePageLocation(location.pathname),
    page_title: 'Bingo Card Kit',
    page_referrer: '',
    cookie_prefix: 'bck',
    cookie_domain: 'none',
    cookie_flags: 'SameSite=Lax;Secure',
  });
  loading = new Promise<boolean>((resolve) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.referrerPolicy = 'no-referrer';
    const timer = setTimeout(() => {
      active = false;
      resolve(false);
    }, 8000);
    script.onload = () => {
      clearTimeout(timer);
      loaded = true;
      active = consent;
      if (active)
        w.gtag?.('event', 'page_view', {
          page_location: safePageLocation(location.pathname),
          page_title: 'Bingo Card Kit',
          page_referrer: '',
        });
      resolve(active);
    };
    script.onerror = () => {
      clearTimeout(timer);
      active = false;
      resolve(false);
    };
    document.head.append(script);
  });
  return loading;
}
export const track = createTracker(
  (event, payload) => (window as GAWindow).gtag?.('event', event, payload),
  () => eligible() && consent && active,
  () => location.pathname,
);
export function projectParameters(p: Project): EventInput {
  return {
    templateId: p.templateId,
    size: p.size,
    count: p.cards.length,
    paper: p.print.paper,
    perPage: p.print.perPage,
  };
}
export function trackHostStart(p: Project) {
  // Deduplication keys stay local and never enter the event payload.
  track('host_start', projectParameters(p), `host:${p.id}:${p.round.number}`);
}
export function exportErrorCode(error: unknown): string {
  const message = error instanceof Error ? error.message : '';
  if (/font could not load/i.test(message)) return 'font_load';
  if (/cannot display/i.test(message)) return 'unsupported_glyph';
  if (/10 pt|Cannot fit/i.test(message)) return 'text_overflow';
  return 'export_failed';
}
