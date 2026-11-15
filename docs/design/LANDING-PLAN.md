# Start page plan v3, from the study (2026-11-15)

Evidence: [STUDY.md](STUDY.md) (11 live sites, every screen captured) and the 53 references (principles P1 to P25 in ANALYSIS.md). The look stays direction A, Sorting Frame (owner's choice). What changes is everything the study says we lack: length, a made object, the live product, pain first, motion, a human hand, a real close.

## Story: one day with Tasks (13 sections, about 10,000px at 1280px)

A thin ink "day line" runs down the left edge from section 3 to section 7 with times on it, as Sunsama joins one day (P22).

| # | Section | What the visitor sees | Motion (one job each) | Principles |
|---|---|---|---|---|
| 1 | Hero | Headline left. Right: the sorting frame drawn in ink with a mail chute on top. Under the headline, the input; as you type, "tomorrow" gets a yellow underline, "!high" a red chip and "#home" a box, inside the input. A handwritten aside with a drawn arrow: "try your own line". | Staged entrance, once: headline (0 s), then three sample slips slide down the chute, get stamped and drop into Today, Tomorrow and This week (0.6 to 2.4 s). Enter adds yours the same way. | P2, P17, P24, P25 |
| 2 | Pain | "Your tasks live in six places. / None of them talk." An ink collage: a sticky note on a fridge, a message to yourself, the back of a bus ticket, an email badge, a calendar invite, a notebook corner, joined by dotted arrows. | As you scroll, the pieces are pulled into one envelope, and it drops into the chute. | P7 (Ramp, Sunsama) |
| 3 | 8:14 am, capture | "One line. / Three words it understands." | Pinned while you scroll: the line types itself; "friday" lifts off and becomes a date stamp on the Friday slot, "!high" a red tag, "#home" a list label. | P17, P21, P24 |
| 4 | 9:30 am, the real app | "This is the app, not a picture of it." A working demo running the app's own parser on your real date and clock, with a red "now" line, and a dock to switch: Today, Upcoming, Carried over, Search, Commands. | You switch the demo yourself; the dock icon pops on press only. | P3, P18 (Raycast, Linear, Todoist) |
| 5 | 1:30 pm, keyboard | "Run it from the keyboard. / Your hands never leave it." A drawn keyboard; N, /, Ctrl K, Alt ↑↓, F2, Esc and Ctrl Z carry captions. | Keys press in sequence; press a real key and the drawn one goes down and its caption shows. | P16 (Raycast), P3 |
| 6 | 4:00 pm, heard | "Heard, not just seen." A speech ribbon shows what a screen reader says during the demo, using the app's real announcements. | The ribbon types the spoken line in step with the demo. | P4, P18 |
| 7 | 9:40 pm, calm | "Yesterday's tasks wait. / They don't shout." Evening turns to morning; unfinished slips slide into the grey Carried over tray; a drawn red "14 overdue" badge (labelled: other apps) is crossed out by hand. | Scroll moves the sun and the slips; the cross-out draws itself. | P7, P24 |
| 8 | Free | "Everything is free. / There is no paid plan." The features list in huge type: repeating tasks, subtasks, notes, search, undo, command menu, backups, offline, themes, optional sync. | Each line lights up as it reaches the middle of the screen; at the end a big "FREE · MIT" postage stamp lands. | P21, P13 |
| 9 | Privacy | "Your tasks live here." A drawn house with a letterbox. A switch: Guest or Sync. | Guest: the letter stays in the box. Sync: it flies to a cloud labelled "Google Firebase, your account only". | P8, P11 |
| 10 | Built in the open | A changelog timeline, newest entry with a red dot; dates read from git when the site is built; "Last change: <date>". GitHub link and a handwritten aside. | The newest dot pulses once. | P19, P11 (Linear changelog) |
| 11 | FAQ | Six real questions: Is it really free? Where are my tasks? Does it work offline? What happens if I clear my browser? Can I use it on my phone? How do I move my tasks out? | Accordion, instant. | Amie |
| 12 | Close | The frame again, every slot full, the chute empty: a full-width "Open my list" button and a handwritten "see you tomorrow". | The final stamp lands when the section enters. | P16 bookend, P13 (Figma) |
| 13 | Footer | One-line restatement, a site map (Product, Project, Help), license, "made in the open". | None. | P11 |

## The made object: ink-line postal art, drawn in code

- One drawing family for every section: 2.5px ink lines with round caps, a slight hand wobble (the SVG turbulence filter the postmark already uses), hatching for shadow, flat fills only in yellow #FFC53D, red #D62839, slot grey and paper white.
- Objects only (slips, stamps, envelopes, the chute, a letterbox house, keys, a sun, a tray). No human faces: drawn in code they look stiff.
- About 12 illustrations, all inline SVG, so they scale, theme for dark mode and cost no image downloads.
- One self-hosted handwriting face for asides only; text stays Overpass and Overpass Mono.

## Motion system

- One orchestrated hero sequence (once per visit), then one motion per section, each with a job (sequence, transformation, feedback). No fade-up on every section.
- Scroll-linked moments use CSS scroll-driven animations with an IntersectionObserver fallback; no animation library unless the fallback proves too weak (GSAP considered, about 40 KB).
- Transform, opacity and SVG stroke drawing only. Reduced motion: every section shows its final frame, still; the hero shows the sorted frame.
- The app keeps its calm rules (no motion on keyboard actions).

## Budgets and checks

- Length 9,000 to 11,000px at 1280px; 12 or more sections; made art in at least 9 of them.
- Landing JS 60 KB or less gzipped; LCP 2.5 s or less and CLS 0.1 or less on a throttled phone; no third-party requests.
- When built: capture our page with the same script and put it beside Things, Todoist and Superlist; count sections, art and running animations. Plan the 5-second stranger test.

## Build order (two checkpoints)

1. Art system and sections 1 to 3 (the top third), as a working preview. **Checkpoint: you review it.**
2. Sections 4 to 13, then the side-by-side capture and every Stage 7 check. **Checkpoint: you review before any publish.**

## Honest risks

- Art drawn in code can look mechanical; the wobble filter, hatching and loose arrows are the counter. If a drawing still looks stiff at the checkpoint, it gets redrawn or cut.
- Scroll-driven CSS is not in every browser yet; the fallback must look complete on its own.
- This is a large build (several sessions). The top third comes first so you can judge the direction early.
