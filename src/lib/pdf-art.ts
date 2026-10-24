import { rgb, type PDFPage, type PDFFont } from 'pdf-lib';
import {
  brandShapes,
  brandColors,
  cardStyle,
  roundedPath,
  cardAllowance,
} from './card-art';
import type { Print } from './model';
import { motifs } from './card-themes';

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
  templateId?: string,
) {
  const { palette, fills, motif } = cardStyle(theme, templateId);
  const step = 27,
    radius = 10;
  for (const [i, letter] of [...'BINGO'].entries()) {
    const cx = x + side / 2 + (i - 2) * step;
    const fill = fills[i];
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
      color: pdfColor(fill === palette.dark ? '#ffffff' : palette.dark),
    });
  }
  for (const sx of [x + 18, x + side - 18]) {
    for (const path of motifs[motif]) {
      page.drawSvgPath(path, {
        x: sx - 9,
        y: top - 34,
        scale: 0.75,
        borderColor: pdfColor(palette.dark),
        borderWidth: 1.3,
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
  templateId?: string,
) {
  const { palette } = cardStyle(theme, templateId);
  if (theme !== 'ink')
    page.drawSvgPath(roundedPath(0, 0, side + 16, 60, 9), {
      x: x - 8,
      y: top + 5,
      color: pdfColor(palette.light),
    });
  page.drawSvgPath(roundedPath(0, 0, side + 16, side + cardAllowance + 5, 9), {
    x: x - 8,
    y: top + 5,
    borderColor: pdfColor(palette.line),
    borderWidth: 0.6,
  });
}
