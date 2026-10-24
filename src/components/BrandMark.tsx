import { brandShapes, brandColors, cardStyle } from '../lib/card-art';
import { motifs } from '../lib/card-themes';
import type { Print } from '../lib/model';
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
export function BingoHeading({
  theme = 'ink',
  templateId,
}: {
  theme?: Print['theme'];
  templateId?: string;
}) {
  const { palette, fills, motif } = cardStyle(theme, templateId);
  const ornament = (
    <svg
      className="card-ornament"
      viewBox="-1 -1 26 26"
      fill="none"
      stroke={palette.dark}
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      {motifs[motif].map((path, i) => (
        <path key={i} d={path} />
      ))}
    </svg>
  );
  return (
    <div className="bingo-heading" aria-hidden="true">
      {ornament}
      {[...'BINGO'].map((letter, i) => (
        <span
          key={letter}
          style={{
            background: fills[i],
            color: fills[i] === palette.dark ? '#ffffff' : palette.dark,
            borderColor: theme === 'ink' ? palette.dark : 'transparent',
          }}
        >
          {letter}
        </span>
      ))}
      {ornament}
    </div>
  );
}
