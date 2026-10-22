import { useEffect, useState } from 'react';
import {
  parseProject,
  STORAGE_KEY,
  MAX_FILE,
  type Project,
  type Card,
} from '../lib/model';
import { Download, Upload, Check, AlertCircle } from 'lucide-react';
import { config } from '../lib/config';
import { track, projectParameters } from '../lib/analytics';
import { longestWordEm, needsWordBreak } from '../lib/card-text';
export function download(data: BlobPart, name: string, type: string) {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
export function useProject(initial?: Project) {
  const [project, setP] = useState<Project | undefined>(initial),
    [ready, setReady] = useState(false),
    [save, setSave] = useState(''),
    [writable, setWritable] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setP(parseProject(raw));
        setSave('Restored from this browser');
      }
      setWritable(true);
    } catch (e) {
      setSave(
        `Local restore unavailable: ${(e as Error).message} Download JSON to keep your work.`,
      );
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready || !project || !writable) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
      setSave('Saved on this browser');
    } catch {
      setSave('Local saving failed. Download project JSON to keep your work.');
    }
  }, [project, ready, writable]);
  useEffect(() => {
    const listener = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setP(parseProject(e.newValue));
        } catch {
          setSave(
            'Another tab supplied an invalid project. Your current project is unchanged.',
          );
        }
      }
    };
    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  }, []);
  const setProject = (p: Project) => {
    setP(p);
    setWritable(true);
  };
  return { project, setProject, ready, save };
}
export function ProjectTools({
  project,
  onImport,
  onMessage,
}: {
  project?: Project;
  onImport: (p: Project) => void;
  onMessage: (s: string) => void;
}) {
  async function load(file?: File) {
    if (!file) return;
    try {
      if (file.size > MAX_FILE)
        throw new Error('Project files must be at most 2 MB.');
      const next = parseProject(await file.text());
      if (
        project &&
        !window.confirm(
          'Replace the current activity with this imported project? Download your current JSON first if you need it.',
        )
      )
        return;
      onImport(next);
      track('project_import_success', projectParameters(next));
      onMessage('Project imported. Your cards and round are ready.');
    } catch (e) {
      onMessage((e as Error).message);
    }
  }
  return (
    <div className="project-tools">
      <button
        className="text-button"
        disabled={!project}
        onClick={() =>
          project &&
          download(
            JSON.stringify(project, null, 2),
            `bingo-card-kit-${project.id}.json`,
            // Force a file download in embedded browsers that preview JSON MIME types.
            'application/octet-stream',
          )
        }
      >
        <Download size={15} /> Save project
      </button>
      <label className="text-button file-label">
        <Upload size={15} /> Import JSON
        <input
          aria-label="Import project JSON"
          type="file"
          accept=".json,application/json"
          onChange={(e) => {
            void load(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </label>
    </div>
  );
}
export function CardView({
  project,
  card,
  hits,
  winning,
}: {
  project: Project;
  card: Card;
  hits?: boolean[];
  winning?: Set<number>;
}) {
  const words = new Map(project.words.map((w) => [w.id, w.text]));
  return (
    <div
      className={`bingo-card theme-${project.print.theme} mode-${project.mode || 'called'}`}
    >
      <div className="card-title">{project.title}</div>
      <div className="bingo-heading" aria-hidden="true">
        B I N G O
      </div>
      <div
        className="bingo-grid"
        style={
          {
            gridTemplateColumns: `repeat(${project.size},minmax(0,1fr))`,
            '--grid-size': project.size,
            '--cell-max-font': project.size === 3 ? '20px' : '14px',
          } as React.CSSProperties
        }
      >
        {card.cells.map((c, i) => (
          <div
            key={i}
            className={`bingo-cell ${c.kind === 'free' ? 'free' : ''} ${hits?.[i] ? 'hit' : ''} ${winning?.has(i) ? 'winning' : ''}`}
          >
            {c.kind === 'free' ? (
              <>
                <span className="free-star">✳</span>
                <span>FREE</span>
              </>
            ) : (
              <span
                className={`cell-word ${needsWordBreak(words.get(c.wordId)!) ? 'break-long' : ''}`}
                style={
                  {
                    '--word-em': longestWordEm(words.get(c.wordId)!),
                  } as React.CSSProperties
                }
              >
                {words.get(c.wordId)}
                {project.mode === 'people' && (
                  <small className="name-line">Name: __________</small>
                )}
              </span>
            )}
            {hits?.[i] && c.kind !== 'free' && (
              <span className="hit-check" aria-label="Called">
                ✓
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="card-footer">
        <span>{config.name}</span>
        <span>{card.id}</span>
      </div>
    </div>
  );
}
export function Notice({
  children,
  error = false,
}: {
  children: React.ReactNode;
  error?: boolean;
}) {
  return (
    <div
      className={`notice ${error ? 'error' : ''}`}
      role={error ? 'alert' : 'status'}
    >
      {error ? <AlertCircle size={17} /> : <Check size={17} />}
      <span>{children}</span>
    </div>
  );
}
