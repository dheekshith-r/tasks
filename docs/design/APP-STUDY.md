# App study: why the product looks worse than its start page (2026-11-15)

Ddk tested the live site on a phone: the start page is "smooth as butter", the app is "ugly". This study finds out why, with evidence, before any design. The start page stays as it is; the app must match it.

## 1. Our app, audited with a real week of tasks

Method: a realistic week (13 tasks: 3 today, 2 carried over, 1 tomorrow, 3 this week, 2 later, 2 done, lists Personal, Work and Home, notes, subtasks, a daily repeat, one long title), production build, 375 x 812 and 1280 x 800, light and dark, plus the empty first run. Screenshots stay local.

| # | Flaw | Evidence | Why it matters |
|---|---|---|---|
| 1 | **The list is not in the first view on a phone.** The first screen holds the header, the date, the input, a date field, a priority field, the Add button, the view tabs, search and sort, and then one task. | 375 px first view: 1 task visible of 11 | People open a to-do app to see their tasks. Every control above the list pushes the product off the screen. |
| 2 | **The website's signature moment is missing.** On the start page the words you type are marked while you type (date in yellow, priority in red, list boxed) and a postmarked slip drops into its day. The app has a plain input with a native date picker and a priority menu beside it. | App input vs start page hero | The "trailer" promises a feeling the "movie" does not give. |
| 3 | **Form controls duplicate the one-line syntax.** "dd-mm-yyyy" and "Medium priority" sit under an input that already understands "friday !high". | Both views | Two ways to say the same thing; the browser's own date control looks foreign to the design. |
| 4 | **Noise on every task.** "Medium" is printed on every task; a "Today" tag sits inside the Today slot; "Low" is printed too. | Week, both sizes | Marks should mean an exception. Repeating the obvious hides the important (Things shows only the project; Todoist shows priority by the colour of the check ring). |
| 5 | **The header is a wall of boxed capital chips**: 4 view chips with counts, 3 list chips with two-letter code boxes ("PE", "WO", "HO"), a "New list" field. | Laptop header | Ten boxed labels compete with the content; the code boxes mean nothing to a person. |
| 6 | **Squeezed text bugs**: the Backup column in the colophon and the empty-state text run one word per line. | Your screenshots 2 and 3, our 375 px full page | A broken layout reads as "unfinished". |
| 7 | **No art, no hand, no story.** The start page is drawn in ink with handwritten notes, a day line and a postmark; the app has none of it beyond the yellow labels. | Side by side | Same brand, two different worlds. |
| 8 | **Long titles squeeze in four columns at 1280 px** (about 290 px each), wrapping to three lines. | "Reply to the landlord about the leaking kitchen tap…" | A column floor that is too narrow for real titles. |
| 9 | **Upcoming is grouped by slot (Tomorrow, This week, Later), the start page's demo groups by day.** | Truth check | A small difference from what the website shows. |
| 10 | **Desktop-only controls on the phone**: "Commands Ctrl K" in the phone header. | 375 px header | No keyboard on a phone; it takes header space. |

What already works and stays: the slot names (Carried over, Today, Tomorrow, This week, Later, Done), calm grey for carried over, the postmark on a new task, every key and announcement, dark mode, 44 px targets, the truth check (40 of 40 promises kept).

## 2. Real products, studied screen by screen

Captured live (local only): Things (feature pages with full app screens, Mac and iOS), Todoist (feature pages with app screens), Tweek (the real app, no account, 375 and 1280 px), Super Productivity (the real app, no account, 375 and 1280 px). Refero was tried first; its subscription is not active.

| Product | 3 details | Principle |
|---|---|---|
| Things, Today | One column with wide margins; each to-do is a small check, the title, and one muted line with its project only; a "This Evening" section with a moon icon and a hairline. | **The list is the hero; marks appear only for exceptions.** |
| Things, Upcoming | Each day starts with a big numeral ("17") and a small grey day name ("Tomorrow"), with a hairline above; events in colour, to-dos under them. | **A date is the structure of a plan.** |
| Todoist, app | Priority is the colour of the check ring, never a word; the date is a small coloured line under the title; the project name sits right-aligned in grey. | **Show priority by a mark, not a label.** |
| Tweek, phone | Each day is a bold date with the weekday in light grey at the right, then ruled lines; tasks sit on the lines like ink on paper; empty lines invite writing. | **A planner feels like paper when the empty space is ruled, not blank.** |
| Tweek, laptop | A week spread of seven columns with ruled lines and a "Someday" strip under them; a yellow marker highlight on one task. | **A week reads at a glance when each day has the same ruled box.** |
| Super Productivity, phone | A bottom bar with Today, Planner, notes and menu, and a large round + in the middle; an empty Today says what to do and gives one button. | **On a phone, the add action lives where the thumb rests.** |

## 3. What the app must make the user believe and do

**One sentence:** opening the app, you see today's tasks at once, calm and sorted, and you add the next one with one typed line that is marked as you type and postmarked into its day.

Magic moment target (unchanged, from MAGIC-MOMENT.md): first saved task under 10 seconds from page load, keyboard only; on a phone, under 10 seconds with the on-screen keyboard.

## 4. Rules for the redesign (all three directions follow them)

1. The start page's visual system, unchanged: white ground and ink #161616 (dark: #101010), hand-inked frame rules, yellow only on labels and the day tag, red only for the main action, the postmark and "!high" (with the word), Overpass and Overpass Mono, Kalam only for handwritten notes inside the art.
2. Tasks in the first view on a phone: at least 5 at 375 x 812 with a realistic week.
3. One input that marks the words it understands while you type (the start page's mirror), and the postmark when a task lands. No date picker or priority menu beside it; they move to the task's details.
4. Priority: "!high" stays a red tag with its word; medium and low show nothing.
5. Lists are written as `#name`, the same as in the input; no code boxes.
6. Upcoming is grouped by day, with big date numerals, as on the start page's demo.
7. Every promise of the start page keeps passing the truth check (40 of 40), and every key and announcement keeps working.
8. Fix flaws 6 and 8: no text column under 280 px; long titles wrap at most to two lines on a laptop.

## 5. Three directions (all in the start page's visual system)

Prototypes drawn with a realistic week, at 375 x 812 (light and dark) and 1280 x 800. Every one keeps rules 1 to 8 above.

| | A · One day line | B · The sorting frame | C · Week on two pages |
|---|---|---|---|
| Idea | The start page's day line becomes the app: one calm column from Carried over to Later | The start page's pigeonhole cabinet becomes the app | A paper planner: each day a ruled box, the week as an open book |
| Phone | Big date numeral, then Carried over, Today, then each day with its numeral; the input docked at the bottom | One slot at a time; the yellow slot labels are tabs; swipe between slots; input at the bottom | Carried over as a grey slip clipped to the page; days with ruled lines and empty "write here" lines; input at the bottom |
| Laptop | A left rail (views and #lists), the day line in the middle, a hand-inked card of keys on the right | The whole cabinet at once: Today, Tomorrow, This week above; Carried over, Later, Done below; the IN plate beside the input | Two pages side by side: Carried over, today and the next days on the left; the rest of the week and Later on the right |
| Tasks in the phone's first view | 6 | 3 | 7 |
| Strength | Calmest; scales to many tasks; closest to Things | Most faithful to the start page's hero | Most hand-made; empty lines invite writing |
| Risk | Plainest of the three | Other days are hidden on a phone | A busy day makes a very long page box |
