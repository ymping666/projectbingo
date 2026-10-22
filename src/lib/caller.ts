import { normalize, shuffle } from './model';
export const CALLER_KEY = 'bingo-card-kit:standalone-caller:v1';
export type Caller = { order: string[]; cursor: number };
export function startCaller(text: string): Caller {
  const { texts } = normalize(text);
  if (!texts.length)
    throw new Error('Add at least one word, up to 500 distinct entries.');
  return { order: shuffle(texts), cursor: 0 };
}
export function moveCaller(c: Caller, delta: number): Caller {
  return {
    ...c,
    cursor: Math.max(0, Math.min(c.order.length, c.cursor + delta)),
  };
}
export function parseCaller(text: string): Caller {
  const c = JSON.parse(text);
  if (
    !c ||
    !Array.isArray(c.order) ||
    !c.order.length ||
    c.order.some((s: unknown) => typeof s !== 'string') ||
    !Number.isInteger(c.cursor) ||
    c.cursor < 0 ||
    c.cursor > c.order.length
  )
    throw new Error('Invalid caller session.');
  const n = normalize(c.order.join('\n'));
  if (
    n.texts.length !== c.order.length ||
    n.texts.some((w, i) => w !== c.order[i])
  )
    throw new Error('Invalid caller words.');
  return { order: n.texts, cursor: c.cursor };
}
