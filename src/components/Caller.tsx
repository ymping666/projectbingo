import { useEffect, useState } from 'react';
import {
  CALLER_KEY,
  startCaller,
  moveCaller,
  parseCaller,
  type Caller as Session,
} from '../lib/caller';
import { parseProject, type Project } from '../lib/model';
import { ProjectTools, Notice } from './shared';
import { HostSession } from './Host';
import { track } from '../lib/analytics';
const PROJECT_KEY = 'bingo-card-kit:caller-import:v1';
export default function Caller() {
  const [text, setText] = useState(''),
    [session, setSession] = useState<Session>(),
    [ready, setReady] = useState(false),
    [message, setMessage] = useState(''),
    [projection, setProjection] = useState(false),
    [project, setProject] = useState<Project>();
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CALLER_KEY);
      if (raw) {
        const c = parseCaller(raw);
        setSession(c);
        setText(c.order.join('\n'));
      }
      const imported = localStorage.getItem(PROJECT_KEY);
      if (imported) setProject(parseProject(imported));
    } catch {
      setMessage(
        'Saved caller session could not restore. Your card-maker project is unchanged.',
      );
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      if (session) localStorage.setItem(CALLER_KEY, JSON.stringify(session));
      if (project) localStorage.setItem(PROJECT_KEY, JSON.stringify(project));
      else localStorage.removeItem(PROJECT_KEY);
    } catch {
      setMessage(
        'Caller saving is unavailable. Keep this page open to continue.',
      );
    }
  }, [session, project, ready]);
  function start() {
    try {
      if (
        session &&
        !window.confirm(
          'Start a new calling round with these edits? This reshuffles the caller only.',
        )
      )
        return;
      setSession(startCaller(text));
      setProject(undefined);
      setMessage('Caller ready. Choose Next word.');
      track('caller_start');
    } catch (e) {
      setMessage((e as Error).message);
    }
  }
  return (
    <section
      className={projection ? 'caller-tool projection' : 'caller-tool'}
      aria-label="Independent Bingo caller"
    >
      <button
        className="button secondary"
        onClick={() => setProjection(!projection)}
      >
        {projection ? 'Exit projection view' : 'Projection / large text view'}
      </button>
      {project ? (
        <>
          <Notice>
            This imported project runs here with full card checking. The card
            maker’s saved project is unchanged. Observed and people activities
            still require manual confirmation.
          </Notice>
          <HostSession
            project={project}
            setProject={setProject}
            save="Saved separately in this caller when storage is available"
          />
          <button
            className="button secondary"
            onClick={() => {
              setProject(undefined);
              setMessage('Returned to the separate word caller.');
            }}
          >
            Return to pasted word caller
          </button>
        </>
      ) : (
        <>
          <label htmlFor="caller-words">Caller word list</label>
          <textarea
            id="caller-words"
            rows={7}
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={250000}
            aria-describedby="caller-help"
          />
          <p id="caller-help">
            One entry per line. Exact duplicates are removed; case is preserved.
            Up to 500 entries, 80 characters each. Edits apply only after Start.
          </p>
          <button className="button primary" disabled={!ready} onClick={start}>
            Start
          </button>
          <div className="caller-display" aria-live="polite">
            {session?.order[session.cursor - 1] || 'Ready to call'}
          </div>
          <div className="related-links">
            <button
              className="button primary"
              disabled={!session || session.cursor >= session.order.length}
              onClick={() => session && setSession(moveCaller(session, 1))}
            >
              Next word
            </button>
            <button
              className="button secondary"
              disabled={!session?.cursor}
              onClick={() => session && setSession(moveCaller(session, -1))}
            >
              Undo
            </button>
            <button
              className="button secondary"
              disabled={!session}
              onClick={() => {
                if (
                  session &&
                  window.confirm(
                    'Restart this pool? Calls will clear and the order will be reshuffled.',
                  )
                ) {
                  setSession(startCaller(session.order.join('\n')));
                  track('caller_start');
                }
              }}
            >
              Restart
            </button>
          </div>
          {session && (
            <>
              <p>
                {session.order.length - session.cursor} remaining ·{' '}
                {session.cursor} of {session.order.length} called
              </p>
              <h2>Called history</h2>
              <ol>
                {session.order.slice(0, session.cursor).map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ol>
              <p>
                Pasted words have no card matrices. No card checking is offered
                for this standalone pool.
              </p>
            </>
          )}
        </>
      )}
      {message && <p role="status">{message}</p>}
      <h2>Have a Bingo Card Kit project?</h2>
      <p>
        Import its JSON to load the exact pool, card layouts and saved calls for
        full hosting and checking here. Import is local and stored separately
        from your card-maker project. This does not reconstruct cards from a
        PDF.
      </p>
      {!project && (
        <ProjectTools
          project={project}
          onImport={(p) => {
            setProject(p);
            setMessage('Project imported into this caller.');
          }}
          onMessage={setMessage}
        />
      )}
    </section>
  );
}
