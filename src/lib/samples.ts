import { generate } from './model';
import { templateDraft, type Template } from './templates';

export const featuredIds = [
  'food-vocabulary-bingo',
  'classroom-objects-bingo',
  'christmas-bingo',
];
export function sampleProject(t: Template) {
  let seed = 173 + t.words.length;
  const rng = () =>
    (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
  const id =
    ['F00D0001', 'C1A55001', 'DEC25001'][featuredIds.indexOf(t.id)] ||
    'EAA00001';
  const p = generate(
    { ...templateDraft(t), title: `${t.name} Bingo (Sample)`, count: 2 },
    { paper: 'A4', perPage: 2, theme: 'ink' },
    rng,
    id,
  );
  p.createdAt = '2026-10-22T00:00:00.000Z';
  return p;
}
export const sampleFilename = (id: string) => `bingo-card-kit-${id}-sample.pdf`;
