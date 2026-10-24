import { PDFDocument, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import type { Project } from './model';
import { withBase } from './url';
import { config } from './config';
import { cardHeader, cardAllowance, cardStyle } from './card-art';
import {
  drawBrandMark,
  drawCardHeading,
  drawCardFrame,
  pdfColor,
} from './pdf-art';
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
  inset = 12,
) {
  const { lines, size } = fit(text, font, width - inset, height - 6, max);
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
  doc.setAuthor(config.name);
  doc.setSubject(`Project ${p.id} • ${p.cards.length} cards`);
  const [pw, ph] = p.print.paper === 'A4' ? [595.28, 841.89] : [612, 792];
  const margin = 36,
    gap = 18,
    cols = p.print.perPage === 4 ? 2 : 1,
    rows = p.print.perPage === 1 ? 1 : 2;
  const areaW = (pw - margin * 2 - gap * (cols - 1)) / cols,
    areaH = (ph - margin * 2 - 16 - gap * (rows - 1)) / rows;
  const side = Math.min(areaW, areaH - cardAllowance);
  const wordMap = new Map(p.words.map((w) => [w.id, w.text]));
  const { palette } = cardStyle(p.print.theme, p.templateId);
  const accent = pdfColor(palette.light);
  let page: PDFPage | undefined;
  const cardPages = Math.ceil(p.cards.length / p.print.perPage);
  for (let i = 0; i < p.cards.length; i++) {
    const slot = i % p.print.perPage;
    if (slot === 0) {
      page = doc.addPage([pw, ph]);
      page.drawText(
        `${config.name}  /  ${p.id}  /  Cards ${Math.floor(i / p.print.perPage) + 1} of ${cardPages}`,
        { x: margin, y: 19, size: 10, font, color: ink },
      );
    }
    const column = slot % cols,
      row = Math.floor(slot / cols),
      x = margin + column * (areaW + gap) + (areaW - side) / 2,
      top = ph - margin - row * (areaH + gap);
    drawCardFrame(page!, x, top, side, p.print.theme, p.templateId);
    centered(page!, font, p.title, x + 8, top - 32, side - 16, 32, 16);
    drawCardHeading(page!, font, x, top, side, p.print.theme, p.templateId);
    const cell = side / p.size,
      gridTop = top - cardHeader;
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
        borderColor: pdfColor(palette.line),
        borderWidth: 0.6,
      });
      const people = p.mode === 'people' && c.kind !== 'free';
      if (c.kind === 'free') {
        const mark = Math.min(44, cell * 0.52);
        drawBrandMark(
          page!,
          cx + (cell - mark) / 2,
          cy + (cell - mark) / 2,
          mark,
          p.print.theme === 'ink',
        );
      } else
        centered(
          page!,
          font,
          wordMap.get(c.wordId)!,
          cx,
          cy + (people ? cell * 0.32 : 0),
          cell,
          people ? cell * 0.68 : cell,
          p.size === 3 ? 19 : 16,
          8,
        );
      if (people) {
        page!.drawLine({
          start: { x: cx + 9, y: cy + cell * 0.16 },
          end: { x: cx + cell - 9, y: cy + cell * 0.16 },
          thickness: 0.5,
          color: ink,
        });
        page!.drawText('Name', {
          x: cx + 9,
          y: cy + cell * 0.2,
          size: 8,
          font,
          color: ink,
        });
      }
    }
    page!.drawText(`Card ${p.cards[i].id}`, {
      x,
      y: gridTop - side - 13,
      size: 10,
      font,
      color: ink,
    });
    const legend = p.free ? 'Logo starts marked' : 'Play for a line';
    page!.drawText(legend, {
      x: x + side - font.widthOfTextAtSize(legend, 10),
      y: gridTop - side - 13,
      size: 10,
      font,
      color: ink,
    });
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
    heading(
      p.mode && p.mode !== 'called' ? 'Activity checklist' : 'Caller word list',
    );
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
    const paragraphs =
      p.mode && p.mode !== 'called'
        ? [
            `How to play: ${p.title}`,
            p.mode === 'people'
              ? 'Meet people who match the prompts. Ask before writing a name on the printed line. Anyone can pass. Decide in advance whether a name may appear more than once. Do not enter names on the website.'
              : p.templateId === 'music-bingo'
                ? 'Play songs in your own music player. Agree whether a short clip or the full song counts. Players mark a song title only after hearing it. Record each played title on the activity checklist. The website does not play music, import playlists or recognize songs.'
                : 'Observe events or items during the agreed activity. Mark a matching entry only when it happens. Agree on what counts before play. The website does not detect real-world events.',
            `Give each player a card. ${p.free ? 'The center logo is your free space and starts marked.' : 'There is no free center space.'}`,
            'A full row, column or diagonal is a line. Ask the organizer to confirm a win manually. The web caller and checker do not verify these observations or personal conditions.',
            'Save the project JSON if you need the same layouts again. Print at Actual size / 100%. Use one card per sheet for generous handwriting room.',
          ]
        : [
            `How to play: ${p.title}`,
            `Project ${p.id}. These instructions belong to this exact set of ${p.cards.length} cards.`,
            '1. Give every player a card and something to mark it with. Keep the full card ID visible.',
            '2. Open this project in the web host, or call words from the printed list in a random order. Call each word only once per round.',
            `3. Players mark matching words. ${p.free ? 'The center logo is your free space and is already marked.' : 'Every space needs a matching called word.'}`,
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
