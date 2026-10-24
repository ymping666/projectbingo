import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  LayoutGrid,
  Plus,
  Search,
  X,
} from 'lucide-react';
import { allPresets, type Template } from '../lib/templates';

const groups = [
  'All templates',
  'Learning',
  'Everyday',
  'Celebrations',
  'Activities',
] as const;
type Group = (typeof groups)[number];
function groupOf(t: Template): Group {
  if (t.category === 'Activities') return 'Activities';
  if (t.category === 'Celebrations') return 'Celebrations';
  if (
    [
      'Sight words',
      'Phonics',
      'Letters and numbers',
      'Classroom vocabulary',
    ].includes(t.category) ||
    t.id === 'classroom-objects-bingo'
  )
    return 'Learning';
  return 'Everyday';
}

export default function TemplatePicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (template?: Template) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<Group>('All templates');
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const selected = allPresets.find((t) => t.id === value);
  useEffect(() => {
    if (!open) return;
    const modal = dialog.current!;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modal.showModal();
    search.current?.focus();
    return () => {
      modal.close();
      document.body.style.overflow = previousOverflow;
      trigger.current?.focus();
    };
  }, [open]);
  const filtered = allPresets.filter(
    (t) =>
      (group === 'All templates' || groupOf(t) === group) &&
      `${t.name} ${t.category} ${t.description}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  function choose(template?: Template) {
    onChange(template);
    setOpen(false);
  }
  return (
    <>
      <button
        type="button"
        id="template"
        ref={trigger}
        className="template-picker-trigger"
        aria-labelledby="template-label template-selection"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setQuery('');
          setGroup('All templates');
          setOpen(true);
        }}
      >
        <span className="picker-current-icon" aria-hidden="true">
          {selected?.icon || <Plus size={20} />}
        </span>
        <span className="picker-current-copy">
          <strong id="template-selection">
            {selected?.name || 'Custom word list'}
          </strong>
          <small>
            {selected
              ? `${selected.words.length} entries · ${selected.size} × ${selected.size} grid`
              : 'Start with your own words'}
          </small>
        </span>
        <span className="picker-browse">Browse</span>
        <ChevronDown size={17} aria-hidden="true" />
      </button>
      {open &&
        createPortal(
          <dialog
            ref={dialog}
            className="template-dialog"
            aria-labelledby="template-dialog-title"
            aria-describedby="template-dialog-description"
            onCancel={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault();
                setOpen(false);
              }
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <div className="template-dialog-surface">
              <div className="picker-heading">
                <div>
                  <div className="picker-eyebrow">
                    <LayoutGrid size={13} aria-hidden="true" /> THE TEMPLATE
                    LIBRARY
                  </div>
                  <h2 id="template-dialog-title">A little inspiration.</h2>
                  <p id="template-dialog-description">
                    Pick a starting point. Make it your own.
                  </p>
                </div>
                <button
                  type="button"
                  className="picker-close"
                  aria-label="Close templates"
                  onClick={() => setOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="picker-controls">
                <div className="picker-search">
                  <Search size={18} aria-hidden="true" />
                  <input
                    ref={search}
                    type="search"
                    aria-label="Search templates"
                    placeholder="Search music, birthdays, sight words…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <div
                  className="picker-filters"
                  role="group"
                  aria-label="Template categories"
                >
                  {groups.map((g) => (
                    <button
                      type="button"
                      key={g}
                      aria-pressed={group === g}
                      onClick={() => setGroup(g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="picker-results">
                <div className="picker-results-heading">
                  <span>{group}</span>
                  <span aria-live="polite">
                    {filtered.length}{' '}
                    {filtered.length === 1 ? 'template' : 'templates'}
                  </span>
                </div>
                <div className="picker-grid">
                  {group === 'All templates' && !query.trim() && (
                    <button
                      type="button"
                      className={`picker-card picker-custom ${!selected ? 'is-selected' : ''}`}
                      aria-label="Custom word list"
                      aria-pressed={!selected}
                      onClick={() => choose()}
                    >
                      <span className="picker-card-icon" aria-hidden="true">
                        <Plus size={23} />
                      </span>
                      <span className="picker-card-copy">
                        <strong>Start from scratch</strong>
                        <small>Your words. Your kind of Bingo.</small>
                      </span>
                      {!selected ? (
                        <Check size={17} aria-hidden="true" />
                      ) : (
                        <ArrowUpRight size={17} aria-hidden="true" />
                      )}
                    </button>
                  )}
                  {filtered.map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      className={`picker-card picker-tone-${groupOf(t).toLowerCase()} ${t.id === value ? 'is-selected' : ''}`}
                      aria-label={t.name}
                      aria-pressed={t.id === value}
                      onClick={() => choose(t)}
                    >
                      <span className="picker-card-icon" aria-hidden="true">
                        {t.icon}
                      </span>
                      <span className="picker-card-copy">
                        <strong>{t.name}</strong>
                        <small>
                          {t.words.length} entries <span>·</span> {t.size} ×{' '}
                          {t.size} <span>·</span> {groupOf(t)}
                        </small>
                      </span>
                      {t.id === value ? (
                        <Check size={17} aria-hidden="true" />
                      ) : (
                        <ArrowUpRight size={17} aria-hidden="true" />
                      )}
                    </button>
                  ))}
                </div>
                {!filtered.length && (
                  <div className="picker-empty">
                    <Search size={26} aria-hidden="true" />
                    <h3>No templates found</h3>
                    <p>Try another word or browse all categories.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('');
                        setGroup('All templates');
                      }}
                    >
                      Show all templates
                    </button>
                  </div>
                )}
              </div>
              <div className="picker-footer">
                <span>
                  <Check size={14} aria-hidden="true" /> Free to use & customize
                </span>
                <span>Choose a template, then generate your cards.</span>
              </div>
            </div>
          </dialog>,
          document.body,
        )}
    </>
  );
}
