# Bingo Print Kit

An English, browser-local word Bingo maker built with Astro, React, TypeScript, and pdf-lib. No accounts, database, paid API, tracking, or ads.

## Run

Node 22.12+ and npm are required. The lockfile pins compatible dependencies, including unifont 0.7.4 to avoid a newer transitive Node requirement.

```sh
npm ci
npm run dev
```

Open the Local URL printed by Astro. `npm run build` creates the static `dist/` directory; `npm run preview` serves that build. On restricted environments, set `ASTRO_TELEMETRY_DISABLED=1` before running Astro.

## Use

Start with the 50-food-word example or one of 10 templates. Edit a title and words, choose a 3×3 or 5×5 grid, FREE center, and 1–200 cards. Generate a new project, preview numbered cards, and download cards or a complete game pack. Print at Actual size / 100% using the matching paper size.

Start hosting uses the current in-memory snapshot, including when browser saving is unavailable. The dedicated `/host/` page restores the most recently saved activity. Call words, undo, verify full card IDs, or confirm a new round. Horizontal rows, vertical columns, and both diagonals count. Checks do not establish who won first.

The latest activity is saved locally. Download project JSON as a portable backup; import validates the entire file before replacement. Cards are stored as real cell matrices, not reconstructed from a seed. Print changes preserve cards and calls. New content requires Generate, which creates a fresh project ID. Unsaved draft edits are not printed or hosted.

PDF code loads only on export. The local Lato font is embedded and licensed in `public/fonts/OFL.txt`. Text wraps and adjusts to a minimum of 10 pt; overflow and unsupported glyphs stop export with a specific error. Complex scripts and emoji are outside this edition.

## Verify

```sh
npm run check
npm test
npm run build
npm run qa:html
npm run qa:pdf
python scripts/inspect-pdf.py
```

The last command needs `pdfplumber` and `pypdf`. PDF samples and matching JSON snapshots are written to `output/pdf/`, including `bingo-test-game-pack.pdf` (40 cards, A4, two per page). Use Poppler `pdftoppm` to render actual PDF pages. Samples are generated artifacts and are not committed.

Core tests cover minimum pools, 200 distinct layouts, FREE typing, exact line cases and one-short cases, state restoration, print invariance, cross-project IDs, and invalid imports. DOM integration tests exercise a real PDF export, hosting, undo, verification, downloads, refresh restoration, import, and storage failure. DOM tests do not replace browser or physical printer testing.

## Static deployment

GitHub Pages is deployed by `.github/workflows/pages.yml` after tests and static-link verification. It uses `PUBLIC_BASE_PATH=/projectbingo/` so navigation, Astro assets, fonts, and PDF export work beneath the repository path. This acceptance deployment deliberately keeps indexing disabled until a production domain is selected. A push to `main` updates the Pages site automatically.

Upload `dist/` to Cloudflare Pages, with build command `npm run build`, output `dist`, and this folder as the project root. Alternatively use Cloudflare Workers static assets with the included `wrangler.jsonc`; no Worker business API, SSR, or database is required. `_headers` and `404.html` are included. Other static hosts must serve directory indexes and return the actual 404 page/status for unknown paths.

Until a real production domain is configured, builds are deliberately noindex, omit canonicals, disallow crawling, and emit an empty sitemap. For an indexable production build set both `PUBLIC_SITE_URL` to your real HTTPS origin and `INDEXABLE_BUILD=true`. The build rejects missing or obvious placeholder/preview domains. The `/host/` page remains noindex and outside the sitemap. No user content goes in public routes.

Brand, optional real contact email, ad flags, and disabled statistics hooks are centralized in `src/lib/config.ts`. Advertising placeholders collapse completely while disabled. Do not enable a provider before configuring real approved IDs and updating privacy content. No production publication or domain purchase is part of this delivery.
