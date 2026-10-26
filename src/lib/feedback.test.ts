import { expect, it } from 'vitest';
import { feedbackFormUrl } from './feedback';

const url =
  'https://docs.google.com/forms/d/e/1FAIpQLSabcdefghijklmnopqrstuv/viewform';

it('accepts a canonical public responder link, or disables an unconfigured entry', () => {
  expect(feedbackFormUrl('')).toBe('');
  expect(feedbackFormUrl('  ' + url + '  ')).toBe(url);
});

it('rejects editor, email, credential and lookalike-host links', () => {
  for (const invalid of [
    'mailto:owner@example.com',
    'https://docs.google.com/forms/d/private-edit-id/edit',
    'https://docs.google.com.evil.example/forms/d/e/abcdefghijklmnopqrstuv/viewform',
    'https://owner:password@docs.google.com/forms/d/e/abcdefghijklmnopqrstuv/viewform',
    url.replace('https:', 'http:'),
  ])
    expect(() => feedbackFormUrl(invalid)).toThrow('public Google Forms');
});

it('rejects prefilled answers and fragments instead of putting user content in URLs', () => {
  expect(() => feedbackFormUrl(url + '?entry.123=private-note')).toThrow();
  expect(() => feedbackFormUrl(url + '#private-note')).toThrow();
});
