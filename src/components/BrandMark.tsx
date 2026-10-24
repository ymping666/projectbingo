import { brandShapes, brandColors } from '../lib/card-art';
export function BrandMark({ mono = false }: { mono?: boolean }) {
  const colors = brandColors(mono);
  return (
    <svg
      viewBox="0 0 56 56"
      className="card-brand-mark"
      aria-hidden="true"
      focusable="false"
    >
      {brandShapes.map((shape, i) => (
        <path
          key={i}
          d={shape.path}
          fill={colors[shape.tone]}
          {...(shape.border ? { stroke: colors.base, strokeWidth: 3 } : {})}
        />
      ))}
    </svg>
  );
}
export function BingoHeading() {
  return (
    <div className="bingo-heading" aria-hidden="true">
      {[...'BINGO'].map((letter) => (
        <span key={letter}>{letter}</span>
      ))}
    </div>
  );
}
