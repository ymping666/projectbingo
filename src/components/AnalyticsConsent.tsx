import { useEffect, useState } from 'react';
import {
  analyticsConfigured,
  readConsent,
  setAnalyticsConsent,
} from '../lib/analytics';
export default function AnalyticsConsent() {
  const [open, setOpen] = useState(false),
    [message, setMessage] = useState('');
  useEffect(() => {
    if (!analyticsConfigured) return;
    const saved = readConsent();
    if (saved === true) void setAnalyticsConsent(true);
    if (saved === undefined) setOpen(true);
  }, []);
  if (!analyticsConfigured) return null;
  const choose = (allow: boolean) => {
    setOpen(false);
    void setAnalyticsConsent(allow).then((ok) => {
      if (allow && !ok)
        setMessage(
          'Statistics could not load. Your Bingo activity still works.',
        );
    });
  };
  return (
    <>
      <button className="text-button" onClick={() => setOpen(true)}>
        Statistics preferences
      </button>
      {open && (
        <aside className="consent-panel" aria-label="Optional statistics">
          <h2>Help improve Bingo Card Kit?</h2>
          <p>
            With your permission, Google Analytics measures page visits and
            basic tool actions. Your words, titles, cards, project IDs, and
            files are never included.
          </p>
          <div>
            <button className="button outline" onClick={() => choose(false)}>
              No thanks
            </button>
            <button className="button primary" onClick={() => choose(true)}>
              Allow statistics
            </button>
          </div>
          <a href="/privacy/">Read our privacy policy</a>
        </aside>
      )}
      {message && <span role="status">{message}</span>}
    </>
  );
}
