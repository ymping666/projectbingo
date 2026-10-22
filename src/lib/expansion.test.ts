import { expect, it } from 'vitest';
import {
  templates,
  allPresets,
  activityPresets,
  templateDraft,
} from './templates';
import { generate, parseProject, draftOf } from './model';
import { startCaller, moveCaller, parseCaller } from './caller';
import { publicPaths, templateIds, presetIds } from './routes';
import { safeParameters, safePageLocation } from './analytics';
const print = { paper: 'A4', perPage: 1, theme: 'ink' } as const;
it('publishes 50 distinct routes with all templates and presets in the safe registry', () => {
  expect(publicPaths).toHaveLength(50);
  expect(new Set(publicPaths).size).toBe(50);
  expect(templateIds).toEqual(templates.map((t) => t.id));
  expect(presetIds).toEqual(allPresets.map((t) => t.id));
  for (const path of publicPaths)
    expect(safePageLocation(path + '?secret=content')).toBe(
      'https://bingocardkit.com' + path,
    );
  for (const t of allPresets)
    expect(safeParameters({ templateId: t.id })).toEqual({ template_id: t.id });
});
it('preserves legacy projects as called and round-trips both new modes', () => {
  const p = generate({ ...templateDraft(templates[0]), count: 2 }, print);
  delete p.mode;
  expect(parseProject(JSON.stringify(p)).mode).toBe('called');
  for (const t of activityPresets) {
    const p = generate({ ...templateDraft(t), count: 2 }, print);
    const restored = parseProject(JSON.stringify(p));
    expect(restored.cards).toEqual(p.cards);
    expect(restored.mode).toBe(t.mode);
    expect(draftOf(restored).mode).toBe(t.mode);
  }
  expect(() =>
    parseProject(JSON.stringify({ ...p, mode: 'private-data' })),
  ).toThrow('Invalid activity mode');
});
it('checks complete Dolch group sizes and curated phonics boundaries', () => {
  const get = (id: string) => templates.find((t) => t.id === id)!;
  expect(get('kindergarten-sight-word-bingo').words).toHaveLength(52);
  expect(get('first-grade-sight-word-bingo').words).toHaveLength(41);
  expect(get('second-grade-sight-word-bingo').words).toHaveLength(46);
  for (const w of get('cvc-word-bingo').words)
    expect(w).toMatch(
      /^[bcdfghjklmnpqrstvwxyz][aeiou][bcdfghjklmnpqrstvwxyz]$/,
    );
  for (const w of get('consonant-blends-bingo').words)
    expect(w).toMatch(/^(fl|cl|gl|pl|sl|st|sp|sn|sw|fr|gr|dr|tr)/);
  for (const w of get('consonant-digraph-bingo').words)
    expect(w).toMatch(/sh|ch|th/);
  for (const t of allPresets) {
    expect(new Set(t.words).size).toBe(t.words.length);
    expect(() =>
      generate({ ...templateDraft(t), count: 2 }, print),
    ).not.toThrow();
  }
});
it('calls 30 words once, undoes in order, restores and reshuffles only on restart', () => {
  const words = Array.from({ length: 30 }, (_, i) => `Word ${i + 1}`);
  let c = startCaller(words.concat(words[0]).join('\n'));
  expect(c.order).toHaveLength(30);
  const order = [...c.order];
  c = moveCaller(c, 1);
  const first = c.order[c.cursor - 1];
  c = moveCaller(c, -1);
  c = moveCaller(c, 1);
  expect(c.order[c.cursor - 1]).toBe(first);
  c = parseCaller(JSON.stringify(c));
  expect(c.order).toEqual(order);
  for (let i = 0; i < 40; i++) c = moveCaller(c, 1);
  expect(c.cursor).toBe(30);
  expect(new Set(c.order.slice(0, c.cursor)).size).toBe(30);
  const restart = startCaller(c.order.join('\n'));
  expect(restart.cursor).toBe(0);
  expect(new Set(restart.order)).toEqual(new Set(order));
  expect(() =>
    parseCaller(JSON.stringify({ order: ['a', 'a'], cursor: 0 })),
  ).toThrow();
});
