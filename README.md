# Bingo Card Kit

An English word Bingo maker using Astro, React, TypeScript and pdf-lib. Generate 1–200 cards, download vector PDFs, and host/check the same stored card matrices. No accounts, database or business backend. Advertising is off.

## Run and verify

Node 22.12+ and npm:

```sh
npm ci
npm run dev
npm run check
npm test
npm run build:production
npm run qa:html
npm run build:preview
npm run qa:html:preview
npm run qa:pdf
python scripts/inspect-pdf.py
```

The Python check needs pdfplumber and pypdf. It verifies actual PDF cells/IDs, page sizes and a 10 pt minimum. Render with Poppler for visual inspection. DOM tests cover real PDF generation, both dirty-download branches, matching snapshots, hosting/undo/checking, old JSON import, restoration, first-call events and failed local storage. Browser viewport checks do not establish real-phone or physical-printer acceptance.

PDF code loads on export. Lato is embedded from `public/fonts/` (OFL license included). Long text wraps and adjusts to at least 10 pt; unsupported glyphs or overflow stop export with an explanation. Complex scripts and emoji are outside this edition. `npm run samples` rebuilds the committed example game packs using this same engine; their fixed example IDs match the corresponding template-page preview.

The free center displays the existing brand mark as vectors rather than the word FREE. It still starts marked; an ordinary custom word FREE remains a called entry. Every template and activity preset has a matching vector header motif. Theme colors selects its own occasion palette; ink saver stays monochrome, and sage and plum remain available. All styles keep word cells white. These are print-only changes: stored matrices, card IDs, free-space settings and calling rounds are preserved. Browser previews and PDFs share motifs, palettes and logo geometry. Fixed template samples use Theme colors; the maker starts with ink saver and restores the user's saved choice.

## Builds and publishing

| Target | Command | Output | Public address | Indexing |
|---|---|---|---|---|
| Formal | `npm run build:production` (also `npm run build`) | `dist/` | https://bingocardkit.com/ | Enabled by default |
| Preview | `npm run build:preview` | `dist-preview/` | https://ymping666.github.io/projectbingo/ | Always disabled |

Both commands explicitly set the deployment target, origin and base path. `INDEXABLE_BUILD=false` suppresses all canonical links, public sitemap entries and indexing even when the domain is supplied. An invalid indexable origin/target is rejected. `/host/` and 404 remain noindex; the formal robots file permits crawling `/host/` so crawlers can read that instruction. No CNAME is added to GitHub Pages.

The existing Cloudflare **projectbingo** static Worker builds `main` with `npm run build` and deploys with `npx wrangler deploy`. `wrangler.jsonc` serves only `dist/`, uses the real 404 page, and does not depend on the last preview build. The GitHub workflow separately tests, builds and publishes **dist-preview/** on pushes to `main`. Preserve the existing Cloudflare domain binding and unrelated DNS records. Host redirects belong in this domain’s Cloudflare Redirect Rules ([official guide](https://developers.cloudflare.com/fundamentals/manage-domains/redirect-domain/)); Workers asset `_redirects` does not support domain-level redirects.

For automatic pushes, the repository owner's **Cloudflare Workers and Pages** GitHub App installation must include `projectbingo` under selected repositories. A repository label in Cloudflare and a successful manual rebuild alone do not verify that access. Keep other repositories' existing authorizations intact. Source updates use ordinary `git push`; the deploy command above runs inside the existing Cloudflare build, so a local Wrangler login is not required.

Formal sitemap: https://bingocardkit.com/sitemap.xml . Submit that URL in the correctly verified Google Search Console and Bing Webmaster Tools properties; no verification tags are fabricated by this project.

## Activities and migration

Storage retains `bingo-print-kit:v1`; schema 1 / generator 1.0 remain compatible. Matrices and card IDs are preserved on import. An optional round `started` flag remembers the first call even after undo to zero; older JSON with progress is recognized as already started. Print changes keep cards and calls. Editing stays a draft until an explicit generation, which creates a new project ID and resets the round. Dirty downloads offer the saved set or a confirmed new set; exports use the returned snapshot.

The two public addresses have separate local storage. At the old preview, choose **Save project**, then **Import JSON** on the formal site. Save a copy before replacing an activity. Neither origin reads the other’s storage; no project data is put in URLs or uploaded. The old preview stays available with a migration notice. When saving is blocked, the inline host and downloads still use the current in-memory snapshot.

## Optional contact and GA4

An empty `PUBLIC_CONTACT_EMAIL` hides Contact. Do not invent an email address. Ads remain disabled; no AdSense ID or ads.txt is supplied.

Feedback is available from the footer and a small floating entry (hidden while hosting/calling). Its approved public responder URL is recorded in `config/feedback.production.json`; `PUBLIC_FEEDBACK_FORM_URL` can override it. It opens Google Forms in a new tab, including without JavaScript. The Google form has required feedback type and message, an optional reply email, no sign-in requirement, no automatic email collection, no respondent autosave, and no public response summary. New-response notifications are enabled for the private owner inbox. This site never includes that receiving address or mail credentials in source or HTML, attaches project content, or sends feedback to analytics. Only the public form URL belongs in the repository. Verify permissions and notification receipt again if replacing the form.

Public production defaults are recorded in `config/analytics.production.json` and applied by the build script. Cloudflare build variables or a local environment file can override them. `PUBLIC_GA4_ID` is a public Measurement ID, never a credential. `PUBLIC_GA4_MANUAL_ONLY=true` may be recorded only after Enhanced Measurement is disabled on that stream; it confirms the platform setting and cannot change it. Setting the flag to false disables this integration. Preview builds always force the ID empty and this flag false. Rebuild after any configuration change. Never put service credentials in public variables.

Only an indexable production build on exactly `https://bingocardkit.com` can request Google’s script, and defaults to enabled without an automatic prompt. A saved opt-out (including an earlier rejection) prevents Google script loading. Preview, localhost and automated browsers send nothing. The footer allows turning statistics off or on; failed statistics do not block the activity. Build-time CSP allows Google only when configured. Privacy follows the actual build configuration.

Manual events: `template_used`, `generation_success`, `export_success`, `export_error`, `host_start`, `project_import_success`, `sample_download`. Fixed sample links use `sample_download` with export type `sample`; blank sheets use export type `blank` without generation or host events. `export_success` means PDF generation completed and browser download was triggered, not saved or printed. `host_start` occurs at the first real call in a round, including both hosts; opening or restoring is not a generation/start event. Only known template IDs, settings, fixed error categories and sanitized known page paths are sent. No titles, words, IDs, raw errors, JSON, arbitrary query/hash/referrer or file names are included. GA script requests use no referrer, with Google signals and ad personalization off.

Local adapter/DOM test success is separate from a deployed real ID and from confirmed GA4 Realtime/DebugView receipt. Do not claim live analytics until the platform actually shows the events.

Blank sheets use a separate PDF model, never the project word pool or activity storage. Alphabet presets are separate cases on one template page. Cloudflare platform statistics are separate from GA4 preferences; Privacy describes both, without assuming beacon injection or receipt is uniform across responses.
