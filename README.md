# Tasks – To-Do App (React + TypeScript)

A clean, accessible to-do app built twice to show range:

| Folder | Stack | Why |
|---|---|---|
| [`/react`](./react) | React 19, TypeScript 7, Vite 8, Vitest 5 | Component-based version with typed state and unit tests |
| [`/vanilla`](./vanilla) | HTML, CSS, JavaScript | Same app with no framework, proving the fundamentals |

**Live:** the start page is https://dheekshithsnewjourney-crypto.github.io/to-do-sample/ and the app is at [/app/](https://dheekshithsnewjourney-crypto.github.io/to-do-sample/app/). Both deploy automatically from `main`; the app installs like an app and works offline.

The start page is a sorting frame: type a line in the IN slot and it drops into its day's slot (Today, Tomorrow, This week, Later) with a red postmark drawn in code (`react/src/landing/main.ts`). Your line is saved to your list. The app uses the same frame, one slot per day group.

## Guest mode and optional sign-in
- **Guest mode (default):** no account. Tasks stay in this browser, nothing is uploaded, and the app works offline.
- **Sign in with Google (optional):** the same list on your phone and laptop. It uses Firebase on the free Spark plan. Your tasks are stored at `users/<your uid>/` in Cloud Firestore, and the [security rules](./react/firestore.rules) let only you read or write them. You can delete your cloud data and account from inside the app.
- Setup steps for the Firebase project: [docs/FIREBASE_SETUP.md](./docs/FIREBASE_SETUP.md). Without the Firebase variables, the build is guest-only.

## Features
- **Lists and smart views:** custom lists (each with a monogram marker, red for the one you are in) plus All tasks, Today, Upcoming and Overdue, each with live counts
- **Task details drawer:** notes, subtasks with progress, due date, priority and list
- **Quick add:** type `Pay rent tomorrow !high` and the date and priority are filled in for you
- **Recurring tasks:** repeat daily, weekly or monthly. Completing one creates the next occurrence, un-completing it takes that occurrence back, monthly repeats keep their day across short months (Jan 31 → Feb 28 → Mar 31), and a task finished late skips the occurrences it missed
- **Command palette** (`Ctrl+K` / `⌘K`) to jump to any view, list or task, switch theme, or export
- **Drag and drop** to reorder, or `Alt+↑/↓` from the keyboard (focus stays on the task and the move is announced), plus sorting by due date or priority
- **Search** (press `/`) with highlighted matches, status filters, and **undo** for both delete and Clear completed
- **Backup:** export and import all data as JSON. Every field of an imported file is validated before it replaces anything
- **Themes:** light and dark, plus an accent colour picker that keeps text readable whatever colour you pick
- **Mobile:** below 820px the sidebar becomes an off-canvas menu. Tested at 375px with no horizontal scroll
- **Accessible:** focus-trapped dialogs that restore focus on close, labelled controls, a single status region for announcements, visible focus, and reduced-motion support

## Design
The day as a Swiss International Style poster. A red field at the top states how many tasks remain, at poster scale, next to the date. Below it, a 12-column typographic sheet lists the tasks by when they are due. Full rules and tokens: [DESIGN.md](./DESIGN.md).

- **Brand:** red `#D62839` (the field) and yellow `#FFC53D` (a marker only), on white and off-black.
- **Type:** Overpass and Overpass Mono on both pages ("Sorting Frame" design, 2026-11-14). All fonts are served from this site. Every number uses tabular figures.
- **Layout:** no sidebar and no cards. 3px ink rules open each group, and hairlines separate rows. A "when" rail (Overdue, Today, Tomorrow, a date, Done) labels each run of tasks. On phones the views and lists move into a slide-out menu.
- **Signature:** the count re-sets with a short roll when it changes, and a finished task gets a red strike, line by line.
- **Red text** uses a text-safe red (`#C8202F`), so it reaches 4.5:1 even on the hover grey. Red never means danger by colour alone: overdue tasks also get an icon and words.

Every text/background pair is checked against WCAG AA (4.5:1) by a script that reads the tokens straight from both stylesheets:
```bash
cd react
npm run contrast
```
It also runs in CI, so a palette change that breaks contrast fails the build.

The prototype screenshot of the chosen direction is in [`prototypes/C-grid.png`](./prototypes/C-grid.png).

### Motion and touch
- Two custom curves: `--ease-out` for things that enter or leave, `--ease-drawer` for the drawer and the mobile menu. Exits are faster than entries.
- Actions you repeat many times a day do not animate: the command palette opens instantly, and task rows have no entry animation. The check-off is a short settle with no bounce.
- Buttons scale to 0.96 when pressed. Hover styles apply only to devices with a mouse, so a tap never leaves a stuck hover state.
- Every control has a hit area of at least 40px (44px on touch screens). Small visuals get an invisible larger target.
- With "reduce motion" turned on, nothing moves. Fades and colour changes stay, so feedback is not lost.

## Deploy and rollback
- CI runs on every push and pull request: dependency audit, tests, contrast check, type-check, build, and a CSP check of the built page.
- Only a push to `main` deploys to GitHub Pages. Branch runs never deploy.
- The production build adds a Content Security Policy. GitHub Pages cannot send headers, so it is a meta tag. Each inline script is allowed by its hash, which the build computes.

To roll back a bad release:
1. Find the bad commit: `git log --oneline`.
2. Revert it: `git revert <commit>`.
3. Push to `main`. CI tests the revert and deploys the previous version.

To redeploy a known good commit without new code, run the workflow by hand from the Actions tab ("Run workflow").

## Built with AI
This project was built with AI assistance. See [AI_WORKFLOW.md](./AI_WORKFLOW.md) for my prompts, how I verified the output, and the bugs I caught.

## Run locally
Needs Node 22.12 or newer (CI uses Node 26 LTS).
```bash
cd react
npm install
npm run dev        # development server
npm test           # unit and DOM tests (210)
npm run test:rules # Firestore security rules against the emulator (17)
npm run contrast   # WCAG AA check of the colour tokens
npm run build      # type-check + production build
npm run csp        # checks the built page's Content Security Policy
```
The vanilla version needs no setup: open `vanilla/index.html`.

## Structure
```
react/
├── scripts/contrast.mjs   # WCAG contrast check for both stylesheets
└── src/
    ├── App.tsx            # views, filters, wiring
    ├── reducer.ts         # pure state logic
    ├── dates.ts           # local-date maths: due labels, repeats
    ├── quickadd.ts        # natural-language parsing for new tasks
    ├── storage.ts         # localStorage + validation of stored and imported data
    ├── views.ts           # which tasks each view shows
    ├── color.ts           # contrast helpers for the accent picker
    ├── hooks.ts           # useDialog (focus trap), useClock (date rollover)
    ├── types.ts, uid.ts
    ├── *.test.ts(x)       # logic tests, plus App and vanilla tests in jsdom
    └── components/        # Sidebar, Drawer, Palette, TaskForm, TaskItem, EmptyState, ...
```

## Tests
210 tests across 15 files, plus 17 Firestore security-rules tests that run against the emulator (`npm run test:rules`, needs Java 21+):
- **Logic** (`reducer`, `dates`, `quickadd`, `storage`, `views`, `color`): recurring tasks, month ends, daylight-saving days, quick-add edge cases, corrupted storage, import validation.
- **Components and app** (jsdom + Testing Library): focus trap and focus restore in the drawer, palette and mobile menu, keyboard reorder, drag and drop, undo, date rollover at midnight.
- **Vanilla** (`vanilla.test.ts`): loads the real `vanilla/index.html` and `script.js` into jsdom.

## Roadmap
The plan lives in [SPEC.md](./SPEC.md), built on [DEFINE.md](./DEFINE.md) and [RESEARCH.md](./RESEARCH.md). The original assignment answers are in [docs/assignment.md](./docs/assignment.md).

## License
[MIT](./LICENSE). Free, with no paywall, ever.
