// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PDFDocument } from 'pdf-lib';
import Editor from './Editor';
import { generate, STORAGE_KEY, type Project } from '../lib/model';
import { food, templateDraft } from '../lib/templates';
const font = readFileSync('public/fonts/Lato-Regular.ttf');
let blobs: Blob[] = [];
const blobText = (b: Blob) =>
  new Promise<string>((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.readAsText(b);
  });
const blobBytes = (b: Blob) =>
  new Promise<Uint8Array>((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(new Uint8Array(r.result as ArrayBuffer));
    r.readAsArrayBuffer(b);
  });
const initial = () =>
  generate(templateDraft(food), { paper: 'A4', perPage: 2, theme: 'ink' });
const stored = () => JSON.parse(localStorage.getItem(STORAGE_KEY)!) as Project;
beforeEach(() => {
  // jsdom's Blob lacks the browser-standard text() method inherited by File.
  if (!Blob.prototype.text)
    Object.defineProperty(Blob.prototype, 'text', {
      configurable: true,
      value: function (this: Blob) {
        return blobText(this);
      },
    });
  localStorage.clear();
  history.replaceState(null, '', '/');
  blobs = [];
  vi.spyOn(window, 'confirm').mockReturnValue(true);
  URL.createObjectURL = vi.fn((b: Blob) => {
    blobs.push(b);
    return 'blob:test';
  });
  URL.revokeObjectURL = vi.fn();
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(font)),
  );
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
it('completes 50 words → 40 cards → real A4 pack → hosting → undo → verify → JSON restore/import', async () => {
  const user = userEvent.setup();
  const old = initial();
  const view = render(<Editor initial={old} />);
  await screen.findByText('Saved on this browser');
  expect(
    (screen.getByLabelText('Your words') as HTMLTextAreaElement).value.split(
      '\n',
    ),
  ).toHaveLength(50);
  await user.click(screen.getByRole('button', { name: /^Generate cards$/ }));
  await screen.findByText(/Created 40 distinct card layouts/);
  const p = stored();
  expect(p.id).not.toBe(old.id);
  expect(p.cards).toHaveLength(40);
  expect(p.size).toBe(5);
  expect(p.free).toBe(true);
  const cards = JSON.stringify(p.cards),
    round = JSON.stringify(p.round);
  await user.selectOptions(screen.getByLabelText('Cards per page'), '4');
  expect(JSON.stringify(stored().cards)).toBe(cards);
  expect(JSON.stringify(stored().round)).toBe(round);
  await user.selectOptions(screen.getByLabelText('Cards per page'), '2');
  await user.click(screen.getByRole('button', { name: 'Next card' }));
  expect(screen.getByText(p.cards[1].id)).toBeTruthy();
  await user.click(screen.getByRole('button', { name: 'Download game pack' }));
  await screen.findByText(
    /PDF ready: 20 card pages \+ 3 caller and rules pages/,
    {},
    { timeout: 15000 },
  );
  const pdf = await PDFDocument.load(await blobBytes(blobs.at(-1)!));
  expect(pdf.getPageCount()).toBe(23);
  expect(pdf.getPage(0).getWidth()).toBeCloseTo(595.28);
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith('/fonts/Lato-Regular.ttf');
  await user.click(screen.getByRole('link', { name: /Start hosting/ }));
  await user.click(screen.getByRole('button', { name: /Call first word/ }));
  await user.click(screen.getByRole('button', { name: /Next word/ }));
  const second = p.words.find((w) => w.id === p.round.order[1])!.text;
  expect(screen.getAllByText(second).length).toBeGreaterThan(0);
  await user.click(screen.getByRole('button', { name: 'Undo' }));
  expect(stored().round.cursor).toBe(1);
  await user.click(screen.getByRole('button', { name: /Next word/ }));
  expect(stored().round.cursor).toBe(2);
  expect(JSON.stringify(stored().cards)).toBe(cards);
  await user.type(screen.getByLabelText('Full card ID'), p.cards[0].id);
  await user.click(screen.getByRole('button', { name: 'Check' }));
  expect(await screen.findByText(/No completed line yet/)).toBeTruthy();
  await user.click(screen.getByRole('button', { name: 'Save project' }));
  const json = await blobText(blobs.at(-1)!);
  expect(JSON.parse(json).round.cursor).toBe(2);
  view.unmount();
  render(<Editor initial={initial()} />);
  await screen.findByText(p.cards[0].id);
  expect(stored().id).toBe(p.id);
  expect(stored().round.cursor).toBe(2);
  const resumed = JSON.parse(json);
  resumed.round.cursor = 5;
  await user.upload(
    screen.getByLabelText('Import project JSON'),
    new File([JSON.stringify(resumed)], 'activity.json', {
      type: 'application/json',
    }),
  );
  await screen.findByText('Project imported. Your cards and round are ready.');
  expect(stored().round.cursor).toBe(5);
  expect(JSON.stringify(stored().cards)).toBe(cards);
  const before = localStorage.getItem(STORAGE_KEY);
  await user.upload(
    screen.getByLabelText('Import project JSON'),
    new File(['{"schemaVersion":99}'], 'bad.json', {
      type: 'application/json',
    }),
  );
  await screen.findByText(/Unsupported project version/);
  expect(localStorage.getItem(STORAGE_KEY)).toBe(before);
  await user.click(screen.getByRole('link', { name: /Start hosting/ }));
  await user.click(screen.getByRole('button', { name: /Start a new round/ }));
  expect(stored().round.cursor).toBe(0);
  expect(stored().round.number).toBe(2);
  expect(JSON.stringify(stored().cards)).toBe(cards);
}, 30000);
it('keeps the current session playable and downloadable when local saving fails', async () => {
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('Quota exceeded');
  });
  const user = userEvent.setup();
  render(<Editor initial={initial()} />);
  await screen.findByText(/Local saving failed/);
  await user.click(screen.getByRole('link', { name: /Start hosting/ }));
  await user.click(screen.getByRole('button', { name: /Call first word/ }));
  expect(screen.getByText('1 of 50 words called')).toBeTruthy();
  await user.click(screen.getByRole('button', { name: 'Save project' }));
  expect(JSON.parse(await blobText(blobs.at(-1)!)).round.cursor).toBe(1);
});
it('does not replace a corrupt saved project with the default example', async () => {
  localStorage.setItem(STORAGE_KEY, 'corrupt');
  render(<Editor initial={initial()} />);
  await screen.findByText(/Local restore unavailable/);
  expect(localStorage.getItem(STORAGE_KEY)).toBe('corrupt');
});
