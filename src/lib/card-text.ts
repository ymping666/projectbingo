import asciiWidths from './lato-widths.json';
const widths: Record<string, number> = asciiWidths;
// Em advances from the bundled Lato font; accents use their Latin base letter.
export function longestWordEm(text: string): number {
  return (
    Math.max(
      0.8,
      ...text
        .split(/\s+/)
        .map((word) =>
          Array.from(word.normalize('NFD').replace(/\p{M}/gu, '')).reduce(
            (total, char) => total + (widths[char] ?? 0.7),
            0,
          ),
        ),
    ) * 1.04
  );
}
export function needsWordBreak(text: string): boolean {
  return text.split(/\s+/).some((word) => Array.from(word).length > 18);
}
