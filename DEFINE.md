# DEFINE: Tasks

**Status: DRAFT, all key questions answered (2026-11-12). It waits for Ddk's approval.** No design or build work starts before approval (product flow law).

Each answer has a source tag:
- **FACT:** read from the repo or the code.
- **INFERRED:** my best guess from the repo. Confirm or correct it.
- **UNKNOWN:** only Ddk can answer.

---

## 0. The question that decides everything

The repo reads like two different things. Everything below depends on which one is true.

| | A. A product for people who keep lists | B. A portfolio piece for a hiring reviewer |
|---|---|---|
| Evidence | Real features: recurring logic, undo, import validation, accessibility, CSP, CI | README: "built twice to show range", a "Debugging task" section, "Enhancement ideas for a basic static page", an AI_WORKFLOW.md for reviewers |
| Customer | One person with a laptop and a phone | A recruiter or engineering lead who reads the repo for 5 minutes |
| Main action | Open the app and add a first task | Open the live demo, then read the code |
| Landing page sells | The outcome (a list you trust, no account) | The engineer (craft, tests, judgment) |

**ANSWERED (Ddk, 2026-11-12): both.** Tasks is a real product first, and it also works as Ddk's portfolio. Consequences:
- The landing page sells the product outcome to list-keepers. The craft story (tests, accessibility, CSP, AI workflow) gets one section for reviewers, lower on the page.
- The README's assignment sections ("Debugging task", "Enhancement ideas for a basic static page") move out of the README into `docs/`, so a product visitor does not read the app as an exercise.

## 1. Idea

One person adds tasks in passing all day. Today they lose them in notes, chats and heavy apps that want an account. Tasks gives them a list they can add to in one typed line, with no account, and trust. *(INFERRED)*

## 2. Customer

- **Who:** one person who manages only their own tasks, on a laptop and a phone. They use the keyboard on the laptop and the thumb on the phone. *(INFERRED, from PRODUCT.md)*
- **Scene:** at a desk, in the middle of other work, a thought arrives ("pay rent tomorrow"). They want it saved in 2 seconds without the mouse, then back to work. Later in the day, they check what is due today. *(INFERRED)*
- **Possible wedge:** keyboard-only and screen-reader users. The app has full keyboard control, announced moves and checked contrast, and many to-do apps do this badly. *(INFERRED. Not tested with real users.)*
- **Not the customer:** teams, shared lists, project managers. The app has no sharing. *(FACT)*

## 3. Pain

- Big to-do apps ask for an account, a sync setup and an onboarding tour before the first task. *(INFERRED)*
- A notes app or chat-to-self loses dates, so tasks are found too late. *(INFERRED)*
- Repeating chores pile up as overdue copies when one is missed. *(INFERRED)*
- **What they use now instead:** a phone's built-in reminders, a notes app, paper, or a big app such as Todoist or TickTick. *(INFERRED)*

## 4. Outcome

What is true for the customer after they use it:
- A task is saved from one typed line, with no mouse. **Target:** under 5 seconds from key press to saved task. *(TARGET, not measured)*
- What is due today is one key away. *(FACT: Today view and command palette)*
- A missed repeating task does not create a pile of overdue copies. *(FACT: a task finished late skips the occurrences it missed)*
- Nothing is lost by mistake: delete and "Clear completed" can be undone. *(FACT)*
- No account, and no data leaves the device. *(FACT: localStorage only, no server)*

## 5. Mechanism

How the product makes the outcome happen:
1. **One-line quick-add.** It reads `today`, `tomorrow`, `!high`, `!med` and `!low` in a typed line. *(FACT)*
2. **No account, no server.** The app opens in a browser tab and saves to that browser. *(FACT)*
3. **Keyboard for everything.** Command palette (Ctrl+K), search (/), reorder (Alt+↑/↓), undo. *(FACT)*
4. **Repeats that never pile up.** Completing a repeat creates the next one and skips missed ones. Monthly repeats keep their day across short months. *(FACT)*
5. **Smart views.** Today, Upcoming, Overdue and All, with live counts. *(FACT)*

**What only it does (ruthless):** no single item is unique.
- Todoist and TickTick parse far more in quick-add: weekdays, times, lists, "next week". Our parser reads only 5 tokens.
- Built-in reminder apps need no account inside their own ecosystem.
- The honest edge is the **combination**: no account + keyboard-first + accessible + open source. Whether people care about that combination is **UNKNOWN**.

## 6. Proof

- **Customer proof today:** none. There are no users, quotes or usage numbers. *(FACT)* We will not invent any.
- **Engineer proof today:** 140+ automated tests, a WCAG AA contrast check in CI, a CSP check. This is proof for builders, not for list-keepers (crit finding 4). *(FACT)*
- **Proof we can make:**
  - A live quick-add demo on the landing page: the visitor types a line and sees it parsed. This is a demonstration, not a claim.
  - 3 to 5 real people use it for one week and give a one-line quote with permission. **ANSWERED:** Ddk will find them. Until their quotes exist, the page shows the live demo and no quotes.
- **Proof for reviewers (portfolio):** the engineer proof above, plus AI_WORKFLOW.md, in the one craft section.

## 7. Pricing and business model

- **ANSWERED (Ddk, 2026-11-12): free and open source, forever.** There is no server, so the cost to run is only GitHub Pages (free).
- **FACT:** the README says "MIT", but the repo has no LICENSE file, so legally there is no license yet. Build task: add an MIT LICENSE file.
- **Consequence:** the page has no pricing table. "Free. Open source. No account." is the price line.

## 8. Alternatives and competitors

| Alternative | What it has that we lack | What we have that it lacks |
|---|---|---|
| Apple Reminders, Google Tasks, Microsoft To Do | Free, built in, sync across devices | Works with no account; keyboard-first; same on every OS |
| Todoist, TickTick | Rich quick-add, sync, apps on every platform | No account, no tracking, open source |
| Things | Polished native Apple apps | Free; works outside Apple; open source |
| A notes app or paper | Zero learning, always at hand | Due dates, Today view, repeats, undo |

*(INFERRED from public knowledge of these products. No prices stated, because I did not verify them.)*

## 9. The one main action

Open the app and add a first task. There is no sign-up step between the visitor and that task. *(FACT that it is possible. INFERRED that it is the goal.)*

Secondary action, for reviewers only (portfolio): open the code on GitHub from the craft section. It never competes with the main action above the fold.

## 10. Risks (worst first)

1. **No sync, for a two-device customer.** The inferred customer uses a laptop and a phone, but each browser keeps its own list. Export and import is the only bridge, and it is manual. *(FACT)*
   - **DECIDED (Claude, delegated by Ddk, 2026-11-12): launch with one device per list, no sync.**
   - Why: sync needs a server and accounts. That breaks free, open source and "nothing leaves the device", adds running cost and a security surface, and the free model has no money to pay for it.
   - In exchange: the page says "one device" honestly. Build hardens local data (risks 2 and 3).
   - Later: revisit a no-account option (for example device-to-device transfer, or end-to-end encrypted sync) only if testers ask for it.
2. **Silent data loss.** Data lives only in localStorage. The browser can clear it. Safari can delete script-written storage after 7 days without a visit, unless the site is on the Home Screen. The app does not request persistent storage. *(FACT for the code; Safari behaviour from WebKit's published policy)*
3. **Not installable and not fully offline.** There is no service worker and no web app manifest, and the fonts load from Google. *(FACT)*
4. **Mixed identity.** The README's assignment sections tell a visitor this is a coding exercise (section 0). *(FACT)*
5. **Weak differentiation** against free built-in apps that sync. *(INFERRED)*
6. **Phone gaps.** There is no drag-to-reorder on touch screens. *(FACT, on the README roadmap)*
7. **No public URL.** The README still says "paste your GitHub Pages URL here". *(FACT)*

## 11. Unknowns

Answered on 2026-11-12: identity (both), pricing (free and open source), sync (one device at launch), testers (Ddk will find them).

Still open, and accepted as open:
1. The names of the 3 to 5 testers. They are needed before quotes go on the page, not before Design.
2. The public URL: the GitHub Pages address or a custom domain. It is needed before launch, not before Design.
3. Whether the customer values the combination in section 5. The testers' week answers this.

## Gate

- [x] Section 0 answered
- [x] Every UNKNOWN answered or accepted as open
- [ ] Ddk approves this file

After approval, Design starts with the **magic moment**, then the landing page, onboarding and the design system.
