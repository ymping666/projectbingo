import { rgb, type PDFPage, type PDFFont } from 'pdf-lib';
import {
  brandShapes,
  brandColors,
  printPalettes,
  roundedPath,
  cardAllowance,
} from './card-art';
import type { Print } from './model';

export const pdfColor = (hex: string) =>
  rgb(
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255,
  );
export function drawBrandMark(
  page: PDFPage,
  x: number,
  y: number,
  size: number,
  mono = false,
) {
  const colors = brandColors(mono);
  for (const shape of brandShapes)
    page.drawSvgPath(shape.path, {
      x,
      y: y + size,
      scale: size / 56,
      color: pdfColor(colors[shape.tone]),
      ...(shape.border
        ? { borderColor: pdfColor(colors.base), borderWidth: 3 }
        : {}),
    });
}
export function drawCardHeading(
  page: PDFPage,
  font: PDFFont,
  x: number,
  top: number,
  side: number,
  theme: Print['theme'],
) {
  const palette = printPalettes[theme];
  const step = 27,
    radius = 10;
  for (const [i, letter] of [...'BINGO'].entries()) {
    const cx = x + side / 2 + (i - 2) * step;
    const dark =
      theme === 'plum' ? i === 0 || i === 4 : theme === 'sage' && i % 2 === 0;
    const fill =
      theme === 'plum'
        ? ['#674b70', '#eed3df', '#e2ebc7', '#f4dfbd', '#674b70'][i]
        : dark
          ? palette.dark
          : palette.accent;
    page.drawCircle({
      x: cx,
      y: top - 43,
      size: radius,
      color: pdfColor(fill),
      borderColor: pdfColor(palette.dark),
      borderWidth: theme === 'ink' ? 0.65 : 0,
    });
    page.drawText(letter, {
      x: cx - font.widthOfTextAtSize(letter, 13) / 2,
      y: top - 47.5,
      size: 13,
      font,
      color: pdfColor(dark ? '#ffffff' : palette.dark),
    });
  }
  if (palette.festive) {
    for (const sx of [x + 15, x + side - 15]) {
      page.drawSvgPath('M0 6L4 4L6 0L8 4L12 6L8 8L6 12L4 8Z', {
        x: sx - 6,
        y: top - 37,
        color: pdfColor(palette.dark),
      });
      page.drawCircle({
        x: sx + (sx < x + side / 2 ? 12 : -12),
        y: top - 51,
        size: 1.7,
        color: pdfColor(palette.dark),
      });
    }
  }
}
export function drawCardFrame(
  page: PDFPage,
  x: number,
  top: number,
  side: number,
  theme: Print['theme'],
) {
  if (theme !== 'ink')
    page.drawSvgPath(roundedPath(0, 0, side + 16, 60, 9), {
      x: x - 8,
      y: top + 5,
      color: pdfColor(printPalettes[theme].light),
    });
  page.drawSvgPath(roundedPath(0, 0, side + 16, side + cardAllowance + 5, 9), {
    x: x - 8,
    y: top + 5,
    borderColor: pdfColor(printPalettes[theme].line),
    borderWidth: 0.6,
  });
}
