import { PDFDocument, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import type { Project } from './model';
import { withBase } from './url';
export type ExportResult = {
  bytes: Uint8Array;
  cardPages: number;
  extraPages: number;
};
const ink = rgb(0.13, 0.16, 0.16);
export function wrapText(
  text: string,
  font: PDFFont,
  size: number,
  width: number,
  breakWords = true,
): string[] {
  const lines: string[] = [];
  let current = '';
  for (const word of text.split(/\s+/)) {
    if (
      font.widthOfTextAtSize(current ? current + ' ' + word : word, size) <=
      width
    ) {
      current += (current ? ' ' : '') + word;
      continue;
    }
    if (current) {
      lines.push(current);
      current = '';
    }
    if (!breakWords) {
      current = word;
      continue;
    }
    const wordStart = lines.length;
    for (const char of word) {
      if (font.widthOfTextAtSize(current + char, size) > width) {
        if (!current)
          throw new Error(
            `Cannot fit “${text}”. Use shorter text or fewer cards per page.`,
          );
        lines.push(current);
        current = '';
      }
      current += char;
    }
    // Balance the final two fragments instead of leaving an orphan letter.
    if (lines.length > wordStart) {
      const previous = lines.pop()!;
      const joined = previous + current;
      let best = 0,
        difference = Infinity;
      for (let i = 1; i < joined.length; i++) {
        const left = font.widthOfTextAtSize(joined.slice(0, i), size);
        const right = font.widthOfTextAtSize(joined.slice(i), size);
        if (
          left <= width &&
          right <= width &&
          Math.abs(left - right) < difference
        ) {
          best = i;
          difference = Math.abs(left - right);
        }
      }
      if (best) {
        lines.push(joined.slice(0, best));
        current = joined.slice(best);
      } else lines.push(previous);
    }
  }
  if (current) lines.push(current);
  return lines;
}
function fit(
  text: string,
  font: PDFFont,
  width: number,
  height: number,
  max = 17,
) {
  for (let size = max; size >= 10; size -= 0.5) {
    const lines = wrapText(text, font, size, width, false);
    if (
      lines.every((line) => font.widthOfTextAtSize(line, size) <= width) &&
      lines.length * size * 1.2 <= height
    )
      return { lines, size };
  }
  const lines = wrapText(text, font, 10, width, true);
  if (lines.length * 12 <= height) return { lines, size: 10 };
  throw new Error(
    `“${text}” will not fit at 10 pt. Shorten this text or choose fewer cards per page.`,
  );
}
function centered(
  page: PDFPage,
  font: PDFFont,
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
  max = 17,
) {
  const { lines, size } = fit(text, font, width - 12, height - 6, max);
  const start = y + height / 2 + (lines.length - 1) * size * 0.6 - size * 0.35;
  lines.forEach((line, i) =>
    page.drawText(line, {
      x: x + (width - font.widthOfTextAtSize(line, size)) / 2,
      y: start - i * size * 1.2,
      size,
      font,
      color: ink,
    }),
  );
}
const breathe = () => new Promise<void>((resolve) => setTimeout(resolve, 0));
export async function exportPdf(
  p: Project,
  pack: boolean,
  fontBytes?: Uint8Array,
  progress: (done: number) => void = () => {},
): Promise<ExportResult> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  if (!fontBytes) {
    const response = await fetch(withBase('/fonts/Lato-Regular.ttf'));
    if (!response.ok)
      throw new Error('The local PDF font could not load. Please try again.');
    fontBytes = new Uint8Array(await response.arrayBuffer());
  }
  const font = await doc.embedFont(fontBytes, { subset: true });
  const supported = new Set(font.getCharacterSet());
  for (const text of [p.title, ...p.words.map((w) => w.text)]) {
    const missing = [...text].filter((c) => !supported.has(c.codePointAt(0)!));
    if (missing.length)
      throw new Error(
        `The PDF font cannot display ${[...new Set(missing)].map((c) => `“${c}” (U+${c.codePointAt(0)!.toString(16).toUpperCase()})`).join(', ')} in “${text}”. Use supported Latin text.`,
      );
  }
  doc.setTitle(p.title);
  doc.setAuthor('Bingo Print Kit');
  doc.setSubject(`Project ${p.id} • ${p.cards.length} cards`);
  const [pw, ph] = p.print.paper === 'A4' ? [595.28, 841.89] : [612, 792];
  const margin = 36,
    gap = 18,
    cols = p.print.perPage === 4 ? 2 : 1,
    rows = p.print.perPage === 1 ? 1 : 2;
  const areaW = (pw - margin * 2 - gap * (cols - 1)) / cols,
    areaH = (ph - margin * 2 - 16 - gap * (rows - 1)) / rows;
  const side = Math.min(areaW, areaH - 62);
  const wordMap = new Map(p.words.map((w) => [w.id, w.text]));
  const accent =
    p.print.theme === 'sage'
      ? rgb(0.86, 0.92, 0.87)
      : p.print.theme === 'plum'
        ? rgb(0.92, 0.87, 0.95)
        : rgb(0.95, 0.95, 0.95);
  let page: PDFPage | undefined;
  const cardPages = Math.ceil(p.cards.length / p.print.perPage);
  for (let i = 0; i < p.cards.length; i++) {
    const slot = i % p.print.perPage;
    if (slot === 0) {
      page = doc.addPage([pw, ph]);
      page.drawText(
        `Bingo Print Kit  /  ${p.id}  /  Cards ${Math.floor(i / p.print.perPage) + 1} of ${cardPages}`,
        { x: margin, y: 19, size: 10, font, color: ink },
      );
    }
    const column = slot % cols,
      row = Math.floor(slot / cols),
      x = margin + column * (areaW + gap) + (areaW - side) / 2,
      top = ph - margin - row * (areaH + gap);
    centered(page!, font, p.title, x, top - 32, side, 32, 16);
    centered(page!, font, `Card ${p.cards[i].id}`, x, top - 51, side, 19, 10);
    const cell = side / p.size,
      gridTop = top - 60;
    for (let j = 0; j < p.size ** 2; j++) {
      const c = p.cards[i].cells[j],
        cx = x + (j % p.size) * cell,
        cy = gridTop - (Math.floor(j / p.size) + 1) * cell;
      page!.drawRectangle({
        x: cx,
        y: cy,
        width: cell,
        height: cell,
        color: c.kind === 'free' ? accent : rgb(1, 1, 1),
        borderColor: ink,
        borderWidth: 0.6,
      });
      centered(
        page!,
        font,
        c.kind === 'free' ? 'FREE' : wordMap.get(c.wordId)!,
        cx,
        cy,
        cell,
        cell,
        p.size === 3 ? 19 : 16,
      );
    }
    progress(Math.round(((i + 1) / p.cards.length) * 90));
    if (i % 8 === 7) await breathe();
  }
  if (pack) {
    let caller = doc.addPage([pw, ph]),
      y = ph - margin;
    const heading = (text: string) => {
      caller.drawText(text, {
        x: margin,
        y: y - 18,
        size: 18,
        font,
        color: ink,
      });
      y -= 39;
    };
    heading('Caller word list');
    caller.drawText(`Project ${p.id}  /  ${p.words.length} words`, {
      x: margin,
      y: y - 10,
      size: 10,
      font,
      color: ink,
    });
    y -= 30;
    for (let i = 0; i < p.words.length; i++) {
      const lines = wrapText(
        `${i + 1}.  ${p.words[i].text}`,
        font,
        11,
        pw - margin * 2 - 24,
      );
      const h = lines.length * 15 + 8;
      if (y - h < margin) {
        caller = doc.addPage([pw, ph]);
        y = ph - margin;
        heading('Caller word list (continued)');
      }
      caller.drawRectangle({
        x: margin,
        y: y - 12,
        width: 8,
        height: 8,
        borderWidth: 0.6,
        borderColor: ink,
      });
      lines.forEach((line, j) =>
        caller.drawText(line, {
          x: margin + 20,
          y: y - 11 - j * 15,
          size: 11,
          font,
          color: ink,
        }),
      );
      y -= h;
    }
    const rules = doc.addPage([pw, ph]);
    y = ph - margin;
    const paragraphs = [
      `How to play: ${p.title}`,
      `Project ${p.id}. These instructions belong to this exact set of ${p.cards.length} cards.`,
      '1. Give every player a card and something to mark it with. Keep the full card ID visible.',
      '2. Open this project in the web host, or call words from the printed list in a random order. Call each word only once per round.',
      `3. Players mark matching words. ${p.free ? 'The center FREE space is already marked.' : 'Every space needs a matching called word.'}`,
      '4. A complete horizontal row, vertical column, or either full diagonal satisfies the Bingo rule. No full-card rule is used.',
      '5. A player who has a line can call Bingo. Enter their full card ID in the web host to check the marked cells and completed lines.',
      'Web checks use only the calls recorded in the current web round. A manual paper call is not recorded automatically. Meeting the line rule does not prove who was first, and multiple players can win together.',
      'Start a new round to clear calls and shuffle a new calling order while keeping the same cards. Save your project JSON to continue on another device.',
      'Printing: choose the matching paper size, portrait orientation, and Actual size / 100%. Turn off extra scaling. Check one sheet before printing the full batch.',
    ];
    paragraphs.forEach((text, i) => {
      const size = i === 0 ? 18 : 11;
      const lines = wrapText(text, font, size, pw - margin * 2);
      for (const line of lines) {
        rules.drawText(line, {
          x: margin,
          y: y - size,
          size,
          font,
          color: ink,
        });
        y -= size * 1.45;
      }
      y -= 14;
    });
  }
  progress(95);
  const bytes = await doc.save();
  progress(100);
  return { bytes, cardPages, extraPages: doc.getPageCount() - cardPages };
}
