import { useRef, useState } from 'react';
import type { BlankOptions } from '../lib/blank';
import { download } from './shared';
import { track } from '../lib/analytics';
export default function BlankCards() {
  const [options, setOptions] = useState<BlankOptions>({
    size: 3,
    paper: 'A4',
    free: true,
  });
  const [message, setMessage] = useState(''),
    [busy, setBusy] = useState(false);
  const lock = useRef(false);
  async function save() {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setMessage('');
    try {
      const { blankPdf } = await import('../lib/blank');
      const bytes = await blankPdf(options);
      download(
        bytes as BlobPart,
        `bingo-card-kit-blank-${options.size}x${options.size}-${options.paper}-${options.free ? 'free' : 'no-free'}.pdf`,
        'application/pdf',
      );
      track('export_success', {
        size: options.size,
        paper: options.paper,
        count: 1,
        perPage: 1,
        exportType: 'blank',
      });
      setMessage(
        'Blank PDF ready. One card per sheet. Print at Actual size / 100%.',
      );
    } catch {
      setMessage('The blank PDF could not download. Please try again.');
      track('export_error', {
        exportType: 'blank',
        errorCode: 'export_failed',
      });
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <section
      className="blank-workspace"
      aria-label="Blank card options and preview"
    >
      <div className="blank-options">
        <h2>Make a handwriting sheet</h2>
        <label htmlFor="blank-grid">Grid size</label>
        <select
          id="blank-grid"
          value={options.size}
          onChange={(e) =>
            setOptions({ ...options, size: Number(e.target.value) as 3 | 5 })
          }
        >
          <option value="3">3 × 3</option>
          <option value="5">5 × 5</option>
        </select>
        <label htmlFor="blank-paper">Paper size</label>
        <select
          id="blank-paper"
          value={options.paper}
          onChange={(e) =>
            setOptions({ ...options, paper: e.target.value as 'A4' | 'Letter' })
          }
        >
          <option>A4</option>
          <option value="Letter">US Letter</option>
        </select>
        <label className="check-label">
          <input
            type="checkbox"
            checked={options.free}
            onChange={(e) => setOptions({ ...options, free: e.target.checked })}
          />{' '}
          Center FREE space
        </label>
        <p>
          One blank card per sheet. Print multiple copies for your group. These
          sheets have no digital card IDs.
        </p>
        <button className="button primary" disabled={busy} onClick={save}>
          {busy ? 'Making PDF…' : 'Download blank PDF'}
        </button>
        <p role="status">{message}</p>
        <p>Your saved activity and calling progress are unaffected.</p>
      </div>
      <div
        className="blank-sheet"
        style={{
          aspectRatio: options.paper === 'A4' ? '595.28 / 841.89' : '612 / 792',
        }}
      >
        <h2>Blank Bingo</h2>
        <p>Name: ____________________</p>
        <div
          className="blank-grid"
          style={{ gridTemplateColumns: `repeat(${options.size},1fr)` }}
        >
          {Array.from({ length: options.size ** 2 }, (_, i) => (
            <div key={i}>
              {options.free && i === Math.floor(options.size ** 2 / 2)
                ? 'FREE'
                : ''}
            </div>
          ))}
        </div>
        <small>
          Bingo Card Kit · Handwritten card
          <br />
          Manual calling and checking
        </small>
      </div>
    </section>
  );
}
