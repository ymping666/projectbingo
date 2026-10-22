import { readFile, mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { PDFDocument } from 'pdf-lib';
import { generate, type Print } from '../src/lib/model';
import { food, templateDraft } from '../src/lib/templates';
import { exportPdf } from '../src/lib/pdf';
const font = new Uint8Array(await readFile('public/fonts/Lato-Regular.ttf'));
await mkdir('output/pdf', { recursive: true });
for (const paper of ['A4', 'Letter'] as const)
  for (const perPage of [1, 2, 4] as const) {
    const print: Print = { paper, perPage, theme: 'ink' };
    const p = generate({ ...templateDraft(food), count: 5 }, print);
    const result = await exportPdf(p, false, font);
    const pdf = await PDFDocument.load(result.bytes);
    assert.equal(pdf.getPageCount(), Math.ceil(5 / perPage));
    assert(
      Math.abs(pdf.getPage(0).getWidth() - (paper === 'A4' ? 595.28 : 612)) <
        0.01,
    );
    await writeFile(`output/pdf/${paper}-${perPage}-cards.pdf`, result.bytes);
    await writeFile(
      `output/pdf/${paper}-${perPage}-project.json`,
      JSON.stringify(p, null, 2),
    );
    console.log(
      `${paper} / ${perPage}: ${result.cardPages} pages for 5 cards; dimensions verified`,
    );
  }
const large = generate(
  { ...templateDraft(food), count: 200 },
  { paper: 'A4', perPage: 4, theme: 'ink' },
);
const big = await exportPdf(large, false, font);
assert.equal((await PDFDocument.load(big.bytes)).getPageCount(), 50);
await writeFile('output/pdf/200-cards.pdf', big.bytes);
console.log('200 cards / 4 per page: exactly 50 player pages');
const p = generate(templateDraft(food), {
  paper: 'A4',
  perPage: 2,
  theme: 'ink',
});
const pack = await exportPdf(p, true, font);
assert.equal(pack.cardPages, 20);
assert(pack.extraPages >= 2);
await writeFile('output/pdf/bingo-test-game-pack.pdf', pack.bytes);
await writeFile(
  'output/pdf/bingo-test-project.json',
  JSON.stringify(p, null, 2),
);
const latin = generate(
  {
    ...templateDraft(food),
    title: 'Café “Bingo” — crème brûlée',
    text: [
      'Café',
      'Crème brûlée',
      'Jalapeño',
      'Piñata',
      'Ångström',
      'Œuvre',
      'Straße',
      'It’s fun',
      'A short phrase',
      ...food.words,
    ].join('\n'),
    count: 5,
  },
  { paper: 'Letter', perPage: 4, theme: 'plum' },
);
await writeFile(
  'output/pdf/latin-and-phrases.pdf',
  (await exportPdf(latin, true, font)).bytes,
);
const missing = structuredClone(latin);
missing.words[0].text = 'Smile 😀';
await assert.rejects(() => exportPdf(missing, true, font), /cannot display/);
const overflow = structuredClone(latin);
overflow.words.forEach((w) => (w.text = 'W'.repeat(80)));
await assert.rejects(() => exportPdf(overflow, false, font), /10 pt/);
console.log(
  `40-card A4 game pack: ${pack.cardPages} player + ${pack.extraPages} extra pages. Latin punctuation exports; missing glyphs and overflow reject clearly.`,
);
