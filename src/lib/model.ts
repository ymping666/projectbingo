export type GameMode = 'called' | 'observed' | 'people';
export type Word = { id: string; text: string };
export type Cell = { kind: 'word'; wordId: string } | { kind: 'free' };
export type Card = { id: string; cells: Cell[] };
export type Print = {
  paper: 'A4' | 'Letter';
  perPage: 1 | 2 | 4;
  theme: 'ink' | 'sage' | 'plum';
};
export type Project = {
  schemaVersion: 1;
  generatorVersion: '1.0';
  id: string;
  title: string;
  createdAt: string;
  templateId?: string;
  mode?: GameMode;
  words: Word[];
  size: 3 | 5;
  free: boolean;
  cards: Card[];
  print: Print;
  round: { number: number; order: string[]; cursor: number; started?: boolean };
};
export type Draft = {
  title: string;
  text: string;
  size: 3 | 5;
  free: boolean;
  count: number;
  templateId?: string;
  mode?: GameMode;
};
export const STORAGE_KEY = 'bingo-print-kit:v1';
export const MAX_FILE = 2 * 1024 * 1024;
const assert: (condition: unknown, message: string) => asserts condition = (
  c,
  m,
) => {
  if (!c) throw new Error(m);
};
export const chars = (s: string) => Array.from(s).length;
export function normalize(text: string) {
  assert(
    text.length <= 250000,
    'Word input is too large. Use at most 500 entries of 80 characters.',
  );
  const raw = text
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((s) => s.normalize('NFC').trim())
    .filter(Boolean);
  const unique = [...new Set(raw)];
  assert(unique.length <= 500, 'Use at most 500 distinct words.');
  for (const word of unique) {
    assert(
      chars(word) <= 80,
      `Entry “${word.slice(0, 30)}…” exceeds 80 characters.`,
    );
    assert(
      !/[\u0000-\u001f\u007f]/.test(word),
      'Entries cannot contain control characters.',
    );
  }
  return { texts: unique, removed: raw.length - unique.length };
}
export function shuffle<T>(
  input: readonly T[],
  rng: () => number = Math.random,
): T[] {
  const out = [...input];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
export function generate(
  d: Draft,
  print: Print,
  rng = Math.random,
  id = crypto.randomUUID().replaceAll('-', '').slice(0, 8).toUpperCase(),
): Project {
  const title = d.title.normalize('NFC').trim();
  assert(
    title.length > 0 &&
      chars(title) <= 80 &&
      !/[\u0000-\u001f\u007f]/.test(title),
    'Enter a title of 1–80 characters, without control characters.',
  );
  assert(d.size === 3 || d.size === 5, 'Choose a 3 × 3 or 5 × 5 grid.');
  assert(typeof d.free === 'boolean', 'Choose a valid FREE setting.');
  assert(
    Number.isInteger(d.count) && d.count >= 1 && d.count <= 200,
    'Card count must be a whole number from 1 to 200.',
  );
  assert(
    d.mode === undefined || ['called', 'observed', 'people'].includes(d.mode),
    'Invalid activity mode.',
  );
  const { texts } = normalize(d.text);
  const need = d.size ** 2 - Number(d.free);
  assert(
    texts.length >= need,
    `This grid needs at least ${need} distinct words; you have ${texts.length}.`,
  );
  const words = texts.map((text, i) => ({ id: `w${i + 1}`, text }));
  const seen = new Set<string>();
  const cards: Card[] = [];
  for (
    let attempt = 0;
    cards.length < d.count && attempt < d.count * 100;
    attempt++
  ) {
    const chosen: Cell[] = shuffle(words, rng)
      .slice(0, need)
      .map((w) => ({ kind: 'word', wordId: w.id }));
    if (d.free) chosen.splice(Math.floor(d.size ** 2 / 2), 0, { kind: 'free' });
    const signature = JSON.stringify(chosen);
    if (!seen.has(signature)) {
      seen.add(signature);
      cards.push({
        id: `${id}-${String(cards.length + 1).padStart(3, '0')}`,
        cells: chosen,
      });
    }
  }
  assert(
    cards.length === d.count,
    'Could not create enough unique layouts. Please try generating again.',
  );
  return {
    schemaVersion: 1,
    generatorVersion: '1.0',
    id,
    title,
    createdAt: new Date().toISOString(),
    templateId: d.templateId,
    mode: d.mode || 'called',
    words,
    size: d.size,
    free: d.free,
    cards,
    print,
    round: {
      number: 1,
      order: shuffle(
        words.map((w) => w.id),
        rng,
      ),
      cursor: 0,
      started: false,
    },
  };
}
export function lines(size: number): number[][] {
  return [
    ...Array.from({ length: size }, (_, r) =>
      Array.from({ length: size }, (_, c) => r * size + c),
    ),
    ...Array.from({ length: size }, (_, c) =>
      Array.from({ length: size }, (_, r) => r * size + c),
    ),
    Array.from({ length: size }, (_, i) => i * size + i),
    Array.from({ length: size }, (_, i) => (i + 1) * (size - 1)),
  ];
}
export function checkCard(p: Project, id: string) {
  const card = p.cards.find((c) => c.id === id.trim().toUpperCase());
  assert(
    card,
    `Card not found in this project. Enter a full ID such as ${p.cards[0].id}.`,
  );
  const called = new Set(p.round.order.slice(0, p.round.cursor));
  const hits = card.cells.map((c) => c.kind === 'free' || called.has(c.wordId));
  const complete = lines(p.size).filter((line) => line.every((i) => hits[i]));
  return { card, hits, complete, winning: new Set(complete.flat()) };
}
export function advance(p: Project, delta: number): Project {
  const cursor = Math.max(0, Math.min(p.words.length, p.round.cursor + delta));
  return {
    ...p,
    round: {
      ...p.round,
      cursor,
      started: !!p.round.started || p.round.cursor > 0 || cursor > 0,
    },
  };
}
export function newRound(p: Project): Project {
  return {
    ...p,
    round: {
      number: p.round.number + 1,
      order: shuffle(p.words.map((w) => w.id)),
      cursor: 0,
      started: false,
    },
  };
}
export function parseProject(text: string): Project {
  assert(
    new TextEncoder().encode(text).length <= MAX_FILE,
    'Project files must be at most 2 MB.',
  );
  let p: any;
  try {
    p = JSON.parse(text);
  } catch {
    throw new Error(
      'This file is not valid JSON. Your current project has not changed.',
    );
  }
  assert(
    p && p.schemaVersion === 1 && p.generatorVersion === '1.0',
    'Unsupported project version. Use a Bingo Card Kit v1 project.',
  );
  assert(
    typeof p.id === 'string' && /^[A-F0-9]{8}$/.test(p.id),
    'Invalid project ID.',
  );
  assert(
    typeof p.title === 'string' &&
      chars(p.title) > 0 &&
      chars(p.title) <= 80 &&
      p.title === p.title.normalize('NFC').trim() &&
      !/[\u0000-\u001f\u007f]/.test(p.title),
    'Invalid project title.',
  );
  assert(
    typeof p.createdAt === 'string' &&
      p.createdAt.length <= 40 &&
      Number.isFinite(Date.parse(p.createdAt)),
    'Invalid creation date.',
  );
  assert(
    p.templateId === undefined ||
      (typeof p.templateId === 'string' && p.templateId.length <= 100),
    'Invalid template ID.',
  );
  assert(
    (p.size === 3 || p.size === 5) && typeof p.free === 'boolean',
    'Invalid grid settings.',
  );
  assert(
    Array.isArray(p.words) &&
      p.words.length >= p.size ** 2 - Number(p.free) &&
      p.words.length <= 500,
    'Invalid word pool size.',
  );
  const ids = new Set<string>();
  const texts = new Set<string>();
  for (const w of p.words) {
    assert(
      w &&
        typeof w.id === 'string' &&
        /^w[1-9][0-9]{0,2}$/.test(w.id) &&
        !ids.has(w.id),
      'Invalid or duplicate word ID.',
    );
    assert(
      typeof w.text === 'string' &&
        chars(w.text) >= 1 &&
        chars(w.text) <= 80 &&
        w.text === w.text.normalize('NFC').trim() &&
        !/[\u0000-\u001f\u007f]/.test(w.text) &&
        !texts.has(w.text),
      'Invalid or duplicate word text.',
    );
    ids.add(w.id);
    texts.add(w.text);
  }
  assert(
    Array.isArray(p.cards) && p.cards.length >= 1 && p.cards.length <= 200,
    'Invalid card count.',
  );
  const layouts = new Set<string>();
  for (const [i, c] of p.cards.entries()) {
    assert(
      c && c.id === `${p.id}-${String(i + 1).padStart(3, '0')}`,
      'Invalid, duplicate, or out-of-order card ID.',
    );
    assert(
      Array.isArray(c.cells) && c.cells.length === p.size ** 2,
      'Invalid card dimensions.',
    );
    const used = new Set<string>();
    for (const [j, cell] of c.cells.entries()) {
      assert(cell && typeof cell === 'object', 'Invalid cell.');
      if (p.free && j === Math.floor(p.size ** 2 / 2))
        assert(
          cell.kind === 'free' && cell.wordId === undefined,
          'FREE must be in the center.',
        );
      else {
        assert(
          cell.kind === 'word' &&
            ids.has(cell.wordId) &&
            !used.has(cell.wordId),
          'Invalid, duplicate, or unknown card word.',
        );
        used.add(cell.wordId);
      }
    }
    const sig = c.cells
      .map((cell: Cell) => (cell.kind === 'free' ? '*' : cell.wordId))
      .join('|');
    assert(!layouts.has(sig), 'Duplicate card layout.');
    layouts.add(sig);
  }
  assert(
    p.print &&
      ['A4', 'Letter'].includes(p.print.paper) &&
      [1, 2, 4].includes(p.print.perPage) &&
      ['ink', 'sage', 'plum'].includes(p.print.theme),
    'Invalid print settings.',
  );
  assert(
    p.round &&
      Number.isSafeInteger(p.round.number) &&
      p.round.number >= 1 &&
      Array.isArray(p.round.order) &&
      p.round.order.length === ids.size &&
      new Set(p.round.order).size === ids.size &&
      p.round.order.every((id: unknown) => ids.has(id as string)) &&
      Number.isInteger(p.round.cursor) &&
      p.round.cursor >= 0 &&
      p.round.cursor <= ids.size,
    'Invalid calling order or progress.',
  );
  assert(
    p.round.started === undefined || typeof p.round.started === 'boolean',
    'Invalid round started flag.',
  );
  assert(
    p.mode === undefined || ['called', 'observed', 'people'].includes(p.mode),
    'Invalid activity mode.',
  );
  // Return only known fields, never persist arbitrary imported properties.
  return {
    schemaVersion: 1,
    generatorVersion: '1.0',
    id: p.id,
    title: p.title,
    createdAt: p.createdAt,
    templateId: p.templateId,
    mode: p.mode || 'called',
    size: p.size,
    free: p.free,
    words: p.words.map((w: Word) => ({ id: w.id, text: w.text })),
    cards: p.cards.map((c: Card) => ({
      id: c.id,
      cells: c.cells.map((cell) =>
        cell.kind === 'free'
          ? { kind: 'free' }
          : { kind: 'word', wordId: cell.wordId },
      ),
    })),
    print: {
      paper: p.print.paper,
      perPage: p.print.perPage,
      theme: p.print.theme,
    },
    round: {
      number: p.round.number,
      order: [...p.round.order],
      cursor: p.round.cursor,
      started: p.round.started === true || p.round.cursor > 0,
    },
  };
}
export function draftOf(p: Project): Draft {
  return {
    title: p.title,
    text: p.words.map((w) => w.text).join('\n'),
    size: p.size,
    free: p.free,
    count: p.cards.length,
    templateId: p.templateId,
    mode: p.mode || 'called',
  };
}
