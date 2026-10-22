import { withBase } from '../lib/url';
import { useEffect, useState, useRef } from 'react';
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
import { allPresets as templates, templateDraft } from '../lib/templates';
import { track, projectParameters, exportErrorCode } from '../lib/analytics';
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
    [hosting, setHosting] = useState(false),
    [downloadChoice, setDownloadChoice] = useState<boolean | null>(null);
  const operation = useRef(false),
    choiceButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (downloadChoice !== null) choiceButton.current?.focus();
  }, [downloadChoice]);
  useEffect(() => {
    if (!ready) return;
    const t = templates.find(
      (t) => t.id === new URLSearchParams(location.search).get('template'),
    );
    setDraft(
      t
        ? templateDraft(
            t,
            new URLSearchParams(location.search).get('preset') || undefined,
          )
        : draftOf(p),
    );
    setIndex(0);
  }, [ready]);
  const imported = (next: Project) => {
    setProject(next);
    setDraft(draftOf(next));
    setIndex(0);
    setError('');
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
  const confirmNew = () =>
    window.confirm(
      `Create a new activity? This replaces “${p.title}” (${p.id}), creates new card IDs, and resets the calling round. Previously printed cards still belong to the old project. Save its JSON first to keep it.`,
    );
  function createDraftSnapshot() {
    const next = generate(
      draft,
      draft.mode === 'people' && p.mode !== 'people'
        ? { ...p.print, perPage: 1 }
        : p.print,
    );
    setProject(next);
    setDraft(draftOf(next));
    setIndex(0);
    track('generation_success', projectParameters(next));
    return next;
  }
  async function make() {
    if (operation.current || !ready) return;
    setError('');
    setMessage('');
    try {
      if ((dirty || p.round.started) && !confirmNew()) return;
      operation.current = true;
      setBusy('Generating cards');
      await new Promise((r) => setTimeout(r, 20));
      const next = createDraftSnapshot();
      setMessage(
        `Created ${next.cards.length} distinct card layouts. Project ${next.id}.`,
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy('');
      operation.current = false;
    }
  }
  function pdf(pack: boolean) {
    if (operation.current || !ready) return;
    if (dirty) {
      setDownloadChoice(pack);
      return;
    }
    void downloadSet(pack, false);
  }
  async function downloadSet(pack: boolean, fresh: boolean) {
    if (operation.current || !ready) return;
    if (fresh && !confirmNew()) return;
    operation.current = true;
    setDownloadChoice(null);
    let snapshot = p,
      stage: 'export' | 'download' = 'export';
    setError('');
    setMessage('');
    setBusy(pack ? 'Making game pack' : 'Making card PDF');
    setProgress(0);
    try {
      if (fresh) {
        setBusy('Generating cards');
        await new Promise((r) => setTimeout(r, 20));
        snapshot = createDraftSnapshot();
        setBusy(pack ? 'Making game pack' : 'Making card PDF');
      }
      const { exportPdf } = await import('../lib/pdf');
      const result = await exportPdf(snapshot, pack, undefined, setProgress);
      stage = 'download';
      download(
        result.bytes as BlobPart,
        `bingo-card-kit-${snapshot.id}-${pack ? 'game-pack' : 'cards'}.pdf`,
        'application/pdf',
      );
      setMessage(
        `PDF ready: ${result.cardPages} card pages${pack ? ` + ${result.extraPages} caller and rules pages` : ''}. Print at Actual size / 100%.`,
      );
      track('export_success', {
        ...projectParameters(snapshot),
        exportType: pack ? 'game_pack' : 'cards',
      });
    } catch (e) {
      setError((e as Error).message);
      track('export_error', {
        ...projectParameters(snapshot),
        exportType: pack ? 'game_pack' : 'cards',
        errorCode: stage === 'download' ? 'download_error' : exportErrorCode(e),
      });
    } finally {
      setBusy('');
      operation.current = false;
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
              if (t) {
                setDraft(templateDraft(t));
                track('template_used', { templateId: t.id, size: t.size });
              } else setDraft({ ...draft, templateId: undefined });
            }}
          >
            <option value="">Custom word list</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          {templates.find((t) => t.id === draft.templateId)?.variants && (
            <fieldset>
              <legend>Alphabet preset (edits only)</legend>
              <div className="segmented">
                {templates
                  .find((t) => t.id === draft.templateId)!
                  .variants!.map((v) => (
                    <button
                      key={v.id}
                      onClick={() =>
                        setDraft(
                          templateDraft(
                            templates.find((t) => t.id === draft.templateId)!,
                            v.id,
                          ),
                        )
                      }
                    >
                      {v.name}
                    </button>
                  ))}
              </div>
              <p className="field-help">
                Switching edits the draft. Generate and confirm to replace the
                saved activity.
              </p>
            </fieldset>
          )}
          <label htmlFor="mode">Activity rules</label>
          <select
            id="mode"
            value={draft.mode || 'called'}
            onChange={(e) => update('mode', e.target.value as Draft['mode'])}
          >
            <option value="called">Called words</option>
            <option value="observed">Observed events</option>
            <option value="people">Find people (names on paper)</option>
          </select>
          <p className="field-help">
            {draft.mode === 'people'
              ? 'Print cards with name lines. Meet people and confirm wins manually; no names are entered here. New people activities start with one card per sheet for handwriting; change Print setup after generating if needed.'
              : draft.mode === 'observed'
                ? 'Print and mark events as they happen. The website cannot detect or verify real-world events.'
                : 'Call words from the saved activity and check card IDs.'}
          </p>
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
          {count < draft.size ** 2 - Number(draft.free) && (
            <Notice error>
              This {draft.size} × {draft.size} grid needs{' '}
              {draft.size ** 2 - Number(draft.free)} distinct entries; you have{' '}
              {count} after removing duplicates. Choose a smaller grid or add
              entries. Your selected grid has not changed.
            </Notice>
          )}
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
            <i /> {dirty ? 'EDITS NOT GENERATED' : 'GENERATED SET'}
          </span>
        </div>
        <div
          className={`snapshot-banner ${dirty ? 'has-edits' : ''}`}
          role={dirty ? 'status' : undefined}
        >
          <strong>
            {dirty
              ? 'Your edits are not in this card set yet.'
              : 'Current generated activity'}
          </strong>
          <span>
            {p.title} · {p.size} × {p.size} · {p.cards.length} cards
          </span>
          {dirty && (
            <p>
              The preview and existing downloads belong to this saved set.
              Generate a new set to apply your edited words or template.
            </p>
          )}
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
          {dirty && (
            <p className="draft-export-hint">
              You have ungenerated edits. Download will let you choose this
              saved set or generate your changes first.
            </p>
          )}
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
          {downloadChoice !== null && (
            <section
              className="download-choice"
              role="dialog"
              aria-labelledby="download-choice-title"
            >
              <h3 id="download-choice-title">Which card set would you like?</h3>
              <p>
                Current set: <strong>{p.title}</strong> · {p.size} × {p.size} ·{' '}
                {p.cards.length} cards. Your form contains changes that have not
                been generated.
              </p>
              <button
                ref={choiceButton}
                className="button outline"
                disabled={!!busy}
                onClick={() => void downloadSet(downloadChoice!, false)}
              >
                Download current card set
              </button>
              <button
                className="button primary"
                disabled={!!busy}
                onClick={() => void downloadSet(downloadChoice!, true)}
              >
                Generate new set &amp; download
              </button>
              <button
                className="text-button"
                onClick={() => setDownloadChoice(null)}
              >
                Cancel
              </button>
            </section>
          )}
          <button
            className="button dark"
            disabled={!!busy || !ready}
            onClick={() => void pdf(true)}
          >
            <Download size={18} />
            {busy && busy !== 'Generating cards'
              ? `${busy}… ${progress}%`
              : p.mode && p.mode !== 'called'
                ? 'Download activity pack'
                : 'Download game pack'}
            <ArrowRight size={18} />
          </button>
          <p className="pack-description">
            {p.mode && p.mode !== 'called'
              ? 'Your cards + activity checklist + manual rules'
              : 'Your cards + caller word list + quick rules'}
          </p>
          <div className="secondary-actions">
            <button disabled={!!busy || !ready} onClick={() => void pdf(false)}>
              Download cards only <Download size={14} />
            </button>
            {(!p.mode || p.mode === 'called') && (
              <a
                href={withBase('/host/')}
                onClick={(e) => {
                  e.preventDefault();
                  setHosting(true);
                }}
              >
                Start hosting <ExternalLink size={14} />
              </a>
            )}
          </div>
          <p className="print-tip">
            Print at Actual size (100%).{' '}
            <a href={withBase('/printing-guide/')}>Printing tips ↗</a>
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
