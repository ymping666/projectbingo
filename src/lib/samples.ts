import { generate } from './model';
import { templateDraft, type Template } from './templates';

export const featuredIds = [
  'food-vocabulary-bingo',
  'classroom-objects-bingo',
  'christmas-bingo',
  'sight-word-bingo',
  'alphabet-bingo',
  'numbers-1-20-bingo',
  'thanksgiving-bingo',
];
export function sampleProject(t: Template, variant?: string) {
  let seed = 173 + t.words.length;
  const rng = () =>
    (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
  const id =
    variant === 'lowercase'
      ? 'ABC00002'
      : [
          'F00D0001',
          'C1A55001',
          'DEC25001',
          '51A70001',
          'ABC00001',
          '12300001',
          '7AA00001',
        ][featuredIds.indexOf(t.id)] || 'EAA00001';
  const p = generate(
    {
      ...templateDraft(t, variant),
      title: `${t.name} Bingo${variant ? ` ${variant}` : ''} (Sample)`,
      count: 2,
    },
    { paper: 'A4', perPage: 2, theme: 'ink' },
    rng,
    id,
  );
  p.createdAt = '2026-10-22T00:00:00.000Z';
  return p;
}
export const sampleFilename = (id: string) => `bingo-card-kit-${id}-sample.pdf`;
