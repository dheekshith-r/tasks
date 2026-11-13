# SPEC: Tasks v1 (product flow step 6)

Inputs: [DEFINE.md](DEFINE.md) (approved), [RESEARCH.md](RESEARCH.md), [docs/design/MAGIC-MOMENT.md](docs/design/MAGIC-MOMENT.md), and the chosen design direction **A · Plain Sight** (Ddk, 2026-11-12) on the "Tasks directions" canvas.

The work ships in milestones. Each milestone is production-ready on its own and goes through CI (tests, type-check, build, contrast, CSP). The test suite is never weakened.

## Design decisions carried from the canvas

- **Type:** Atkinson Hyperlegible Next for all text, and Atkinson Hyperlegible Mono for keys and code. Both are self-hosted, so the app works offline.
- **Colour roles:** white ground and ink #141414. Red #D62839 is only for the main action and the focus ring. Yellow #FFC53D is only the "today" and date marker. Red never means overdue.
- **Signature:** the quick-add line is the headline, very large, on the landing page and at the top of the app.
- **App layout:** one main column. A large quick-add band sits at the top, view tabs below it, then the list. **Change from the canvas:** the canvas drew a sidebar app. The design log already has a "sidebar + list" app (the first Tasks design), and the design law forbids repeating a layout. The views move into tabs, with lists in a menu.
- **Calm backlog:** "Carried over" replaces the red Overdue view. There are no red counts. After 14 days a task offers "Let go" (archive, with undo).

## Milestones

### M1: Safe storage and installable app (this build)
Fixes risk 1 in DEFINE.md (silent data loss on iPhone) and risk 6 (not installable).
1. A web app manifest (name, icons 192/512 and maskable, start URL, standalone display).
2. A service worker with no dependencies. It caches the app so it works offline, and it never caches across origins except fonts.
3. `navigator.storage.persist()` is requested after the first saved task. The result is stored and shown.
4. Record the date of the last export. Show "Last backup: <date> / never" and the storage status in the command palette and the colophon.
5. Add the MIT `LICENSE` file.
6. Move the README's assignment sections into `docs/`.
7. The CSP gains `worker-src 'self'` and `manifest-src 'self'`; the CSP check covers them.
- **Not in M1:** IndexedDB. It has the same eviction rules as localStorage (RESEARCH.md), and the dataset is small. It moves to M5, where sync needs it.

### M2: Plain Sight app
The new look; self-hosted fonts; the one-column shell; calm backlog ("Carried over", "Let go"). Quick-add grammar adds weekdays, dates such as `14 nov`, `#list`, and `every day|week|month`. Existing features and tests keep working.

### M3: Landing page and Get started
The site root becomes the landing page, with a working hero quick-add. The task saves into the same storage, then the app opens at `/app/`. Get started has three optional steps: install, protect and back up, sync folder (sync itself arrives in M5). There is no sign-up (DEFINE.md section 11).

### M4: Free features, batch 1
Week calendar view, durations and deadlines, saved filters and labels, unlimited lists (already true).

### M5: User-owned sync
IndexedDB storage; sync through a file in a folder the user already syncs; optional WebDAV; device pairing with a one-time code. Per-item timestamps with last-write-wins (RESEARCH.md); move to a CRDT if testing shows lost edits.

### M6: Accessibility proof
Automated accessibility checks in CI, Playwright end-to-end tests, and the magic-moment test (first saved task within 10 seconds of load, keyboard only). Plus NVDA + Chrome and VoiceOver + Safari test notes, and a published WCAG 2.2 AA conformance report.

### M7: Free features, batch 2
Habits, a focus timer, statistics, themes.

### Then: product flow step 7
Ship to testers, measure the magic-moment target and their words, and write MEASURE.md.

## Acceptance for M1
- The app installs from Chrome and from iOS Safari (Add to Home Screen), and reloads offline.
- The app asks for persistent storage after the first saved task, and shows the answer. Browsers that refuse it lose nothing.
- An export updates "Last backup", and the date survives a reload.
- All existing tests pass. New tests cover the persist request, the backup date and the manifest link.
- CI: audit, tests, contrast, type-check, build and CSP check all pass.
