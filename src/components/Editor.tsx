import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Download,
  SlidersHorizontal,
  Sparkles,
  Printer,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import {
  normalize,
  generate,
  draftOf,
  type Project,
  type Draft,
  type Print,
} from '../lib/model';
import { templates, templateDraft } from '../lib/templates';
import { track } from '../lib/config';
import { CardView, ProjectTools, Notice, useProject, download } from './shared';
import { HostSession } from './Host';
export default function Editor({ initial }: { initial: Project }) {
  const { project, setProject, ready, save } = useProject(initial);
  const p = project!;
  const [draft, setDraft] = useState<Draft>(draftOf(initial)),
    [index, setIndex] = useState(0),
    [message, setMessage] = useState(''),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(''),
    [progress, setProgress] = useState(0),
    [hosting, setHosting] = useState(false);
  useEffect(() => {
    if (!ready) return;
    const t = templates.find(
      (t) => t.id === new URLSearchParams(location.search).get('template'),
    );
    setDraft(t ? templateDraft(t) : draftOf(p));
    setIndex(0);
  }, [ready]);
  const imported = (next: Project) => {
    setProject(next);
    setDraft(draftOf(next));
    setIndex(0);
    setError('');
    track('project_import_success', {
      size: next.size,
      count: next.cards.length,
    });
  };
  let count = 0,
    duplicates = 0,
    wordError = '';
  try {
    const n = normalize(draft.text);
    count = n.texts.length;
    duplicates = n.removed;
  } catch (e) {
    wordError = (e as Error).message;
  }
  const dirty =
    JSON.stringify({ ...draft, templateId: undefined }) !==
    JSON.stringify({ ...draftOf(p), templateId: undefined });
  const update = <K extends keyof Draft>(k: K, v: Draft[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));
  async function make() {
    setError('');
    setMessage('');
    try {
      if (
        dirty &&
        !window.confirm(
          'Generate a new project? Previously printed cards belong to the old project. Save its JSON first if you need it.',
        )
      )
        return;
      setBusy('Generating cards');
      await new Promise((r) => setTimeout(r, 20));
      const next = generate(draft, p.print);
      setProject(next);
      setDraft(draftOf(next));
      setIndex(0);
      setMessage(
        `Created ${next.cards.length} distinct card layouts. Project ${next.id}.`,
      );
      track('generation_success', {
        templateId: draft.templateId,
        size: next.size,
        count: next.cards.length,
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy('');
    }
  }
  async function pdf(pack: boolean) {
    setError('');
    setMessage('');
    setBusy(pack ? 'Making game pack' : 'Making card PDF');
    setProgress(0);
    try {
      const { exportPdf } = await import('../lib/pdf');
      const result = await exportPdf(p, pack, undefined, setProgress);
      download(
        result.bytes as BlobPart,
        `bingo-${p.id}-${pack ? 'game-pack' : 'cards'}.pdf`,
        'application/pdf',
      );
      setMessage(
        `PDF ready: ${result.cardPages} card pages${pack ? ` + ${result.extraPages} caller and rules pages` : ''}. Print at Actual size / 100%.`,
      );
      track('export_success', { size: p.size, count: p.cards.length });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy('');
    }
  }
  const print = <K extends keyof Print>(key: K, value: Print[K]) =>
    setProject({ ...p, print: { ...p.print, [key]: value } });
  if (hosting)
    return (
      <div className="inline-host">
        <div className="inline-host-heading">
          <button className="text-button" onClick={() => setHosting(false)}>
            <ChevronLeft size={16} /> Back to card maker
          </button>
          <h2>Host this activity</h2>
        </div>
        <HostSession project={p} setProject={setProject} save={save} />
      </div>
    );
  return (
    <section
      className="workspace"
      aria-label="Bingo card generator"
      aria-busy={!!busy}
    >
      <div className="editor-panel">
        <div className="panel-heading">
          <span className="step-badge">1</span>
          <h2>Make it your own</h2>
          <span className="small-pill">TEXT BINGO</span>
        </div>
        <div className="editor-body">
          <label htmlFor="template">
            Start with a template{' '}
            <span className="optional">or add your own words</span>
          </label>
          <select
            id="template"
            value={draft.templateId || ''}
            onChange={(e) => {
              const t = templates.find((t) => t.id === e.target.value);
              if (t) setDraft(templateDraft(t));
              else setDraft({ ...draft, templateId: undefined });
            }}
          >
            <option value="">Custom word list</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <label htmlFor="title">Card title</label>
          <input
            id="title"
            maxLength={80}
            value={draft.title}
            onChange={(e) => update('title', e.target.value)}
          />
          <div className="label-row">
            <label htmlFor="words">Your words</label>
            <span className="word-count">{count} / 500 words</span>
          </div>
          <textarea
            id="words"
            rows={7}
            value={draft.text}
            onChange={(e) => {
              update('text', e.target.value);
              update('templateId', undefined);
            }}
            spellCheck={false}
            aria-describedby="word-help"
          />
          <p className="field-help" id="word-help">
            One word or phrase per line. Up to 80 characters each.
            {duplicates > 0 &&
              ` ${duplicates} duplicate ${duplicates === 1 ? 'entry' : 'entries'} will be removed.`}
          </p>
          {wordError && <Notice error>{wordError}</Notice>}
          <div className="form-row">
            <fieldset>
              <legend>Grid size</legend>
              <div className="segmented">
                {([3, 5] as const).map((size) => (
                  <button
                    key={size}
                    aria-pressed={draft.size === size}
                    onClick={() => update('size', size)}
                  >
                    {size} × {size}
                  </button>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="count">Number of cards</label>
              <input
                id="count"
                type="number"
                min={1}
                max={200}
                step={1}
                value={Number.isNaN(draft.count) ? '' : draft.count}
                onChange={(e) => update('count', e.target.valueAsNumber)}
              />
            </div>
          </div>
          <label className="check-label">
            <input
              type="checkbox"
              checked={draft.free}
              onChange={(e) => update('free', e.target.checked)}
            />
            <span>Free space in the center</span>
            <span className="optional">Already marked</span>
          </label>
          <div className="print-settings">
            <div className="print-label">
              <Printer size={16} /> PRINT SETUP{' '}
              <span>Applies to this card set</span>
            </div>
            <div className="form-row">
              <div>
                <label htmlFor="paper">Paper size</label>
                <select
                  id="paper"
                  value={p.print.paper}
                  disabled={!ready}
                  onChange={(e) =>
                    print('paper', e.target.value as Print['paper'])
                  }
                >
                  <option value="A4">A4</option>
                  <option value="Letter">US Letter</option>
                </select>
              </div>
              <div>
                <label htmlFor="per-page">Cards per page</label>
                <select
                  id="per-page"
                  value={p.print.perPage}
                  disabled={!ready}
                  onChange={(e) =>
                    print('perPage', Number(e.target.value) as Print['perPage'])
                  }
                >
                  {[1, 2, 4].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'card' : 'cards'} per page
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <details>
              <summary>
                <SlidersHorizontal size={14} /> Appearance
              </summary>
              <label htmlFor="theme">Print color</label>
              <select
                id="theme"
                value={p.print.theme}
                disabled={!ready}
                onChange={(e) =>
                  print('theme', e.target.value as Print['theme'])
                }
              >
                <option value="ink">Ink saver · Black & white</option>
                <option value="sage">Sage green</option>
                <option value="plum">Soft plum</option>
              </select>
            </details>
          </div>
          <button
            className="button primary generate"
            disabled={!!busy || !ready}
            onClick={() => void make()}
          >
            <Sparkles size={18} />
            {busy === 'Generating cards'
              ? 'Generating…'
              : dirty
                ? 'Generate new card set'
                : 'Generate cards'}
            <ArrowRight size={18} />
          </button>
          <p className="under-button">
            {dirty
              ? 'Content changed. Generate to apply it to a new project.'
              : 'Different layouts. One shared activity. Ready to print.'}
          </p>
        </div>
      </div>
      <div className="preview-panel">
        <div className="panel-heading">
          <span className="step-badge purple">2</span>
          <h2>Your cards, ready to go</h2>
          <span className="live-label">
            <i /> LIVE PREVIEW
          </span>
        </div>
        <div className="preview-stage">
          <div className="preview-topline">
            <span>
              <span className="status-dot" /> {p.cards.length} unique layouts
            </span>
            <span>
              {p.size} × {p.size} · {p.free ? 'FREE center' : 'No free space'}
            </span>
          </div>
          <div className="paper-stack">
            <CardView
              project={p}
              card={p.cards[Math.min(index, p.cards.length - 1)]}
            />
          </div>
          <div className="preview-pagination">
            <button
              aria-label="Previous card"
              disabled={index === 0}
              onClick={() => setIndex((i) => i - 1)}
            >
              <ChevronLeft size={18} />
            </button>
            <label>
              Card{' '}
              <input
                aria-label="Preview card number"
                type="number"
                min={1}
                max={p.cards.length}
                value={index + 1}
                onChange={(e) =>
                  setIndex(
                    Math.max(
                      0,
                      Math.min(
                        p.cards.length - 1,
                        (Number(e.target.value) || 1) - 1,
                      ),
                    ),
                  )
                }
              />{' '}
              of {p.cards.length}
            </label>
            <button
              aria-label="Next card"
              disabled={index === p.cards.length - 1}
              onClick={() => setIndex((i) => i + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="export-area">
          <div className="export-heading">
            <div>
              <h3>Let’s get playing.</h3>
              <p>
                {Math.ceil(p.cards.length / p.print.perPage)} card pages ·{' '}
                {p.print.paper} · Portrait
              </p>
            </div>
            <span className="pdf-badge">PDF</span>
          </div>
          <button
            className="button dark"
            disabled={!!busy || !ready}
            onClick={() => void pdf(true)}
          >
            <Download size={18} />
            {busy && busy !== 'Generating cards'
              ? `${busy}… ${progress}%`
              : 'Download game pack'}
            <ArrowRight size={18} />
          </button>
          <p className="pack-description">
            Your cards + caller word list + quick rules
          </p>
          <div className="secondary-actions">
            <button disabled={!!busy || !ready} onClick={() => void pdf(false)}>
              Download cards only <Download size={14} />
            </button>
            <a
              href="/host/"
              onClick={(e) => {
                e.preventDefault();
                setHosting(true);
                track('host_start', { size: p.size, count: p.cards.length });
              }}
            >
              Start hosting <ExternalLink size={14} />
            </a>
          </div>
          <p className="print-tip">
            Print at Actual size (100%).{' '}
            <a href="/printing-guide/">Printing tips ↗</a>
          </p>
        </div>
        <div className="local-bar">
          <ShieldCheck size={15} />
          <span>{ready ? save : 'Loading saved activity…'}</span>
          <ProjectTools
            project={p}
            onImport={imported}
            onMessage={(s) => {
              setMessage(s);
              setError('');
            }}
          />
        </div>
      </div>
      <div className="workspace-notices">
        {error && <Notice error>{error}</Notice>}
        {message && <Notice>{message}</Notice>}
        {dirty && (
          <p className="draft-warning">
            Preview, downloads, and hosting use project <strong>{p.id}</strong>{' '}
            until you generate your edited words.
          </p>
        )}
      </div>
    </section>
  );
}
