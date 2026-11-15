# Landing page study (2026-11-15)

Why: Ddk judged the Sorting Frame start page "lifeless AI slop" (one short scroll, no art, no motion). This study looks at real, human-made product pages, full length, before any new plan.

Method: a capture script (Playwright with the installed Edge, 1280x800, light) saved every screen of each page (one shot per 760px of scroll, with a pause so scroll motion can play), four hero frames at 0.4 s, 1.2 s, 2.4 s and 4 s (to see load motion), and an inventory: page height, images, videos, SVGs, canvases, Lottie/Rive/Framer/GSAP/Lenis markers, fonts. Screenshots stay local in `references/live/` (never published). Our own page measured the same way: 3,632px, 0 images, 2 SVGs, 0 running animations.

## Things (culturedcode.com/things) — 8,106px, 37 images, 1 video, 10 SVGs, no motion library
- Hero: the made object is the 3D app icon (a blue inbox tray holding a checked card), the name, one sentence, "Watch Introduction Video". Static: frames at 0.4 s and 4 s are identical.
- Screen 2: a giant app window in 3D perspective, tilted and cut by the right edge; type in the UI is huge, so the product reads as a landscape.
- Screen 3: the product on phone, Mac, iPad and Watch, filled with believable life ("Marc's birthday", "Vacation in Rome", "Throw Party for Eve").
- The icon comes back at the bottom, huge and cropped by the section edge: the made object bookends the page and bridges sections.
- Every section heading carries its own small crafted colour icon (not emoji).
- Proof: press quotes with the key phrase underlined, award ribbons, an award plate ringed by tiny top-down drawn people.
- Principle: one crafted object, repeated at different scales, is enough identity for a whole page; the rest is the real product, shown large.

## Todoist (todoist.com) — 7,140px captured (15,700px when fully lazy-loaded), 201 images, 9 videos, 131 SVGs, fonts Graphik + Inter + Shantell Sans (a handwriting face)
- Hero (A/B variant "Clarity, finally."): headline left, a real desktop app with a phone overlapping it on a soft peach panel. The phone shows the quick-add line "Write agenda for Monday's meeting tomorrow #Website Update +Paul" with **each parsed token highlighted in colour inside the input**. Their magic moment (our exact mechanism) is visible in the first screen, inside the real product.
- Proof right under the hero: "347K+ ★★★★★ reviews", press quotes in an italic serif with outlet logos (The Verge, PC Mag, TechRadar).
- Light decoration with a job: thin green wave lines and small floating 3D "+" and check bubbles that echo the product's own icons.
- Feature rhythm: coloured kicker ("Clear your mind", "Plan with confidence"), heading, paragraph on the left; a live product panel on the right on a soft gradient (voice capture with a moving waveform, a week calendar with a red "now" line at 12:09 PM).
- A hand-drawn blob character ("What's Todoist?") fronts the intro video: one human-made drawing in a page of product UI.
- Trust with a precise live number: "We've been building Todoist for 19 years and 289 days", next to 3D-illustrated stat objects (a green arrow growing a flower: "30+ million app downloads").
- Footer: a full site map in five columns, a one-line restatement of the product, language picker.
- Principle: show the mechanism working inside the product (tokens light up as they are understood), and back trust with one precise, ticking number.

## Superlist (superlist.com) — 8,119px, 12 images, 1 video, 29 SVGs, built in Framer (452 Framer nodes), 8 running animations; fonts Haffer XH (display), Inter, Satoshi
- Today the site is dark (an earlier visit showed a light variant: they test). Hero: two-line headline, second line in brand red ("Tasks, notes, and plans. / Finally in one app."), one sentence ending "From the creators of Wunderlist", one pill button. The product image below the fold loads late (lazy, animated in).
- The product sits on a blurred, grainy colour field (red to violet), so the screenshot glows without a "glow effect".
- Two-tone statements everywhere: a white sentence followed by a grey continuation ("Stop juggling five different apps. / Superlist makes it simple to manage your entire life.").
- Auto-advancing feature tabs: three items with a vertical progress bar on the left; a phone on a saturated blue panel on the right shows the item, with a real photo inside the app.
- A small custom glyph above each section (a red tick, three coloured pill strokes) acts as the section's icon.
- A scroll-driven type list: "Real-time collaboration / Repeatable tasks / Offline Support / Widgets …" in huge type; the line in focus is white, the rest fade to grey as you scroll.
- Final call to action floats over a masonry wall of real app-store reviews (name and store under each) that fades into the dark; a hand-drawn arrow points from The Verge logo.
- Principle: let type itself move (lines light up as you scroll) and let real customer words become the texture behind the last button.

## TickTick (ticktick.com) — 12,396px, 71 images, 10 videos, fonts Inter + Georgia
- The category default, played straight: centred headline ("Stay Organized, Stay Creative."), two buttons, a large real app screenshot rising from the fold on a pale blue-green wash.
- Features as big white rounded cards: a blue kicker ("Calendar Views"), a heading, a check-mark bullet list, and a demo video on the other half (videos did not render in headless; the halves were blank).
- A solid blue download band; "Recommended by top media" as a slightly fanned stack of quote cards (MKBHD on top).
- Anti-reference: clean and complete, but nothing on it belongs only to TickTick. This is the page our rebuild must clearly beat.

## Sunsama (sunsama.com) — 11,806px, 196 images, fonts DM Sans only
- Hero: an award badge ("Named Best Scheduling Tool by Wirecutter"), a three-beat headline ("Start Calm. / Stay Focused. / End Confident."), one paragraph, an orange pill button with "14-day free trial / No credit card required" beside it; a warm peach blur fills the right side behind the (late-loading) product.
- Logo marquee (MIT, Y Combinator, The New York Times, Loom, Zapier) moving under the hero.
- Pain before product: "Work is f***ing chaotic" with an emoji tile and three red-x lines ("Always on, working late, never done").
- The page is organised as one working day: a thin vertical line on the left runs through the sections ("Start each day with clarity" → "Work through your day" → "End work on time, without guilt"); a key word in each heading is orange ("clarity").
- Under each chapter, three small cards with one sentence each and a product animation (blank in headless).
- Principle: tell the product as one day in the user's life, joined by a visible line, and name the pain in the user's own blunt words before the cure.

## Tweek (tweek.so) — the address opens the live app (843px), 37 images, font Suisse Intl
- No marketing page at all: the real week planner fills the screen ("November 2026 W46", days as columns with hairline rows), and a warm grey card floats over it with the pitch.
- The card: a black blob-bird mascot with two legs (the logo is a character), "Tweek is a minimal weekly planner & todo list app", "feels as natural as pen and paper", and a live line with a green dot: "50 810 tasks, 11 551 active users / 24h".
- The sample tasks in the week teach the product: "Hi, I'm Tweek! 👋", "Choose a color" (on a yellow highlight), "12:00 PM Set a time", "…to the next day". The demo data is the onboarding.
- Principle: the product itself is the page, and the sample content is written as the tutorial; a live number with a pulsing dot proves the product is alive right now.

## Structured (structured.app) — 16,401px, 139 images, 4 videos, 3 running animations, font Inter
- Hero: a full-bleed, sound-off film of real life (a sunlit café, someone knitting beside a laptop), a frosted pill nav floating over it, a scroll-down arrow. No headline over the film.
- Then the page is drenched in colour, one field per chapter (salmon, then blush pink), changing as you scroll.
- A handwritten word writes itself beside the heading ("with St…" mid-stroke) and a hand-drawn arrow points at the button: motion that looks made by a hand.
- Kinetic headline: "one planner, one timeline, / 99 appointments" (the last words change), light weight plus bold weight in one line.
- Phone demos: 3D icons (phone, alarm, palm tree) orbit and drop into the timeline; a typing demo shows letters being pressed on the phone keyboard.
- A giant reading paragraph with inline 3D icons ("visualize your day ☀ split it into tasks … build habits, reduce overwhelm 🪷 plan mobile or at home 🏠") fills in word by word as you scroll.
- Principle: motion carries the story (the background colour, the handwriting, the typing, the paragraph that fills as you read), and every chapter has its own full-screen colour.

## Microsoft To Do (microsoft.com/…/microsoft-to-do-list-app) — 6,332px, 34 images, font Segoe UI Variable
- Corporate template: left headline + "Download app / Open web app"; on the right, the product (Work list, Groceries list) floats in a frosted glass panel over a render of 3D green glass tiles, the one made asset.
- A sticky in-page tab bar (Overview, Features, Pricing, Resources, FAQ, Next steps) follows the scroll.
- Three icon features with a thick left rule, a stock photo of a man with a laptop, carousels of cards for other Microsoft apps.
- Anti-reference: a made 3D render cannot save a page that is otherwise interchangeable; the product shrinks to a thumbnail.

## Linear (linear.app) — 9,649px, 39 images, 243 SVGs, 545 running animations (the most of any site), fonts Inter Variable + Berkeley Mono
- Staged entrance: at 0.4 s the hero is empty black; by 4 s the headline, sub-line and a full app window have arrived. The page starts with a held breath, then the product.
- The product shows a live story, not a resting screen: a comment thread ("Right now we show a spinner forever…", "@Linear can you take a stab at this?"), "Linear moved from Todo to In Progress · just now", an agent panel "Worked for 10 sec".
- The demo uses the visitor's real clock: the chat times read 8:14 AM in this capture and 10:03 AM on an earlier visit. A typing caret sits in the reply box: "@Linear create issues and assign to me|".
- Two-tone statement ("A new species of product tool. / Purpose-built for modern teams…") and a small mono caption ("POWERING THE COMPANIES BUILDING THE FUTURE").
- Data drawn as art: a timeline of projects with diamond milestones and a dot-swarm chart ("Cycle time by agent") fading into the black.
- Feature index as expandable "+" lists; a changelog on a horizontal timeline with a red dot for the newest entry (the product is alive this week).
- Principle: the demo is a live scene (real clock, a caret mid-typing, "just now"), and the page reveals itself in a staged sequence rather than all at once.

## Raycast (raycast.com) — 15,936px, 124 images, 177 SVGs, 1 canvas, 30 running animations, fonts Inter + Geist Mono
- Staged hero: at 0.4 s only the headline ("Your shortcut to everything.") on black; by 4 s the brand art has bloomed behind it: grainy red diagonal light bars, the same diagonal as the logo. The same art returns just above the footer (bookend).
- A big product window (Clipboard History with real colour swatches, "Copied Today at 13:35", "Ctrl K" keycaps in the footer bar) above a dock of feature icons; picking an icon swaps the window.
- The keyboard is the made object: a dark 3D keyboard where some keys become feature tiles ("Fast. Think in milliseconds.", "Ergonomic. Keyboard First.", "Reliable. 99.8% crash-free rate.") among plain keys (esc, §, 1, 2, Z, X).
- Extension cards each glow in the extension's own colour (Linear violet, Translate blue with "Omelette du fromage" and Arabic text, Spotify green).
- Two-tone statements ("It's not about saving time. / It's about feeling like you're never wasting it.") and a mono kicker ("AI AGENT").
- Footer: six-column site map under the returning red streaks.
- Principle: the brand mark's own geometry becomes the hero art and the closing art; the product's core promise (keyboard) is drawn as a real object whose parts carry the message.

## Amie (amie.so) — 14,147px, 53 images, 69 SVGs, font Inter
- Badge row on top ("#1 Product of the Day", "App Store Featured" with laurels), a two-line headline, two buttons, a dated changelog line ("Sep 3: much better CPU, new recorder pill…") right above the product window.
- Under the logo strip: a hand-drawn curved arrow and a handwritten note "* These companies have 10+ Amie users": a human aside that also makes the proof precise.
- A huge statement led by one exact number on a grey highlight: "Within 47 seconds: Share summary. Keep CRM updated. Plan action items. Schedule next meeting."
- A greeting marquee in an italic serif ("こんにちは · Hei · Bonjour · Hallo · नमस्ते · Ciao · Xin chào") with the exact claim under it: "We speak 17 languages really well. And 82 more without speaker labeling."
- Proof as a real artefact: a green handwritten note "This is a real review we got" with a looping arrow points at an actual email card (From: Nish Budhraja, Subject: "Feedback - Loving the new Amie!").
- The product is annotated like a diagram: an orange label "Company Pages" with a leader line pointing into the window.
- FAQ accordion of real user questions ("I've already used my trial. Can I get another one?") above a quiet three-column footer.
- Principle: one precise number and one handwritten aside make big claims believable; proof is shown as the real object (the email), not paraphrased.

## Numbers side by side (1280px wide, fully scrolled)

| Site | Page height | Sections (h2/h3) | Images | Video | Running animations | Made asset |
|---|---|---|---|---|---|---|
| Structured | 16,401px | 20+ | 139 | 4 | 3 | real film, 3D icons, handwriting |
| Raycast | 15,936px | 16 | 124 | 0 | 30 | brand light streaks, 3D keyboard |
| Amie | 14,147px | 12+ | 53 | 0 | 2 | handwritten notes and arrows |
| TickTick | 12,396px | 15 | 71 | 10 | 0 | none (anti-reference) |
| Sunsama | 11,806px | 14 | 196 | 0 | 0 | warm blur, emoji tiles |
| Linear | 9,649px | 14 | 39 | 0 | 545 | data drawn as art, live scene |
| Superlist | 8,119px | 12 | 12 | 1 | 8 | grainy colour fields, review wall |
| Things | 8,106px | 15 | 37 | 1 | 0 | 3D app icon, every device |
| Todoist | 7,140px (15,700 full) | 25 | 201 | 9 | 1 | drawn character, 3D stat objects |
| Microsoft To Do | 6,332px | 10 | 34 | 0 | 1 | 3D glass render (anti-reference) |
| Tweek | the app itself | 1 | 37 | 0 | 1 | blob-bird mascot |
| **Tasks (ours, 2026-11-14)** | **3,632px** | **10 (5 real)** | **0** | **0** | **0** | **one small stamp** |
| **Tasks (ours, 2026-11-15, checkpoint 2)** | **12,568px** | **16 (13 sections)** | **0 photos, 16 drawn in code** | **0** | **10 scroll and view moments** | **hand-inked scenes, live demo, drawn keyboard** |

## What every strong page does (and ours does not)

1. **A long, paced story.** 8,000 to 16,000px and 12 or more sections. Ours ends after five short sections.
2. **One made object, repeated.** Things' icon, Raycast's red streaks, Kitchen's ink drawings, JetBrains' dithered photo, Cofounder's pixel art: it opens the page, bridges sections and closes it. Ours has a 96px stamp.
3. **The product working, live.** Todoist colours the parsed words inside the input; Linear uses the visitor's clock and a typing caret; Tweek's sample tasks are the tutorial; Coinbase shows prices in rupees. Ours shows static sample slips.
4. **Pain before cure.** Sunsama: "Work is f***ing chaotic" with three red-x lines; Ramp: "Systems that never spoke", a collage of scattered screens joined by dotted arrows. Ours goes straight to features.
5. **Motion with a job.** A staged entrance (Linear, Raycast), type that lights up as you scroll (Superlist, Structured), hand-made motion (handwriting that writes itself, drawn arrows), demos the visitor can switch (Raycast's dock, Superlist's auto-tabs). Ours: nothing moves at rest.
6. **A human hand.** Handwritten asides with drawn arrows (Amie "This is a real review we got", Structured, Superlist), a drawn character (Todoist), ink people (Kitchen). Ours has no trace of a person.
7. **Precise, dated proof.** "19 years and 289 days", "11 551 active users / 24h", "Within 47 seconds", "Based on data from March 2025". We have no users yet, so our honest proof is the product itself plus dated facts (last update, changelog).
8. **Two-tone headlines.** A statement, then a payoff in grey or a brand colour (Superlist, Linear, Raycast, Ramp, Zapier).
9. **A real close and a real footer.** The final call repeats the first and bookends the opening art (Raycast, Things, Figma's full-width button); the footer is a site map.
10. **Anti-references** (TickTick, Microsoft To Do): clean, complete and forgettable. Correctness without a made object, a live demo or motion reads as a template.

## What we can and cannot borrow

- Can: structure, pacing, motion grammar, the live-demo idea, handwritten asides, pain-first collage, scroll-lit type, a closing bookend, an FAQ, a full footer. All rebuilt in our own postal world.
- Cannot: their art, type, layouts or copy; any user numbers or reviews (we have none, and we never invent them); a drawn human face in code (it would look stiff), so our art stays with objects: slips, stamps, envelopes, a letterbox, a mail chute, keys.
