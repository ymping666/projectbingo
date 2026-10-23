// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnalyticsConsent from './AnalyticsConsent';
import { readConsent, setAnalyticsConsent } from '../lib/analytics';

vi.mock('../lib/analytics', () => ({
  analyticsConfigured: true,
  readConsent: vi.fn(),
  setAnalyticsConsent: vi.fn().mockResolvedValue(true),
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

it('starts statistics for a new visitor without opening a prompt and keeps controls accessible', async () => {
  vi.mocked(readConsent).mockReturnValue(undefined);
  const user = userEvent.setup();
  render(<AnalyticsConsent />);
  expect(setAnalyticsConsent).toHaveBeenCalledWith(true);
  expect(screen.queryByRole('complementary')).toBeNull();
  await user.click(
    screen.getByRole('button', { name: 'Statistics preferences' }),
  );
  expect(
    screen.getByText('Statistics are currently on in this browser.'),
  ).toBeTruthy();
  await user.click(screen.getByRole('button', { name: 'Turn off statistics' }));
  expect(setAnalyticsConsent).toHaveBeenLastCalledWith(false);
  expect(screen.queryByRole('complementary')).toBeNull();
  await user.click(
    screen.getByRole('button', { name: 'Statistics preferences' }),
  );
  expect(
    screen.getByText('Statistics are currently off in this browser.'),
  ).toBeTruthy();
  await user.click(screen.getByRole('button', { name: 'Turn on statistics' }));
  expect(setAnalyticsConsent).toHaveBeenLastCalledWith(true);
});

it('honors an earlier opt-out and permits closing preferences without changing it', async () => {
  vi.mocked(readConsent).mockReturnValue(false);
  const user = userEvent.setup();
  render(<AnalyticsConsent />);
  expect(setAnalyticsConsent).toHaveBeenCalledWith(false);
  expect(screen.queryByRole('complementary')).toBeNull();
  await user.click(
    screen.getByRole('button', { name: 'Statistics preferences' }),
  );
  await user.click(screen.getByRole('button', { name: 'Close' }));
  expect(setAnalyticsConsent).toHaveBeenCalledTimes(1);
});
