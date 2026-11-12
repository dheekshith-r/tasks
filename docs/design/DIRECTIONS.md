# Three directions for the product website

> **Status: on hold.** The crit in `crit-why-theirs-look-human.html` found that all three directions fail its tests: no made asset or real data, a costume on every component, a metaphor before the product. The product flow law also requires an approved `DEFINE.md` before any design. Do not build from this file until both are resolved.

The product website is a new landing page for the Tasks app. It is a Persuade page: one visitor, one offer, one action. The app itself does not change here.

Inputs: `ANALYSIS.md` (principles P1 to P12), `PRODUCT.md`, the design log, and one impeccable concept roll (seed:d13e5fa2a385b7b3).

## The brief (inferred; correct me if wrong)

- **Visitor:** one person who keeps lists. They use a laptop and a phone, and they add tasks in passing.
- **Offer:** a fast personal to-do list. No account. The tasks stay on the device.
- **One action:** write a first task on the page, then open the app with that task already in the list. This is the working action, not a link to it (P3).
- **Pinned by you:** the palette, red #D62839 and yellow #FFC53D on white and black. Each direction keeps these colors but gives them a new job.

## Facts the page may state (true today)

- Quick-add reads `today`, `tomorrow`, `!high`, `!med` and `!low` in one typed line. Example: "Pay rent tomorrow !high".
- It has Today, Upcoming and Overdue views, recurring tasks, a command palette, and full keyboard and screen-reader support.
- There is no account. Data stays in this browser. Export and import make backups.
- Contrast is checked by a script, and an automated test suite runs on each build. The page shows the test count from CI, not a typed number.

The app has no customer quotes, ratings or user counts. The page will not invent them. A real quote can go in a `{{testimonial}}` slot later, if you have one (P4).

## How I chose

The design skills ask for an idea from outside software. I listed 7 things that list-keepers know well, ranked by fit:

1. A bullet-journal rapid log
2. A diner order-ticket rail
3. A page-a-day tear-off calendar
4. A rubber date stamp and a carbon order pad
5. A telegram form
6. A split-flap departure board
7. A thermal till receipt

The roll picked number 5 to lead. It stops me from always shipping my own first idea. Direction B is my own top pick. Direction C is the strongest outside idea the roll offered.

---

## Direction A — "Note to self, by wire" (lead)

**Thesis.** Every task is a telegram you send to your future self. You write one line. The wire prints it on tape and pastes it into the form: date, class, message.

- **Who:** one person who adds tasks in passing.
- **Feeling:** brisk, sure, a little witty.
- **Concept:** a telegraph office message form.

**Palette (pinned colors, new jobs).**
- Yellow #FFC53D is the ground of the form. It is a surface, not a marker.
- Ink #111111 prints the form's rules and labels.
- The tape strips are white paper with black caps.
- Red #D62839 appears only on the "URGENT" class stamp, one stamp per screen.
- The lower sections sit on white, like the form's carbon copy. In dark mode the form becomes a "night letter": an off-black ground with yellow rules and labels.

**Type.**
- Libre Franklin sets the form print, headlines and labels. Franklin Gothic is the face of printed American forms.
- Martian Mono sets the teleprinter tape and all numbers, in caps.

**Layout archetype.** The page is one object: a single message form, seen once. The hero is the front of the form. Lower sections are the form's own parts: the counterfoil, the station route, the printed conditions on the back (the FAQ and privacy), and the receipt stub (the footer).

**Signature element: live tape.**
1. The visitor types a line into the message field.
2. On Enter, tape strips print letter by letter, in 300ms or less. With reduced motion, they appear at once.
3. The strips paste into the DATE, CLASS and MESSAGE boxes.
4. The WORDS box counts the words. The COST box says "NONE".
5. "Send to my list" saves the task on this device and opens the app.

**First viewport.**
- A thin printed band holds the name on the left. Three links sit on the right: How it works, Privacy, Open the app.
- The form fills about 80% of the width. Its header reads "TO: YOU, LATER".
- The headline is "Send yourself a note. Get it on the right day." (draft copy)
- Below it are the message line (placeholder "Pay rent tomorrow !high"), the DATE / CLASS / WORDS boxes, and the button "Send to my list".
- The line under the button is "No account. Your tasks stay on this device." (P10)

**Page path.**
1. Hero form (works)
2. "Notes to self, scattered": loose notes, a phone alarm and an email to self, then the form that replaces them (P7)
3. The route as 4 stations: WRITE, COUNT, SEND, DELIVER, drawn as a line diagram (P8)
4. Delivery slots: Overdue, Today and Upcoming, shown in a real app screen cut off by the frame (P2)
5. The operator's key chart: keyboard shortcuts and the palette
6. Proof: true facts only (P4)
7. Conditions on the back: the FAQ
8. A dark night-letter block that repeats the hero action (P9)
9. Receipt-stub footer with the legal links and `{{place}}` (P11)

**Motion.** The tape prints, and the URGENT stamp presses once. Nothing else moves; no section fades up.

**Principles used:** P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12.

**What it took from the rejected challengers** (their discipline, not their look):
- *From the darkroom:* the page follows the wire's route in a fixed order, and "Send" is the one act that commits.
- *From the fluid ink basin:* the newest tape strip prints darkest; older strips are one step lighter.
- *From the pulp rack:* red is spent on one item per screen, the chosen one.
- *From the sleeping city:* the DATE box uses the visitor's real date, and the night-letter block reads the local time.
- *From the memory quilt:* each strip has a small caption that names its source word ("from: tomorrow").

**Risk.**
- The telegram could read as a costume. It must stay a working form, never sepia nostalgia.
- Red on yellow is only 3.15:1, so stamp text must be large and bold, or white on red.
- Some visitors never saw a telegram, so no copy may depend on that knowledge.

---

## Direction B — "The rapid log" (my top pick)

**Thesis.** The page is a rapid log. Each section is one entry with a signifier, the way people already write lists on paper.

- **Who:** the same visitor, at the evening review where they plan tomorrow.
- **Feeling:** calm, private, in control.
- **Concept:** bullet-journal notation (• task, × done, > moved, ! priority).

**Palette (pinned colors, new jobs).**
- Dark first: a black page (#0C0C0C) with white ink (#F4F4F4). The evening review is the scene.
- Yellow #FFC53D is a highlighter on one or two words per section.
- Red is the overdue and moved signifier only, as text-safe red #FF5A68 on dark.
- The light theme is a white page with black ink.

**Type.** Recursive only, one superfamily with three voices:
- Sans Linear for headings and body text.
- Mono for the signifier gutter and dates.
- The Casual axis only for what the visitor types, so it reads as their own hand without a script font.

**Layout archetype.** A single-column notebook, about 640px wide. A 3-character signifier gutter sits on the left, and page numbers sit in the margin. The nav is an "Index" page, as in a real journal.

**Signature element: signifier migration.**
1. The bullet of each section starts as •.
2. When the visitor reads past a section, its bullet turns to ×.
3. Points the page did not cover carry forward with > into the closing section, titled "Tomorrow".
4. In the hero, the visitor types a line. The signifiers appear in the gutter: • for the task, ! for priority, the date in mono.

**Page path.**
1. Index (the nav)
2. Hero entry (works)
3. "Before: the loose list" (P7)
4. The Key, a legend of signifiers that explains how it works (P8)
5. A daily log with a real app screen
6. Keyboard keys
7. Proof (true facts only)
8. Notes (the FAQ)
9. "Tomorrow": a light morning page, so the page ends on a dark-to-light change (P9)

**Principles used:** P1, P3, P5, P6, P7, P8, P9, P10, P12.

**Risk.**
- This is the most familiar of the three. Journal styling is common in productivity marketing.
- A dot-grid background or cute stickers would make it stationery slop. Neither is allowed.
- The Casual axis can look cute if it is used outside the visitor's own words.

---

## Direction C — "Two-pass print" (challenger: screenprint overlap)

**Thesis.** A task is printed in passes. The words are the black pass, the date is the yellow pass, and the priority is the red pass. Where "today" and "urgent" meet, the passes overprint to orange.

- **Who:** the same visitor.
- **Feeling:** bright, exact, playful.
- **Concept:** a registered screenprint with transparent inks.

**Palette (pinned colors, new jobs).**
- A full palette on white paper: a black key pass, a yellow pass and a red pass.
- The overprint orange is computed from red over yellow; it is not a new brand color.
- Thin black registration marks sit in the margins.
- In dark mode the paper becomes black and the inks lighten so they still overprint.

**Type.**
- Big Shoulders Stencil Display at regular weight sets headlines and numbers.
- Schibsted Grotesk sets the text.

**Layout archetype.** An asymmetric layered canvas. Each section is one "pull" made of 2 or 3 offset layers, labeled "PULL 2/3". It has no 12-column sheet and no full-bleed color field, so it stays clear of the Grid design.

**Signature element: pass separation.**
1. The visitor types a line in the hero, and it prints as three passes.
2. A drag, or a hover with a mouse, pulls the passes apart, out of register. This shows what the app read: the words, the date and the priority.
3. On release, the passes snap back into register.
4. A keyboard user gets the same view with a "Show passes" button.

**Page path.**
1. Hero (works)
2. "Off register": tasks spread over many apps, shown as a bad print (P7)
3. Three passes, drawn as a diagram (P8)
4. The views as color separations: Today is yellow, Overdue is red, both is orange
5. Proof (true facts only)
6. FAQ
7. A final black key-pass block that repeats the action (P9)

**Principles used:** P1, P2, P3, P5, P6, P7, P8, P9, P10.

**Verdict.** Competitive. The passes explain the parser very clearly. But list-keepers do not live in print shops, so it loses on audience fit.

**Risk.**
- It sits close to a known AI look: flat saturated ink with condensed display type. Transparent overprint, regular-weight stencil, no black boxes and no hard shadows keep it out of that look.
- Text must never sit on orange alone.

---

## Law check: each direction against the design log

The palette axis is pinned by you, so the colors stay. Their jobs change.

| Axis | Last designs (log) | A: Telegram | B: Rapid log | C: Two-pass print |
|---|---|---|---|---|
| Palette role | Red field, yellow marker only, white/black | Yellow is the surface; red is one stamp | Dark first; yellow highlighter; red signifier | White paper; red and yellow overprint to orange |
| Type | Bricolage Grotesque + Inter; Hanken Grotesk | Libre Franklin + Martian Mono | Recursive (one superfamily, 3 voices) | Big Shoulders Stencil + Schibsted Grotesk |
| Layout | Sidebar + list; Swiss poster field + 12-col sheet | One object: a message form | Single-column notebook with index | Asymmetric layered canvas |
| Signature | Progress ring; poster numeral; red strike | Live tape printing into fields | Signifier migration on scroll | Pass separation by drag |

All three differ from the log on every axis that is not pinned.

## Also available

- **The standard page:** a clean, conventional product page (headline, app screen, features, FAQ, final call). Ask if you want it.
- **A new roll:** a fresh set of three, either safer or bolder.

## Open decisions for later

1. Where the page lives. One option is the landing page at the site root and the app at `/app/`. They share one origin, so the hero can put the first task into the app's storage.
2. A real quote or a real place for `{{testimonial}}` and `{{place}}`. Without them, those slots stay out.
