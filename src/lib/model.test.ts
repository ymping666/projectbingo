import { describe, it, expect } from 'vitest';
import {
  generate,
  normalize,
  lines,
  checkCard,
  advance,
  newRound,
  parseProject,
  type Draft,
  type Project,
} from './model';
import { templates, food, templateDraft } from './templates';
const print = { paper: 'A4', perPage: 2, theme: 'ink' } as const;
const make = (extra: Partial<Draft> = {}) =>
  generate({ ...templateDraft(food), ...extra }, print);
describe('word cleanup and boundaries', () => {
  it('normalizes NFC and line endings, trims and removes exact duplicates while preserving case', () =>
    expect(normalize(' Café\r\nCafe\u0301\r\n\napple\nApple ')).toEqual({
      texts: ['Café', 'apple', 'Apple'],
      removed: 1,
    }));
  for (const size of [3, 5] as const)
    for (const free of [true, false])
      it(`${size} × ${size}, free ${free}: enforces its exact minimum`, () => {
        const n = size * size - Number(free),
          text = Array.from({ length: n }, (_, i) => `Word ${i}`).join('\n');
        expect(make({ size, free, text, count: 1 }).cards).toHaveLength(1);
        expect(() =>
          make({ size, free, text: text.split('\n').slice(1).join('\n') }),
        ).toThrow(`at least ${n}`);
      });
  it('enforces title, entry, pool, count and control-character limits', () => {
    for (const count of [0, 201, 1.5, NaN])
      expect(() => make({ count })).toThrow();
    expect(() => make({ title: 'x'.repeat(81) })).toThrow();
    expect(() => normalize('x'.repeat(81))).toThrow();
    expect(() => normalize('ab\tcd')).toThrow();
    expect(() =>
      normalize(Array.from({ length: 501 }, (_, i) => `${i}`).join('\n')),
    ).toThrow();
  });
});
describe('real card snapshots', () => {
  for (const size of [3, 5] as const)
    for (const free of [true, false])
      it(`generates 200 unique ${size} grids with FREE=${free}`, () => {
        const p = make({ size, free, count: 200 });
        expect(new Set(p.cards.map((c) => c.id)).size).toBe(200);
        expect(new Set(p.cards.map((c) => JSON.stringify(c.cells))).size).toBe(
          200,
        );
        for (const c of p.cards) {
          expect(c.cells).toHaveLength(size ** 2);
          const ids = c.cells.flatMap((c) =>
            c.kind === 'word' ? [c.wordId] : [],
          );
          expect(new Set(ids).size).toBe(ids.length);
          expect(c.cells.filter((c) => c.kind === 'free')).toHaveLength(
            Number(free),
          );
          if (free)
            expect(c.cells[Math.floor(size ** 2 / 2)].kind).toBe('free');
        }
      });
  it('treats the user word FREE as an ordinary word', () => {
    const p = make({
      size: 3,
      count: 1,
      text: 'FREE\na\nb\nc\nd\ne\nf\ng',
      free: true,
    });
    expect(p.words[0].text).toBe('FREE');
    const c = p.cards[0];
    expect(c.cells.some((c) => c.kind === 'word' && c.wordId === 'w1')).toBe(
      true,
    );
    expect(checkCard(p, c.id).hits.filter(Boolean)).toHaveLength(1);
  });
  it('bounds retries for a broken randomness source', () =>
    expect(() =>
      generate({ ...templateDraft(food), count: 2 }, print, () => 0),
    ).toThrow('Could not create'));
  it('creates a fresh project ID on regeneration', () => {
    const p = make();
    const q = make();
    expect(q.id).not.toBe(p.id);
    expect(() => checkCard(q, p.cards[0].id)).toThrow('not found');
  });
  it('keeps cards and round when print settings change', () => {
    const p = advance(make(), 6),
      before = JSON.stringify(p);
    const q = {
      ...p,
      print: { paper: 'Letter', perPage: 4, theme: 'sage' } as const,
    };
    expect(q.cards).toBe(p.cards);
    expect(q.round).toBe(p.round);
    expect(JSON.stringify(p)).toBe(before);
    expect(parseProject(JSON.stringify(q))).toEqual(q);
  });
});
describe('explicit line checks', () => {
  for (const size of [3, 5] as const)
    for (const free of [true, false])
      it(`checks every row, column, both diagonals and each one-short case (${size},${free})`, () => {
        const p = make({ size, free, count: 1 });
        const c = p.cards[0];
        for (const line of lines(size)) {
          const target = line.flatMap((i) => {
            const cell = c.cells[i];
            return cell.kind === 'word' ? [cell.wordId] : [];
          });
          const rest = p.round.order.filter((id) => !target.includes(id));
          const q = {
            ...p,
            round: {
              ...p.round,
              order: [...target, ...rest],
              cursor: target.length,
            },
          };
          expect(checkCard(q, c.id).complete).toContainEqual(line);
          for (let k = 0; k < target.length; k++) {
            const other = target.filter((_, i) => i !== k);
            const short = {
              ...q,
              round: {
                ...q.round,
                order: [...other, target[k], ...rest],
                cursor: other.length,
              },
            };
            expect(checkCard(short, c.id).complete).toHaveLength(0);
          }
        }
      });
});
describe('round persistence', () => {
  it('never repeats calls, and undo/next, refresh, import preserve order', () => {
    let p = make();
    const order = [...p.round.order];
    expect(new Set(order).size).toBe(p.words.length);
    p = advance(p, 13);
    const round = JSON.stringify(p.round);
    p = advance(advance(p, -1), 1);
    expect(JSON.stringify(p.round)).toBe(round);
    const restored = parseProject(JSON.stringify(p));
    expect(restored.round).toEqual(p.round);
    expect(advance(restored, 1).round.order[13]).toBe(order[13]);
    expect(advance(p, 1000).round.cursor).toBe(50);
    expect(advance(p, -1000).round.cursor).toBe(0);
    const fresh = newRound(p);
    expect(fresh.cards).toBe(p.cards);
    expect(fresh.round.cursor).toBe(0);
    expect(fresh.round.number).toBe(2);
  });
});
describe('atomic JSON validation', () => {
  it('round-trips snapshots and removes unknown properties', () => {
    const p = make();
    expect(parseProject(JSON.stringify(p))).toEqual(p);
    expect(
      (parseProject(JSON.stringify({ ...p, attack: 'ignored' })) as any).attack,
    ).toBeUndefined();
  });
  const corruptions: ((p: any) => void)[] = [
    (p) => (p.schemaVersion = 7),
    (p) => (p.generatorVersion = '2.0'),
    (p) => (p.cards[1].id = p.cards[0].id),
    (p) => (p.cards[0].cells[0].wordId = 'missing'),
    (p) => (p.cards[0].cells[0] = p.cards[0].cells[1]),
    (p) => (p.cards[0].cells[12] = { kind: 'word', wordId: 'w1' }),
    (p) => (p.cards[0].cells[0] = { kind: 'free' }),
    (p) => (p.round.cursor = -1),
    (p) => (p.round.cursor = 51),
    (p) => (p.round.order[0] = p.round.order[1]),
    (p) => (p.print.perPage = 3),
    (p) => (p.size = 7),
    (p) => (p.words[1].text = p.words[0].text),
    (p) => (p.cards = Array(201).fill(p.cards[0])),
    (p) => (p.words[0].text = 'x'.repeat(81)),
  ];
  for (const [i, corrupt] of corruptions.entries())
    it(`rejects malformed import ${i + 1} without mutating the active project`, () => {
      const current = make(),
        snapshot = JSON.stringify(current),
        bad = JSON.parse(snapshot);
      corrupt(bad);
      expect(() => parseProject(JSON.stringify(bad))).toThrow();
      expect(JSON.stringify(current)).toBe(snapshot);
    });
  it('rejects invalid or oversized JSON', () => {
    expect(() => parseProject('{')).toThrow('not valid JSON');
    expect(() => parseProject(' '.repeat(2 * 1024 * 1024 + 1))).toThrow('2 MB');
  });
});
it('ships ten distinct useful templates and exactly 50 food words', () => {
  expect(templates).toHaveLength(10);
  expect(food.words).toHaveLength(50);
  for (const t of templates) {
    expect(new Set(t.words).size).toBe(t.words.length);
    expect(t.words.length).toBeGreaterThanOrEqual(t.size === 5 ? 30 : 12);
    expect(() => generate(templateDraft(t), print)).not.toThrow();
  }
});
