# DEFINE: Tasks

**Status: APPROVED v2 (2026-11-12), amended 2026-11-13.** Ddk approved the pivot. On 2026-11-13 Ddk changed sign-up from "none" to "optional Google sign-in" (section 11).

Inputs: [RESEARCH.md](RESEARCH.md) (steps 1 and 2) and the source notes in `docs/research/notes/`.

Source tags:
- **FACT:** read from the repo or the code.
- **RESEARCH:** from RESEARCH.md, which cites a dated source for each claim.
- **INFERRED:** my best guess. Confirm or correct it.
- **DECIDED:** decided by Ddk, or by Claude when Ddk delegated the choice.
- **OPEN:** waits for Ddk.

---

## Kill gate (step 3): PIVOT, not stop

| Test | Result | Why (RESEARCH.md) |
|---|---|---|
| Is "free + no account + open source" unique? | **Fail** | Super Productivity is MIT, free, has no account, runs on the web, has 23.6k stars and offers optional sync. Microsoft To Do and Google Tasks are free too. |
| Does local-only storage meet the core need? | **Fail** | One list on phone and laptop is the top praise for Todoist and TickTick, and the top reason people leave Things 3. |
| Is "proven accessible + keyboard-first" unique? | **Pass** | No leader publishes a WCAG 2.2 AA report. Google's own Tasks report rates keyboard access "Partially Supports". Todoist shortcuts work only on QWERTY and QWERTZ keyboards. |
| Is "calm backlog" unique? | **Pass** | Backlog guilt is the best-evidenced reason people quit (HN thread, 1,402 points). Leaders show red overdue counts. |

**Verdict: pivot the positioning and keep the product.** The headline changes from "no account, everything free" to "accessible, keyboard-first, calm and yours". "No paywall, ever" stays as a promise, not the headline. **DECIDED (Ddk, 2026-11-12): pivot approved.**

## 0. Identity

**DECIDED (Ddk):** both a product and a portfolio piece. The landing page sells the product. One section, lower down, shows the craft for reviewers. The README's assignment sections move to `docs/`.

## 1. Idea (step 2)

People quit to-do apps when the list turns into a pile of red overdue guilt, and keyboard and screen-reader users are poorly served by the big apps on the web. Tasks is a calm to-do list that anyone can run fully from the keyboard or a screen reader, proven by a public accessibility report, free forever, with your data in your hands. *(RESEARCH + INFERRED)*

## 2. Customer

- **Primary, keyboard-first people on a laptop:** developers and power users who want an app "built for the keyboard", not one that merely "has shortcuts". *(RESEARCH: Godspeed on HN, 328 points)*
- **Primary, screen-reader users on desktop:** JAWS and NVDA users on Windows, where the leaders' web apps are weakest. *(RESEARCH: WebAIM survey #10; Google Tasks report)*
- **Primary, people who quit over backlog guilt,** including many people with ADHD: they want fast capture and no shame pile. *(RESEARCH, low confidence: mostly vendor blogs and Reddit)*
- **Secondary:** people leaving Todoist or TickTick over price changes. *(RESEARCH: 71% of 184 poll voters said they would move after Todoist's Dec 2025 rise; self-selected poll)*
- **Scene:** at a desk, mid-work, a thought arrives. They add it in one typed line without the mouse and go back to work. Later, on the phone, they see the same list. *(INFERRED)*
- **Not the customer:** teams and shared projects. *(DECIDED: no sharing in v1)*

## 3. Pain

- **Backlog guilt:** overdue tasks pile up in red, and people quit. *(RESEARCH)*
- **Keyboard and screen-reader gaps** in the big web apps: functions that need a mouse, checkbox states that a screen reader cannot hear, colour as the only signal. *(RESEARCH: Google Tasks report)*
- **Changes in the deal:** features move behind a paywall, and prices rise. *(RESEARCH)*
- **Bloat:** too many "side quests" in feature-rich apps. *(RESEARCH)*
- **What they use now:** Todoist, TickTick, Microsoft To Do, Apple Reminders, Google Tasks, a .txt file or paper. *(RESEARCH)*

## 4. Outcome

- A task is saved from one typed line with no mouse. **Target:** under 5 seconds from key press to saved task. The magic moment target is set in step 4. *(TARGET)*
- Every function works from the keyboard and with NVDA, JAWS and VoiceOver, and a public report proves it. *(TARGET)*
- Missed tasks roll forward calmly. There is no red pile and no shame count. *(TARGET)*
- The same list on the laptop and the phone, with no account. *(TARGET; see section 5, item 5)*
- The data cannot vanish silently. *(TARGET; see risk 1)*

## 5. Mechanism

What exists today *(FACT)*:
1. One-line quick-add. It reads `today`, `tomorrow`, `!high`, `!med` and `!low`.
2. Keyboard for everything: command palette (Ctrl+K), search (/), reorder (Alt+↑/↓), undo.
3. Recurring tasks that never pile up. A late finish skips the missed occurrences.
4. Accessibility work: focus trap, announced moves, WCAG AA contrast checked in CI.

What the pivot adds *(INFERRED, to be specified in step 6)*:

5. **Sync.** *Changed 2026-11-13:* optional Google sign-in with Firestore is the main sync path (section 11). The user-owned ladder below stays as an option for people without a Google account, in this order:
   1. Home Screen install with `persist()`, and storage moves to IndexedDB.
   2. One-key export and a scheduled backup file.
   3. A file in a folder the user already syncs.
   4. Optional WebDAV.

   A one-time pairing code beats per-device tokens.
6. **Calm backlog:** a "today only" default, gentle roll-forward instead of red overdue counts, and stale tasks that fade into an archive.
7. **A full quick-add grammar,** at the level of the leaders: weekdays, dates, times, "every"/"every!" recurrence, #list, @label and priority.
8. **Layout-independent shortcuts:** they work on any keyboard layout, unlike Todoist's QWERTY/QWERTZ-only set.
9. **Accessibility proof:** a public WCAG 2.2 AA conformance report, NVDA + Chrome and VoiceOver + Safari test notes, an accessibility test suite in CI, and an accessibility changelog.

## 6. Difference (against the winners)

| Against | We do not win on | We win on |
|---|---|---|
| Todoist, TickTick | Sync polish, AI, integrations | Proven accessibility, calm backlog, no paywall, no account |
| Microsoft To Do, Google Tasks | Price (also free), ecosystem | Calm backlog, keyboard model, quick-add grammar, no account |
| Super Productivity | Price, licence, privacy, sync options | Simplicity, proven accessibility, easier sync setup *(RESEARCH: SP's accessibility was not checked)* |
| Things 3 | Native Apple polish | Works on every OS and in the browser, free |

## 7. Proof

- **Customer proof:** none yet, and none invented. *(FACT)*
- **Proof we can make:**
  - The public WCAG 2.2 AA conformance report and screen-reader test notes. This is the main proof, and no leader has one.
  - A live quick-add demo on the landing page.
  - Quotes from the 3 to 5 testers Ddk will find. Include at least one screen-reader user. AppleVis or r/Blind can help find one.
- **Reviewer proof (portfolio):** the test suite, CI checks and AI_WORKFLOW.md, in one craft section.

## 8. Pricing and the "all paid features free" promise

**DECIDED (Ddk):** free and open source, MIT, forever. There is no pricing table. The price line is "Free. No paywall, ever. MIT licensed." Build task: add the missing LICENSE file. *(FACT: it is missing)*

What "all paid features free" means *(RESEARCH, section 4)*:

| Competitor paid feature | In Tasks |
|---|---|
| Unlimited projects, lists, tasks, filters, labels, colour tags, themes | **Free in v1** (all local) |
| Calendar, table, timeline and Eisenhower views; duration; deadlines | **Free in v1** (all local) |
| Recurrence (paid in Any.do), full history, local auto-backup | **Free in v1** (all local) |
| Habits, focus timer, statistics, templates | **Free in v1** (all local) |
| Attachments | **Free, on the device**; they sync only through the user's own storage |
| Reminders | **Free while the app is open or installed**; reliable background push needs a push server, so **later** |
| Cross-device sync | **Free with optional Google sign-in** (Firebase Spark, no card, within daily quotas). Guests keep a device-only list and file backups |
| Sharing, teams, AI assistant, email/WhatsApp reminders, integrations | **Not in v1:** they need a server that costs money every month. A rule-based "smart capture" on the device replaces the AI capture. |
| Location reminders, widgets, HealthKit | **Not possible** in a web app; they need native apps |

The page says this honestly: every paid feature that can run on your device is free, and nothing is held back to sell.

## 9. Alternatives and competitors

See section 6 and RESEARCH.md. The new direct rival is **Super Productivity** (MIT, no account, 23.6k stars).

## 10. The one main action

Open the app and add a first task, with nothing between the visitor and that task. *(DECIDED unless section 11 changes it)* A secondary action for reviewers is the GitHub link in the craft section.

## 11. Sign-up: CHANGED (Ddk, 2026-11-13): from "none" to optional Google sign-in

**Decision:**
- **Guest mode stays the default.** There is no sign-in, and tasks save to this device only.
- **Optional "Sign in with Google"** adds sync across devices. It uses Firebase Authentication and Cloud Firestore on the free **Spark** plan, with no credit card.
- Hosting stays on GitHub Pages.

**What the free plan gives** (Firebase pricing page, checked 2026-11-13):
- No payment method needed.
- Firestore: 1 GiB stored, 50K reads, 20K writes and 20K deletes per day, 10 GiB/month of download traffic.
- Authentication: 50K monthly active users.
- Quotas apply to the whole project and reset around midnight Pacific time (Firestore quotas page).
- With no billing account there is nothing to charge. If a daily quota runs out, cloud sync pauses until the reset, and guest storage and the offline copy keep working.

**Rules that keep this honest:**
- Each user can read and write only their own tasks, enforced by Firestore security rules and tested in CI.
- Signing in is never required for any feature.
- A signed-in user can export everything, and can delete their cloud data and their account from inside the app.
- The landing page says plainly that signed-in tasks are stored by Google Firebase. The page gets a privacy note.

**Superseded:** option A below ("no sign-up") was the decision of 2026-11-12. The research ladder of user-owned sync (file, WebDAV) is now optional, for people who refuse a Google account.

Ddk asked for a sign-up screen. A real sign-up needs accounts and a server. That conflicts with "no account", "free forever on GitHub Pages" and "your data stays yours". The options:

| Option | What the user does | Cost and risk |
|---|---|---|
| **A. No sign-up; a "Get started" screen (recommended)** | Opens the app at once. A first-run screen offers: install to Home Screen, turn on backup, connect a sync folder | Free, private, no server. Matches the research and the pivot |
| **B. Real accounts (email/password or passkey) on a hosted backend** | Signs up, then syncs everywhere | A server, a database, a privacy policy, security work, and a monthly cost with no income. Breaks "free forever" unless sponsored |
| **C. Passwordless "sync space"** | Creates a space and saves a recovery phrase; pairs devices with a code. Data is end-to-end encrypted through a relay | Feels like sign-up, but there is no account. It still needs someone to run a relay; this is the sponsor question again |

## 12. Risks (worst first)

1. **Silent total data loss on iPhone.** Safari deletes a site's storage after 7 days of Safari use with no interaction on that site. Home Screen apps are exempt. The app does not call `persist()` yet. *(FACT + RESEARCH)* Fix first: Home Screen prompt, `persist()`, IndexedDB, backup file, "last backup" date.
2. **No sync for two-device users.** *(FACT)* **REVISED decision:** the earlier "one device at launch" decision is withdrawn. Research shows that local-only fails the core need. User-owned sync (section 5, item 5) is required before launch.
3. **Demand may stay in a developer niche.** *(RESEARCH)* Go/stop gate below.
4. **Screen-reader users prefer native apps** (58% prefer an app to a website). The web app must be clearly better on desktop. *(RESEARCH)*
5. **Bloat from "all features free".** It conflicts with "calm". Free features ship behind progressive disclosure, never all on the first screen. *(RESEARCH + INFERRED)*
6. **Not installable or offline yet:** no service worker, no manifest, and the fonts come from Google. *(FACT; fixed in M1 except the fonts, which move in M2)*
7. **Firebase quota is shared by all users.** 50K reads a day covers a small user base only. Cloud sync pauses for everyone when it runs out. Mitigation: Firestore's offline cache, listeners instead of repeated reads, and a usage check before launch. *(RESEARCH: Firebase pricing page)*
8. **Privacy shift.** Signed-in tasks live on Google servers. Mitigation: guest mode by default, a plain privacy note, and in-app export and deletion of cloud data. *(DECIDED)*
9. **Lock-in.** Sync depends on one vendor. Mitigation: guests are unaffected, and the export format stays plain JSON. *(INFERRED)*

## 13. Go and stop gates (proposed by the research)

- **Go** if, within about 6 months of launch: the WCAG 2.2 AA report is published, user-owned sync works, and traction is near the OpenTodo pace (a few hundred stars in the first months).
- **Stop, or give the work upstream** (for example, accessibility fixes to Super Productivity) if traction stays flat after sync exists and screen-reader testers do not prefer Tasks to Todoist or Microsoft To Do on desktop.

## Gate

- [x] Steps 1 and 2 done (RESEARCH.md)
- [x] Kill gate run: PIVOT
- [x] Ddk approves the pivot
- [x] Ddk chooses the sign-up option (section 11): A
- [x] Ddk approves this file (through the two gate answers, 2026-11-12)

After approval, Design starts (steps 4 and 5): the magic moment with its target, then the key screens, the landing page, onboarding (or sign-up) and the design system.
