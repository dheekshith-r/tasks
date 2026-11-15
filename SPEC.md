# SPEC: Tasks v1 (product flow step 6)

Inputs: [DEFINE.md](DEFINE.md) (approved), [RESEARCH.md](RESEARCH.md), [docs/design/MAGIC-MOMENT.md](docs/design/MAGIC-MOMENT.md), and the chosen design direction **Sorting Frame** (Ddk, 2026-11-14, direction A on the "Tasks rebuild directions" canvas). It replaces "Plain Sight" (2026-11-12) for both the start page and the app.

The work ships in milestones. Each milestone is production-ready on its own and goes through CI (tests, type-check, build, contrast, CSP). The test suite is never weakened.

## Design decisions: Sorting Frame (2026-11-14)

- **Idea:** a post-office sorting frame. Each task is a paper slip. One typed line is postmarked with the day and drops into its day's slot.
- **Slots:** Carried over, Today, Tomorrow, This week (2 to 6 days), Later (7 days or more, or no date), Done. Wide screens show the slots as columns of one frame; phones stack them.
- **Type:** Overpass for all text, Overpass Mono for dates, keys and tags. Both self-hosted.
- **Colour roles:** white ground, ink #161616 for text and the frame. Yellow #FFC53D is only the slot label strip. Red #D62839 is only the main action, the postmark and the "!high" tag (always with the word, never colour alone). "Carried over" is grey, never red. Dark theme: the same roles on #101010 with light frame lines.
- **Signature:** on Enter the slip drops into its slot and a red postmark with today's date lands on it (one 240 ms move, none with reduced motion).
- **Page intent:** start page = add your first task here; app = add and finish tasks. Nav and footer stay standard.
- **Calm backlog:** "Carried over" replaces the red Overdue view. No red counts.

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

### M2: Sorting Frame rebuild (start page and app), started 2026-11-14
- **Status (2026-11-14):** start page and app rebuilt; acceptance tests 1 to 6 pass (210 unit/DOM tests, 17 rules tests; first view at 375x667 and 1280x720; Lighthouse mobile: start LCP 1.7 s, TBT 0 ms, CLS 0.002; app LCP 2.0 s, TBT 140 ms, CLS 0.003; accessibility 100). Still open in M2: "Let go", `14 nov` dates, `every …` repeats. New `og.png` done 2026-11-14 (source in docs/design/og/).
- **Status (2026-11-15): start page v2, 13 sections** from [docs/design/LANDING-PLAN.md](docs/design/LANDING-PLAN.md): hero; six scattered notes gathered into one envelope (pinned); one line understood (pinned); then one day on a single day line: 9:30 am live demo of the views, 1:30 pm drawn keyboard that answers real key presses, 4:00 pm the app's real screen-reader announcements, 9:40 pm night to morning with Carried over (pinned); free, privacy (house and letterbox), changelog read from git at build time, questions, the closing frame with the visitor's own line, footer. Checks: tests, contrast (tokens and the rendered page, both themes), CSP, audit 0, keyboard pass, worst case at 320 and 375 px, still version with reduced motion; Lighthouse mobile 97 to 99, LCP 1.7 to 2.2 s, 0 ms blocking, CLS under 0.01. The stranger test is planned in [MEASURE.md](MEASURE.md).
- **Scope:** new look for both pages; app fonts self-hosted (done); the frame layout; postmark on add; "Carried over" naming. Later in M2: "Let go" after 14 days, dates such as `14 nov`, `every day|week|month`, a new `og.png`.
- **Screens:** start page (IN slot with the working input, then the day slots with a sample list); app (header with the IN slot, list strips, the frame, the key bar).
- **Data:** unchanged. Same storage keys, same Firestore rules, same hand-off.
- **Acceptance tests:**
  1. All unit, DOM and rules tests pass with no weakened assertion.
  2. The headline and the input are visible with no scroll at 375x667 and 1280x720, light and dark.
  3. A typed line lands in the right slot with the right tag, by keyboard only.
  4. Contrast AA by script for both themes of both pages; CSP check passes.
  5. Lighthouse mobile (slow 4G): LCP <= 2.5 s, TBT <= 200 ms, CLS <= 0.1.
  6. No horizontal scroll at 320 px; worst-case lines (long, RTL, Hindi, emoji) stay inside their slip.

### M2b: The app as "one day line" (Ddk chose direction A, 2026-11-15)
- **Why:** [docs/design/APP-STUDY.md](docs/design/APP-STUDY.md): on a phone only 1 task was in the first view; the start page's marked input and day line were missing; noise on every task.
- **Scope, checkpoint 1 (main screen):** a left rail on laptops (views, `#lists`, commands, theme) that is the menu on phones; the date as a big numeral with the day and a one-line summary; one input that marks the date, priority and list while you type (the start page's parser, so what is marked is what is saved), docked at the bottom on phones; the day line: Carried over as a grey slip clipped to the page ("no rush"), Today, Tomorrow, This week, Later, Done; Upcoming grouped by day with big numerals; slips without "Medium"/"Low" and without a "Today" tag inside Today; `!high` as a red check ring plus its red tag; the colophon and empty-state squeeze fixed.
- **Status (2026-11-15), checkpoint 1 built:** 5 tasks in the phone's first view (was 1), measured with a touch-phone viewport and a realistic week; on phones the carried-over slip starts folded ("no rush"), search with filters and sort opens from one button, and each task keeps one details button (Delete is in the details, followed by Undo). Truth check 40 of 40; 220 tests (3 new: marks equal what is saved, Upcoming by day, the folded slip); contrast AA on the rendered app in both themes; no sideways scroll 320 to 1280 px with text up to 200%; Lighthouse mobile 96 to 97, LCP 2.0 s, TBT 120 to 140 ms, CLS under 0.04.
- **Checkpoint 2, built 2026-11-15:** the details panel as a slip (big editable title; one-tap dates Today, Tomorrow, In a week, No date; priority as three buttons; list, repeat, notes, subtasks, place, delete with an Undo note); empty states drawn in ink with a handwritten note and copy that works on both layouts; the command menu with its keys in a footer; settings titled with label strips; a keys card beside the day line on screens 1240 px and wider. "Subtasks" is the one word everywhere, as on the start page. Checks: 220 tests, truth check 40 of 40, contrast AA in both themes, 11 of 11 worst-case runs, 5 tasks in the phone's first view, Lighthouse mobile 97 / 100 / 100, TBT 50 to 100 ms, CLS 0.025.
- **Data:** unchanged. Same storage keys, same Firestore rules, same hand-off.
- **Acceptance tests:**
  1. All unit, DOM and rules tests pass; tests change only where a behaviour was removed on purpose (list code boxes, date and priority fields beside the input, the count numeral), each replaced by a test of the new behaviour.
  2. At least 5 tasks in the first view at 375 x 812 with the realistic week; the input reachable without scrolling.
  3. The truth check keeps 40 of 40 promises of the start page.
  4. Contrast AA on the rendered page, both themes; CSP check; no sideways scroll at 320 to 1280 px with text up to 200%.
  5. Lighthouse mobile: LCP up to 2.5 s, TBT up to 200 ms, CLS up to 0.1.

### M3: Landing page (built 2026-11-13, ahead of M2, at Ddk's request)
- **Done:**
  - The site root is the start page, and the app moved to `/app/`. The storage keys and the origin are unchanged, so existing lists stay.
  - **Hero:** the "Pencil to type" visual, drawn in code (Ddk chose option 1 of 3 on the "Plain Sight visuals" canvas).
  - **Working input:** the hero input saves the task. Guests write straight to this device. Signed-in users get a hand-off that the app adds after their synced list loads.
  - **Quick-add:** the app's quick-add now reads weekdays and `#list`, so the page claims nothing the app cannot do.
- **Still open:**
  - The Get started screen (install, protect, back up) is still to do. Today the app shows the same items in its colophon.
  - Superseded on 2026-11-14: both pages now use the Sorting Frame design (M2). The share image was redrawn on 2026-11-14.

### M4: Free features, batch 1
Week calendar view, durations and deadlines, saved filters and labels, unlimited lists (already true).

### M1b: Optional Google sign-in and cloud sync (built now, ahead of M2, at Ddk's request of 2026-11-13)
- **Guest mode** is unchanged and stays the default (localStorage, this device only).
- **Sign in with Google** uses Firebase Authentication (popup flow, because the app is not hosted on the Firebase auth domain) on the free Spark plan.
- **Data:** `users/{uid}/tasks/{taskId}` and `users/{uid}/lists/{listId}` in Cloud Firestore, with a persistent offline cache.
  - The app keeps its reducer. A pure diff between the last cloud snapshot and the current state turns into one batched write.
  - Remote changes arrive through snapshot listeners.
- **First sign-in:** if guest tasks exist on this device, offer once to copy them into the account.
- **Sign out:** the account's tasks leave this device, and the guest list comes back.
- **Delete:** "Delete my cloud data" removes every document, then the account.
- **Security rules:** owner-only access, a whitelist of fields, size limits, and the collections limited to `tasks` and `lists`. Rules tests run against the Firestore emulator in CI.
- **Config:** the Firebase web config comes from `VITE_FIREBASE_*` variables (GitHub Actions variables, `.env.local` locally). With no config, the sign-in button is hidden and the app is guest-only.
- **Lazy loading:** the Firebase SDK loads only when someone signs in, or is already signed in, so guests download none of it.
- **CSP:** allows only the Firebase and Google hosts that sign-in and Firestore need.

### M5: Sync without Google (optional)
For people who refuse a Google account: sync through a file in a folder the user already syncs, or WebDAV. Per-item timestamps with last-write-wins (RESEARCH.md).

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
