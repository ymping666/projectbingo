export const config = {
  name: 'Bingo Print Kit',
  contactEmail: '',
  ads: { enabled: false, publisherId: '' },
  analytics: { enabled: false },
};
type Event =
  | 'generation_success'
  | 'export_success'
  | 'host_start'
  | 'project_import_success';
// Deliberately inert. Any future adapter must accept only this non-content allowlist.
export function track(
  _event: Event,
  _data: { templateId?: string; size?: number; count?: number },
) {}
