import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { drawBrandMark, drawCardHeading } from './pdf-art';
export type BlankOptions = {
  size: 3 | 5;
  paper: 'A4' | 'Letter';
  free: boolean;
};
// Blank sheets deliberately have no Project, word pool, card IDs or calling round.
export async function blankPdf(options: BlankOptions) {
  if (
    ![3, 5].includes(options.size) ||
    !['A4', 'Letter'].includes(options.paper) ||
    typeof options.free !== 'boolean'
  )
    throw new Error('Choose valid blank card settings.');
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const [width, height] =
    options.paper === 'A4' ? [595.28, 841.89] : [612, 792];
  const page = doc.addPage([width, height]);
  doc.setTitle(
    `Blank ${options.size} x ${options.size} Bingo - ${options.paper}`,
  );
  doc.setAuthor('Bingo Card Kit');
  const side = width - 72,
    top = height - 144,
    cell = side / options.size;
  const center = (text: string, y: number, size: number) =>
    page.drawText(text, {
      x: (width - font.widthOfTextAtSize(text, size)) / 2,
      y,
      size,
      font,
    });
  center('Blank Bingo', height - 60, 25);
  center('Name: ____________________', height - 86, 12);
  drawCardHeading(page, font, 36, height - 72, side, 'ink');
  for (let i = 0; i < options.size ** 2; i++) {
    const x = 36 + (i % options.size) * cell,
      y = top - (Math.floor(i / options.size) + 1) * cell;
    const free = options.free && i === Math.floor(options.size ** 2 / 2);
    page.drawRectangle({
      x,
      y,
      width: cell,
      height: cell,
      borderColor: rgb(0.15, 0.18, 0.15),
      borderWidth: 0.7,
      color: free ? rgb(0.95, 0.95, 0.95) : rgb(1, 1, 1),
    });
    if (free) {
      const mark = Math.min(56, cell * 0.52);
      drawBrandMark(
        page,
        x + (cell - mark) / 2,
        y + (cell - mark) / 2,
        mark,
        true,
      );
    }
  }
  if (options.free)
    center('Center logo = free space, already marked.', top - side - 22, 10);
  center(
    'Bingo Card Kit | Handwritten card - manual calling and checking',
    44,
    10,
  );
  center('Print at Actual size / 100%. One card per sheet.', 28, 10);
  return doc.save();
}
