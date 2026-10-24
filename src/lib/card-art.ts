// Vector geometry from the existing Bingo Card Kit favicon; shared by screen and PDF.
const rounded = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`;
export const brandShapes = [
  { path: rounded(0, 0, 56, 56, 13), tone: 'base', border: false },
  ...Array.from({ length: 9 }, (_, i) => ({
    path: rounded(10 + (i % 3) * 12, 10 + Math.floor(i / 3) * 12, 12, 12, 2),
    tone: i === 4 ? 'center' : 'tile',
    border: true,
  })),
  {
    path: 'M28 24L29.2 26.8L32 28L29.2 29.2L28 32L26.8 29.2L24 28L26.8 26.8Z',
    tone: 'base',
    border: false,
  },
] as const;
export const brandColors = (mono = false): Record<string, string> =>
  mono
    ? { base: '#303633', tile: '#ffffff', center: '#e9ece8' }
    : { base: '#244b40', tile: '#edf3c8', center: '#dceaa1' };
export const printPalettes = {
  ink: {
    dark: '#303633',
    light: '#f4f5f2',
    line: '#8d9690',
    accent: '#ffffff',
    festive: false,
  },
  sage: {
    dark: '#355a48',
    light: '#edf3e6',
    line: '#9cac96',
    accent: '#dce9bc',
    festive: true,
  },
  plum: {
    dark: '#674b70',
    light: '#f5edf5',
    line: '#b5a4b8',
    accent: '#ecd5df',
    festive: true,
  },
} as const;
export const cardHeader = 58;
export const cardAllowance = 76; // Header plus one compact, readable footer row.
export const roundedPath = rounded;
