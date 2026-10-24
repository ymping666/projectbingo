// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  render,
  screen,
  waitFor,
  cleanup,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PDFDocument } from 'pdf-lib';
import Editor from './Editor';
import { generate, STORAGE_KEY, type Project } from '../lib/model';
import { food, templateDraft } from '../lib/templates';
import { track, trackHostStart } from '../lib/analytics';
import Host from './Host';
vi.mock('../lib/analytics', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../lib/analytics')>()),
  track: vi.fn(),
  trackHostStart: vi.fn(),
}));
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
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
  };
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
  vi.mocked(track).mockClear();
  vi.mocked(trackHostStart).mockClear();
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
it('searches and filters templates, restores focus, and preserves saved cards until generation', async () => {
  const user = userEvent.setup();
  render(<Editor initial={initial()} />);
  await screen.findByText('Saved on this browser');
  const before = localStorage.getItem(STORAGE_KEY);
  const trigger = screen.getByRole('button', { name: /Start with a template/ });
  await user.click(trigger);
  const search = screen.getByRole('searchbox', { name: 'Search templates' });
  expect(document.activeElement).toBe(search);
  await user.click(
    within(
      screen.getByRole('group', { name: 'Template categories' }),
    ).getByRole('button', { name: 'Activities' }),
  );
  expect(
    within(screen.getByRole('dialog')).queryByRole('button', {
      name: 'Food Vocabulary',
    }),
  ).toBeNull();
  await user.type(search, 'no matching theme');
  expect(screen.getByText('No templates found')).toBeTruthy();
  await user.click(screen.getByRole('button', { name: 'Show all templates' }));
  await user.type(search, 'music');
  await user.click(
    within(screen.getByRole('dialog')).getByRole('button', {
      name: 'Music',
    }),
  );
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(document.activeElement).toBe(trigger);
  expect((screen.getByLabelText('Card title') as HTMLInputElement).value).toBe(
    'Music Bingo',
  );
  expect(localStorage.getItem(STORAGE_KEY)).toBe(before);
  expect(track).toHaveBeenCalledWith('template_used', {
    templateId: 'music-bingo',
    size: 5,
  });
  await user.click(trigger);
  await user.type(
    screen.getByRole('searchbox', { name: 'Search templates' }),
    'music',
  );
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(document.activeElement).toBe(trigger);
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
  await user.click(
    within(screen.getByRole('group', { name: 'Cards per page' })).getByRole(
      'button',
      { name: '4' },
    ),
  );
  expect(JSON.stringify(stored().cards)).toBe(cards);
  expect(JSON.stringify(stored().round)).toBe(round);
  await user.click(
    within(screen.getByRole('group', { name: 'Cards per page' })).getByRole(
      'button',
      { name: '2' },
    ),
  );
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
it('offers both dirty download branches and exports the exact new snapshot, with repeated-click protection', async () => {
  const user = userEvent.setup(),
    old = initial();
  render(<Editor initial={old} />);
  await screen.findByText('Saved on this browser');
  expect(track).not.toHaveBeenCalled();
  await user.click(
    screen.getByRole('button', { name: /Start with a template/ }),
  );
  await user.click(
    within(screen.getByRole('dialog')).getByRole('button', {
      name: 'Weather',
    }),
  );
  expect(screen.getByText('EDITS NOT GENERATED')).toBeTruthy();
  await user.click(screen.getByRole('button', { name: 'Download cards only' }));
  expect(screen.getByRole('dialog')).toBeTruthy();
  await user.click(
    screen.getByRole('button', { name: 'Download current card set' }),
  );
  await screen.findByText(/PDF ready:/, {}, { timeout: 15000 });
  expect(stored().id).toBe(old.id);
  expect(
    (await PDFDocument.load(await blobBytes(blobs.at(-1)!))).getTitle(),
  ).toBe(old.title);
  await user.click(screen.getByRole('button', { name: 'Download cards only' }));
  await user.dblClick(
    screen.getByRole('button', { name: 'Generate new set & download' }),
  );
  await waitFor(() => expect(blobs).toHaveLength(2), { timeout: 15000 });
  const next = stored();
  expect(next.id).not.toBe(old.id);
  expect(next.size).toBe(3);
  expect(next.round.cursor).toBe(0);
  const pdf = await PDFDocument.load(await blobBytes(blobs.at(-1)!));
  expect(pdf.getTitle()).toBe(next.title);
  expect(screen.getByText(next.cards[0].id)).toBeTruthy();
  expect(
    vi.mocked(track).mock.calls.filter((c) => c[0] === 'generation_success'),
  ).toHaveLength(1);
  expect(
    vi.mocked(track).mock.calls.filter((c) => c[0] === 'export_success'),
  ).toHaveLength(2);
}, 30000);
it('counts first actual call once across undo-to-zero, refresh and the independent host; imports old JSON without changing cards', async () => {
  const user = userEvent.setup();
  const legacy = JSON.parse(
    readFileSync('src/lib/fixtures/legacy-project-v1.json', 'utf8'),
  ) as Project;
  delete legacy.round.started;
  const view = render(<Editor initial={initial()} />);
  await screen.findByText('Saved on this browser');
  await user.upload(
    screen.getByLabelText('Import project JSON'),
    new File([JSON.stringify(legacy)], 'old-project.json', {
      type: 'application/json',
    }),
  );
  await screen.findByText('Project imported. Your cards and round are ready.');
  await waitFor(() => expect(stored().id).toBe(legacy.id));
  expect(stored().cards).toEqual(legacy.cards);
  expect(stored().print).toEqual(legacy.print);
  expect(stored().round.order).toEqual(legacy.round.order);
  expect(stored().round.cursor).toBe(legacy.round.cursor);
  await user.click(screen.getByRole('link', { name: /Start hosting/ }));
  expect(trackHostStart).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: /Start a new round/ }));
  await user.click(screen.getByRole('button', { name: /Call first word/ }));
  expect(trackHostStart).toHaveBeenCalledTimes(1);
  await user.click(screen.getByRole('button', { name: 'Undo' }));
  expect(stored().round.cursor).toBe(0);
  expect(stored().round.started).toBe(true);
  view.unmount();
  render(<Host />);
  await screen.findByText('0 of 50 words called');
  await user.click(screen.getByRole('button', { name: /Call first word/ }));
  expect(trackHostStart).toHaveBeenCalledTimes(1);
  await user.upload(
    screen.getByLabelText('Import project JSON'),
    new File([JSON.stringify(legacy)], 'old-project.json', {
      type: 'application/json',
    }),
  );
  await screen.findByText('Project imported. Your cards and round are ready.');
  expect(
    vi
      .mocked(track)
      .mock.calls.filter((c) => c[0] === 'project_import_success'),
  ).toHaveLength(2);
});
import BlankCards from './BlankCards';
it('keeps existing saved activity byte-for-byte through blank options and download', async () => {
  const user = userEvent.setup();
  const original = JSON.stringify(initial());
  localStorage.setItem(STORAGE_KEY, original);
  render(<BlankCards />);
  await user.click(
    within(screen.getByRole('group', { name: 'Grid size' })).getByRole(
      'button',
      { name: '5 × 5' },
    ),
  );
  await user.click(
    within(screen.getByRole('group', { name: 'Paper size' })).getByRole(
      'button',
      { name: 'US Letter' },
    ),
  );
  await user.click(screen.getByLabelText('Center FREE space'));
  await user.click(screen.getByRole('button', { name: 'Download blank PDF' }));
  await screen.findByText(/Blank PDF ready/);
  expect(localStorage.getItem(STORAGE_KEY)).toBe(original);
  expect(blobs).toHaveLength(1);
  const doc = await PDFDocument.load(await blobBytes(blobs[0]));
  expect(doc.getPage(0).getWidth()).toBe(612);
  expect(track).toHaveBeenCalledWith(
    'export_success',
    expect.objectContaining({ exportType: 'blank' }),
  );
  expect(
    vi
      .mocked(track)
      .mock.calls.some(
        (c) => c[0] === 'generation_success' || c[0] === 'host_start',
      ),
  ).toBe(false);
});
it('loads lowercase as a draft, switches uppercase without touching printed cards, and protects replacement', async () => {
  const user = userEvent.setup();
  const original = initial();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(original));
  history.replaceState(null, '', '/?template=alphabet-bingo&preset=lowercase');
  render(<Editor initial={initial()} />);
  await waitFor(() =>
    expect(
      (screen.getByLabelText('Your words') as HTMLTextAreaElement).value,
    ).toBe(Array.from('abcdefghijklmnopqrstuvwxyz').join('\n')),
  );
  await user.click(screen.getByRole('button', { name: 'Uppercase A–Z' }));
  expect(
    (screen.getByLabelText('Your words') as HTMLTextAreaElement).value,
  ).toBe(Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').join('\n'));
  expect(stored().cards).toEqual(original.cards);
  vi.mocked(window.confirm).mockReturnValue(false);
  await user.click(screen.getByRole('button', { name: /Generate/ }));
  expect(window.confirm).toHaveBeenCalled();
  expect(stored().id).toBe(original.id);
});
import CallerTool from './Caller';
import { CALLER_KEY } from '../lib/caller';
it('runs and restores the independent caller without changing an existing card project', async () => {
  const user = userEvent.setup();
  const saved = JSON.stringify(initial());
  localStorage.setItem(STORAGE_KEY, saved);
  const view = render(<CallerTool />);
  await user.click(screen.getByLabelText('Caller word list'));
  await user.paste(
    Array.from({ length: 30 }, (_, i) => `Caller word ${i + 1}`).join('\n'),
  );
  await user.click(screen.getByRole('button', { name: 'Start' }));
  await user.click(screen.getByRole('button', { name: 'Next word' }));
  const first = JSON.parse(localStorage.getItem(CALLER_KEY)!).order[0];
  expect(
    screen.getByText(first, { selector: '.caller-display' }),
  ).toBeDefined();
  await user.click(screen.getByRole('button', { name: 'Undo' }));
  await user.click(screen.getByRole('button', { name: 'Next word' }));
  expect(
    screen.getByText(first, { selector: '.caller-display' }),
  ).toBeDefined();
  view.unmount();
  render(<CallerTool />);
  await screen.findByText('29 remaining · 1 of 30 called');
  expect(localStorage.getItem(STORAGE_KEY)).toBe(saved);
  await user.click(screen.getByRole('button', { name: 'Restart' }));
  await screen.findByText('30 remaining · 0 of 30 called');
  expect(localStorage.getItem(STORAGE_KEY)).toBe(saved);
  const legacy = readFileSync(
    'src/lib/fixtures/legacy-project-v1.json',
    'utf8',
  );
  await user.upload(
    screen.getByLabelText('Import project JSON'),
    new File([legacy], 'project.json', { type: 'application/json' }),
  );
  await screen.findByText('Project imported. Your cards and round are ready.');
  expect(localStorage.getItem(STORAGE_KEY)).toBe(saved);
  expect(screen.getByRole('button', { name: /Next word/ })).toBeDefined();
});
it('generates observed and people presets with matching print flow and no primary host action', async () => {
  const user = userEvent.setup();
  for (const id of ['office-buzzword-bingo', 'office-icebreaker']) {
    const view = render(<Editor initial={initial()} />);
    await screen.findByText('Saved on this browser');
    await user.click(
      screen.getByRole('button', { name: /Start with a template/ }),
    );
    await user.click(
      within(screen.getByRole('dialog')).getByRole('button', {
        name:
          id === 'office-icebreaker' ? 'Office Icebreaker' : 'Office Buzzword',
      }),
    );
    const count = screen.getByLabelText('Number of cards');
    await user.clear(count);
    await user.type(count, '2');
    await user.click(
      screen.getByRole('button', { name: /Generate new card set/ }),
    );
    await screen.findByText(/Created 2 distinct card layouts/);
    expect(stored().mode).toBe(
      id === 'office-icebreaker' ? 'people' : 'observed',
    );
    expect(screen.queryByRole('link', { name: /Start hosting/ })).toBeNull();
    if (id === 'office-icebreaker') expect(stored().print.perPage).toBe(1);
    await user.click(
      screen.getByRole('button', { name: 'Download activity pack' }),
    );
    await screen.findByText(/PDF ready/);
    expect(
      (await PDFDocument.load(await blobBytes(blobs.at(-1)!))).getPageCount(),
    ).toBeGreaterThan(2);
    view.unmount();
  }
}, 20000);
