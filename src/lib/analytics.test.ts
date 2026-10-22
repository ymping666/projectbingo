import { expect, it, vi } from 'vitest';
import {
  createTracker,
  safeParameters,
  safePageLocation,
  analyticsConfigured,
  exportErrorCode,
} from './analytics';
it('sends only whitelisted settings, never imported IDs, content or arbitrary errors', () => {
  const input = {
    templateId: 'private title',
    title: 'secret',
    id: 'ABC12345',
    words: ['secret'],
    query: 'secret',
    size: 5,
    count: 40,
    paper: 'A4',
    perPage: 2,
    exportType: 'cards',
    errorCode: 'secret raw error',
  };
  expect(safeParameters(input)).toEqual({
    grid_size: 5,
    card_count: 40,
    paper: 'A4',
    cards_per_page: 2,
    export_type: 'cards',
  });
  expect(
    safeParameters({
      templateId: 'food-vocabulary-bingo',
      size: 9,
      count: 201,
      paper: 'secret',
      perPage: 8,
      errorCode: 'font_load',
    }),
  ).toEqual({ template_id: 'food-vocabulary-bingo', error_code: 'font_load' });
  expect(safePageLocation('/?title=secret#private')).toBe(
    'https://bingocardkit.com/',
  );
  expect(safePageLocation('/private-project-id?word=secret')).toBe(
    'https://bingocardkit.com/404/',
  );
});
it('does nothing while disabled and keeps local deduplication identifiers out of payloads', () => {
  const emit = vi.fn();
  let enabled = false;
  const track = createTracker(
    emit,
    () => enabled,
    () => '/host/?secret=word#card',
  );
  track('host_start', { count: 40 }, 'host:PRIVATE:1');
  expect(emit).not.toHaveBeenCalled();
  enabled = true;
  track('host_start', { count: 40 }, 'host:PRIVATE:1');
  track('host_start', { count: 40 }, 'host:PRIVATE:1');
  expect(emit).toHaveBeenCalledTimes(1);
  expect(emit).toHaveBeenCalledWith('host_start', {
    card_count: 40,
    page_location: 'https://bingocardkit.com/host/',
    page_title: 'Bingo Card Kit',
    page_referrer: '',
  });
  track('host_start', {}, 'host:PRIVATE:2');
  expect(emit).toHaveBeenCalledTimes(2);
  expect(JSON.stringify(emit.mock.calls)).not.toContain('PRIVATE');
});
it('contains measurement failures and maps errors to fixed categories', () => {
  const track = createTracker(
    () => {
      throw new Error('network');
    },
    () => true,
    () => '/',
  );
  expect(() => track('export_success')).not.toThrow();
  expect(analyticsConfigured).toBe(false);
  expect(exportErrorCode(new Error('Cannot fit secret at 10 pt'))).toBe(
    'text_overflow',
  );
  expect(exportErrorCode(new Error('private title'))).toBe('export_failed');
});
