import { withBase } from '../lib/url';
import { useState } from 'react';
import {
  ArrowRight,
  Undo2,
  RotateCcw,
  Maximize,
  CheckCircle2,
} from 'lucide-react';
import { advance, newRound, checkCard, type Project } from '../lib/model';
import { useProject, ProjectTools, CardView, Notice } from './shared';
export default function Host() {
  const { project: p, setProject, ready, save } = useProject();
  const [message, setMessage] = useState('');
  if (!ready)
    return (
      <p className="empty-state" role="status">
        Loading your activity…
      </p>
    );
  if (!p)
    return (
      <section className="empty-state">
        <h2>Bring your cards to the table.</h2>
        <p>Create a card set first, or import your saved project JSON.</p>
        <a className="button primary" href={withBase('/')}>
          Make Bingo cards <ArrowRight size={17} />
        </a>
        <ProjectTools onImport={setProject} onMessage={setMessage} />
        {message && <Notice>{message}</Notice>}
      </section>
    );
  return <HostSession project={p} setProject={setProject} save={save} />;
}
export function HostSession({
  project: p,
  setProject,
  save,
}: {
  project: Project;
  setProject: (p: Project) => void;
  save: string;
}) {
  const [cardId, setCardId] = useState(''),
    [checked, setChecked] = useState(''),
    [error, setError] = useState(''),
    [message, setMessage] = useState('');
  const called = p.round.order.slice(0, p.round.cursor),
    words = new Map(p.words.map((w) => [w.id, w.text])),
    current = called.at(-1);
  let result;
  try {
    if (checked) result = checkCard(p, checked);
  } catch {}
  return (
    <>
      <div className="host-meta">
        <span className="small-pill">PROJECT {p.id}</span>
        <span>
          {p.title} · {p.cards.length} cards · Round {p.round.number}
        </span>
        <button
          className="text-button"
          onClick={() => {
            const action = document.fullscreenElement
              ? document.exitFullscreen()
              : document.documentElement.requestFullscreen();
            void action.catch(() =>
              setMessage('Fullscreen is unavailable in this browser.'),
            );
          }}
        >
          <Maximize size={16} /> Fullscreen
        </button>
      </div>
      <div className="host-layout">
        <section className="caller-panel">
          <div className="caller-label">
            {p.round.cursor === p.words.length
              ? 'ROUND COMPLETE'
              : current
                ? 'CURRENT WORD'
                : 'READY WHEN YOU ARE'}
          </div>
          <div className="current-word" aria-live="polite">
            {current ? words.get(current) : 'Let’s play Bingo.'}
          </div>
          <p className="caller-subtitle">
            {p.round.cursor === p.words.length
              ? 'Every word has been called. You can still verify cards.'
              : current
                ? 'Find it. Mark it. Listen for the next one.'
                : 'Give everyone a card, then call your first word.'}
          </p>
          <div className="caller-controls">
            <button
              className="button primary"
              disabled={p.round.cursor === p.words.length}
              onClick={() => setProject(advance(p, 1))}
            >
              {p.round.cursor === p.words.length
                ? 'All words called'
                : p.round.cursor === 0
                  ? 'Call first word'
                  : 'Next word'}
              <ArrowRight size={20} />
            </button>
            <button
              className="button outline"
              disabled={p.round.cursor === 0}
              onClick={() => setProject(advance(p, -1))}
            >
              <Undo2 size={18} /> Undo
            </button>
          </div>
          <div className="call-progress">
            <span>
              {p.round.cursor} of {p.words.length} words called
            </span>
            <progress value={p.round.cursor} max={p.words.length} />
          </div>
        </section>
        <section className="verify-panel">
          <div className="section-eyebrow">SOMEONE CALLED BINGO?</div>
          <h2>Check their card.</h2>
          <p>A full row, column, or diagonal counts. FREE is already marked.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setError('');
              try {
                checkCard(p, cardId);
                setChecked(cardId);
              } catch (e) {
                setChecked('');
                setError((e as Error).message);
              }
            }}
          >
            <label htmlFor="card-id">Full card ID</label>
            <div className="verify-input">
              <input
                id="card-id"
                value={cardId}
                placeholder={p.cards[0].id}
                onChange={(e) => setCardId(e.target.value)}
                maxLength={30}
              />
              <button className="button dark" type="submit">
                Check <CheckCircle2 size={17} />
              </button>
            </div>
          </form>
          {error && <Notice error>{error}</Notice>}
          {result && (
            <div className="verification-result">
              <Notice>
                {result.complete.length
                  ? `This card meets the current line rule (${result.complete.length} completed ${result.complete.length === 1 ? 'line' : 'lines'}).`
                  : 'No completed line yet, based on the words called in this round.'}
              </Notice>
              <CardView
                project={p}
                card={result.card}
                hits={result.hits}
                winning={result.winning}
              />
              <p className="field-help">
                ✓ = called or FREE. Outlined cells form complete lines. This
                check does not establish who won first.
              </p>
            </div>
          )}
        </section>
      </div>
      <section className="history-panel">
        <div className="history-heading">
          <div>
            <h2>
              Called words <span>{called.length}</span>
            </h2>
            <p>Undo restores the same word when you move forward again.</p>
          </div>
          <button
            className="text-button"
            onClick={() => {
              if (
                window.confirm(
                  'Start a new round? This clears all calls and shuffles a new calling order. Your cards stay the same.',
                )
              ) {
                setProject(newRound(p));
                setChecked('');
                setMessage('New round started. Your card set is unchanged.');
              }
            }}
          >
            <RotateCcw size={16} /> Start a new round
          </button>
        </div>
        {called.length ? (
          <ol className="called-list">
            {called.map((id, i) => (
              <li key={id}>
                <span>{i + 1}</span>
                {words.get(id)}
              </li>
            ))}
          </ol>
        ) : (
          <p className="history-empty">Your called words will appear here.</p>
        )}
      </section>
      <div className="host-save">
        <span>{save}</span>
        <ProjectTools
          project={p}
          onImport={(next) => {
            setProject(next);
            setChecked('');
            setError('');
          }}
          onMessage={setMessage}
        />
        <a href={withBase('/')}>Back to card maker ↗</a>
      </div>
      {message && <Notice>{message}</Notice>}
    </>
  );
}
