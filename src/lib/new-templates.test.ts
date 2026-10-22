import { expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { templates, templateDraft } from './templates';
import { generate, normalize, parseProject, advance, checkCard } from './model';
import { blankPdf } from './blank';
import { safeParameters, safePageLocation } from './analytics';
const print = { paper: 'A4', perPage: 2, theme: 'ink' } as const;
it('uses exact independent alphabet and number pools, enforcing actual unique counts', () => {
  const t = templates.find((t) => t.id === 'alphabet-bingo')!;
  expect(templateDraft(t, 'uppercase').text).toBe(
    Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').join('\n'),
  );
  expect(templateDraft(t, 'lowercase').text).toBe(
    Array.from('abcdefghijklmnopqrstuvwxyz').join('\n'),
  );
  const n = templateDraft(
    templates.find((t) => t.id === 'numbers-1-20-bingo')!,
  );
  expect(n.size).toBe(3);
  expect(n.text.split('\n')).toEqual(
    Array.from({ length: 20 }, (_, i) => String(i + 1)),
  );
  expect(() => generate({ ...n, size: 5 }, print)).toThrow(
    '24 distinct words; you have 20',
  );
  expect(() => generate({ ...n, size: 5, free: false }, print)).toThrow(
    '25 distinct words; you have 20',
  );
  const sight = templateDraft(
    templates.find((t) => t.id === 'sight-word-bingo')!,
  );
  expect(normalize(sight.text).texts).toHaveLength(40);
  expect(() => generate({ ...sight, text: 'a\nand\na\nand' }, print)).toThrow(
    'you have 2',
  );
});
it('keeps generated new-template cards through calls and JSON restoration', () => {
  for (const t of templates.slice(10)) {
    const p = generate({ ...templateDraft(t), count: 2 }, print);
    const next = advance(p, 1);
    const restored = parseProject(JSON.stringify(next));
    expect(restored.cards).toEqual(p.cards);
    expect(restored.round.cursor).toBe(1);
    expect(checkCard(restored, restored.cards[0].id)).toBeDefined();
  }
});
it('creates independent real blank PDFs for both grids, papers and FREE options', async () => {
  for (const size of [3, 5] as const)
    for (const paper of ['A4', 'Letter'] as const)
      for (const free of [true, false]) {
        const doc = await PDFDocument.load(
          await blankPdf({ size, paper, free }),
        );
        expect(doc.getPageCount()).toBe(1);
        expect(doc.getPage(0).getWidth()).toBe(paper === 'A4' ? 595.28 : 612);
        expect(doc.getTitle()).toContain(`${size} x ${size}`);
      }
});
it('whitelists all new routes, template IDs and distinct download types without content', () => {
  for (const path of [
    '/blank-bingo-cards/',
    '/classroom-bingo/',
    ...templates.slice(10).map((t) => `/templates/${t.id}/`),
  ])
    expect(safePageLocation(path + '?private=secret')).toBe(
      'https://bingocardkit.com' + path,
    );
  expect(
    safeParameters({ exportType: 'blank', templateId: 'alphabet-bingo' }),
  ).toEqual({ export_type: 'blank', template_id: 'alphabet-bingo' });
});
