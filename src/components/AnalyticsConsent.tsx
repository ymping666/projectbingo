import { useEffect, useState } from 'react';
import {
  analyticsConfigured,
  readConsent,
  setAnalyticsConsent,
} from '../lib/analytics';
export default function AnalyticsConsent() {
  const [open, setOpen] = useState(false),
    [enabled, setEnabled] = useState(true),
    [message, setMessage] = useState('');
  useEffect(() => {
    if (!analyticsConfigured) return;
    const saved = readConsent();
    setEnabled(saved !== false);
    void setAnalyticsConsent(saved !== false);
  }, []);
  if (!analyticsConfigured) return null;
  const choose = (allow: boolean) => {
    setEnabled(allow);
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
          <h2>Statistics preferences</h2>
          <p>
            Google Analytics is on by default and measures page visits and basic
            tool actions. Your words, titles, cards, project IDs, and files are
            never included.
          </p>
          <p>
            Statistics are currently {enabled ? 'on' : 'off'} in this browser.
          </p>
          <div>
            <button className="button outline" onClick={() => choose(false)}>
              Turn off statistics
            </button>
            <button className="button primary" onClick={() => choose(true)}>
              Turn on statistics
            </button>
          </div>
          <button className="text-button" onClick={() => setOpen(false)}>
            Close
          </button>
          <a href="/privacy/">Read our privacy policy</a>
        </aside>
      )}
      {message && <span role="status">{message}</span>}
    </>
  );
}
