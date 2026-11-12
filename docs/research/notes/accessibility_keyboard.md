# Accessibility and keyboard-first use in personal to-do apps (2024-2026)

Research date: 2026-11-12. Time-boxed, breadth first. Reddit and AppleVis pages were partly blocked; where only a search snippet was seen, it is labelled "snippet".

## 1. How accessible are the leaders for screen-reader and keyboard-only users?

### Takeaway
Only two leaders publish formal accessibility evidence: Google (a Tasks web conformance report, December 2024, with many "Partially Supports" items, keyboard among them) and Microsoft (a full set of screen-reader guides for To Do on 5 platforms). Todoist, TickTick, Things and Any.do publish no accessibility statement or VPAT that I could find. Community reports say Todoist is good on iPhone but weaker on desktop and web.

### Cited Findings
- **Google Tasks (web) ACR/VPAT, dated 17 December 2024.** Tested with Chrome + NVDA, axe DevTools Pro and Color Contrast Analyser, against WCAG 2.0/2.1 A and AA. — [Google Tasks ACR (PDF)](https://services.google.com/fh/files/misc/google_tasks_vpat.pdf), listed on [Google Accessibility Conformance Reports](https://accessibility.google/accessibility-conformance-reports)
  - 2.1.1 Keyboard: "Partially Supports". Remark: multiple functions cannot be done with the keyboard only, on the "My Tasks Pop-Up" and "Landing Page". — same PDF
  - 2.1.2 No Keyboard Trap: "Supports". Focus visible: supported ("visually apparent which page element is currently receiving keyboard focus"). — same PDF
  - 4.1.2 Name, Role, Value: "Partially Supports". Checkbox/select state (checked/unchecked) is not exposed to assistive technology in the Calendar & Time widget. — same PDF
  - 1.4.1 / 1.3.1: colour is the only way to show "checked/pressed/selected" state in the My Tasks pop-up, Organize task, Repeat widget, Right navigation and Calendar & Time widget. — same PDF
  - Also "Partially Supports": 1.4.3 Contrast (hover/focus label contrast under 4.5:1), 1.4.10 Reflow, 1.4.13 Content on Hover or Focus, 2.2.1 Timing Adjustable, 2.4.4 Link Purpose, 2.5.3 Label in Name, 3.3.2 Labels or Instructions; several buttons share the same programmatic label with different functions. Functional criteria "Usage without vision", "with limited vision" and "with limited cognition" are all "Partially". — same PDF
- **Microsoft To Do.** Microsoft publishes a "Screen reader support for Microsoft To Do" hub with task-level guides (lists, tasks, moving tasks, steps, importance, Planned list) for Windows, macOS, iOS, Android and Web; it names Narrator, JAWS, NVDA. Page undated (live in 2026). — [Microsoft Support](https://support.microsoft.com/en-us/accessibility/todo/screen-reader-support-for-microsoft-to-do)
  - r/Blind user (snippet, date UNKNOWN): Microsoft To Do is accessible on iOS and Android. — [r/Blind "Making to-do lists and following them"](https://www.reddit.com/r/Blind/) (snippet from Google results; thread URL hidden by redirect)
- **Todoist.** No accessibility statement, WCAG claim or VPAT found on todoist.com (search of help center returned none). — [Todoist Help Center search result](https://www.todoist.com/help)
  - AppleVis, 24 Nov 2021 (older item): long-time user says the iPhone app is "fully accessible on the phone"; uses Magic Tap to jump to Quick Add; notes desktop and web "have some work to go". — [AppleVis: Todoist & VoiceOver?](https://www.applevis.com/forum/ios-ipados/todoist-voiceover)
  - r/Blind user (snippet, date UNKNOWN): Todoist is "Completely accessible, extremely flexible and powerful". — [r/Blind "Maintaining a to-do list"](https://www.reddit.com/r/Blind/) (snippet; thread URL hidden by redirect)
  - Living Blindfully podcast episode 290 includes a Todoist review with VoiceOver on iOS (content not retrieved). — [Living Blindfully](https://livingblindfully.com/?p=41402)
- **TickTick, Things 3, Any.do.** I found no accessibility statement, VPAT, AppleVis review or bug thread for any of these in the time box. Searches on AppleVis and Reddit returned only unrelated results. — [search: "applevis TickTick accessibility VoiceOver"](https://applevis.com/blog/apple-vision-accessibility-2025-applevis-report-card) (returned only the general report card)
- **Apple Reminders.** Recommended by a blind AppleVis user in Dec 2025 as a built-in, shareable list app usable with Siri. — [AppleVis thread, 13-14 Dec 2025](https://www.applevis.com/forum/ios-ipados/what-easiest-learn-easiest-use-do-list-app-sharing-family-members)
- **Platform context (Apple).** AppleVis 2025 Report Card (published 17 Mar 2026): VoiceOver user experience on macOS rated C (3.1), iOS B (4.0); Apple's bug-fixing rated C (3.0), the lowest score. Users report "long-standing accessibility bugs" as the main theme; Liquid Glass hurt many low-vision users. — [AppleVis 2025 Report Card](https://applevis.com/blog/apple-vision-accessibility-2025-applevis-report-card)
- **Third-party app failures are common.** Dec 2025 r/Blind post: the Finch habit/to-do app became inaccessible "despite many requests and complaints"; Habitica on TalkBack has "a huge unlabeled button". — [r/Blind, Dec 2025](https://www.reddit.com/r/Blind/comments/1peccu6/suggestions_for_a_100_blind_accessible_todohabits/)
- **General web baseline.** WebAIM Million 2026 (Feb 2026 data, published 30 Mar 2026): 95.9% of top 1M home pages had detected WCAG 2 failures (up from 94.8% in 2025); average 56.1 errors per page; empty buttons on 30.6% of pages; pages with ARIA had more errors (59.1) than pages without (42). — [WebAIM Million 2026](https://webaim.org/projects/million/)

### Inferences
- The bar is low and visible. Google's own to-do app (web) fails parts of keyboard, state and label criteria. A new web app that passes WCAG 2.2 AA with a published conformance report would be ahead of every leader on paper.
- Native mobile apps (Todoist iOS, Microsoft To Do, Apple Reminders) get the best community reports. The web and desktop versions get the weakest. That is where a web-first app can compete.
- Checkbox state, colour-only state and unlabeled icon buttons are the concrete failure points to design against; they map directly to the core to-do UI (complete checkbox, priority colour, icon toolbar).

### Gaps
- No VPAT/ACR found for Todoist, TickTick, Things, Any.do, Microsoft To Do (Microsoft has an ACR library, but I did not confirm a To Do-specific report), or Apple Reminders.
- No 2025-2026 hands-on screen-reader reviews of TickTick, Things 3 or Any.do found. Status: UNKNOWN.
- No NFB or RNIB to-do app recommendation found in the time box.
- JAWS/NVDA-specific results for Todoist web: UNKNOWN beyond the 2021 "some work to go" comment.

## 2. What do blind and low-vision users recommend?

### Takeaway
Blind users mostly recommend simple, stable list apps over feature-rich ones: Apple Reminders (built-in, Siri), AnyList, Todoist (iOS), Microsoft To Do, and Google Keep. The repeated value is "works with VoiceOver and stays working", not features.

### Cited Findings
- AppleVis, 13 Dec 2025: blind user with sighted spouse asks for "simple, accessible, easy to learn" shared lists. Replies: AnyList ("found no problems with the app as far as accessibility") and built-in Reminders with Siri and sharing. — [AppleVis thread](https://www.applevis.com/forum/ios-ipados/what-easiest-learn-easiest-use-do-list-app-sharing-family-members)
- r/Blind, approx. Oct 2024 (snippet): user "highly recommend[s] ANYlist", using it daily for years. — [r/Blind: Accessible apps for time management](https://www.reddit.com/r/Blind/comments/1fy8t7x/accessible_apps_and_programs_for_time_management/)
- r/Blind (snippets, dates UNKNOWN): Todoist "completely accessible"; Microsoft To Do accessible on iOS and Android; Google Keep suggested for a blind friend; a low-vision user uses iOS Reminders with Siri plus Alexa reminders. — [Google results for site:reddit.com r/Blind to do list app accessible](https://www.reddit.com/r/Blind/)
- r/Blind, Dec 2025: after Finch became inaccessible, a couple looks for a "100% blind accessible" to-do/habit app. — [r/Blind](https://www.reddit.com/r/Blind/comments/1peccu6/suggestions_for_a_100_blind_accessible_todohabits/)
- NotePlan feedback board: a blind user reports unlabeled sidebar items and a button read only as "gear", but says the app is ahead of many productivity tools. Date UNKNOWN. — [NotePlan feedback](https://feedback.noteplan.co/board/p/voiceover-quality-of-life-improvements-and-navigation)

### Inferences
- Trust is fragile: one update can make an app unusable (Finch). An accessibility regression test suite and a public accessibility statement would address a real fear.
- Shared lists with sighted family members come up often. Shared-list accessibility is a concrete use case.
- Voice capture (Siri, dictation, Magic Tap into Quick Add) matters to this group; a web app should support fast keyboard-only capture and work well with OS dictation.

### Gaps
- No quantitative ranking of to-do apps by blind users (for example, AppleVis Golden Apples did not name a to-do app in 2025). — [AppleVis 2025 Golden Apples nominees](https://www.applevis.com/blog/closed-applevis-announces-nominees-2025-applevis-golden-apple-awards-cast-your-vote-now)
- Windows/NVDA/JAWS users' to-do preferences: UNKNOWN.

## 3. How strong is the keyboard-first audience?

### Takeaway
Keyboard-first is a real, vocal niche among developers and power users. Todoist already ships a large shortcut set and a Cmd/Ctrl+K Quick Find, so "has shortcuts" is not a differentiator. "Feels built for the keyboard" (every action, instant, customizable) still is, based on HN reactions to Godspeed.

### Cited Findings
- Todoist shortcut docs (updated 11 Nov 2026): single-key shortcuts (Q quick add, E complete, T date, J/K move focus), G-then-X navigation, Cmd/Ctrl+K Quick Find, "?" shortcut list, global Quick Add (Option+Space / Ctrl+Space). Shortcuts only support QWERTY and QWERTZ; indent shortcuts need dedicated [ ] keys, which "many non-English layouts" lack. — [Todoist: Use keyboard shortcuts](https://www.todoist.com/help/articles/use-keyboard-shortcuts-in-todoist-Wyovn2)
- Show HN: Godspeed, 19 Mar 2024 (older item): "100% keyboard oriented" todo app for Mac, with a "hardcore mode" that disables the mouse; 328 points, 223 comments. — [Hacker News](https://news.ycombinator.com/item?id=39756325)
  - A Vim user said Todoist's shortcuts felt "built first for mouse-use", while Godspeed felt very different. — same thread
  - A Things user complained date picking was a mouse operation and wanted command palettes; others replied Things has Cmd+Shift+D. — same thread
- HN profile (date UNKNOWN) lists a "keyboard-first todo app" with MCP servers for Claude Code/Cursor, showing the pattern still appears in new indie apps. — [HN profile: 4esop](https://news.ycombinator.com/user?id=4esop)
- Command palettes (Cmd+K) are described as a spreading SaaS pattern popularised by Linear; sources are blogs and Linear marketing, with no measured productivity data. — [DEV: Cmd+K is the new hamburger menu](https://dev.to/thekitbase/cmdk-is-the-new-hamburger-menu-why-command-palettes-are-taking-over-saas-81d); [Linear: features](https://linear.app/features/level-up); [Intercom on Product: keyboard-first generation](https://www.intercom.com/blog/?p=21282) (date UNKNOWN)
- WebAIM SR Survey #10 ranks "lack of keyboard accessibility" as the 5th most problematic item for screen-reader users. — [WebAIM Survey #10](https://webaim.org/projects/screenreadersurvey10/)

### Inferences
- Keyboard-first and screen-reader access overlap: a full keyboard model (roving focus, predictable shortcuts, no hover-only actions) serves both groups. Building the two together is cheaper than building them apart.
- Todoist's QWERTY/QWERTZ-only limit and its [ ] indent keys are a gap: layout-independent shortcuts are a small, concrete differentiator.
- Keyboard-first alone is a niche (devs, Mac power users) and is already contested by Todoist, Things, Godspeed and others. It works better as a quality bar than as the headline.

### Gaps
- Size of the keyboard-only or keyboard-preferring audience: UNKNOWN. I found no survey that measures it for productivity apps.
- No usage data on how many Todoist users use shortcuts. UNKNOWN.

## 4. ADHD and to-do apps

### Takeaway
ADHD users ask for low friction, visible progress, time help and, above all, no shame spiral from overdue piles. Recommended apps are TickTick, Amazing Marvin, Sunsama, Twos, Finch and Things 3. Most "best ADHD app" content is vendor marketing, so evidence is weak.

### Cited Findings
- Zapier (Jamie Irish, first published Mar 2023, updated May 2025) picks Amazing Marvin (procrastination warnings, "task jar", rewards), TickTick (Pomodoro, Eisenhower matrix, daily summary), Sunsama (guided daily planning; setup hard for people with time blindness), Twos (unfinished tasks roll over), Finch (gamified self-care). Criteria: simplicity, adaptability, time management, celebrating accomplishment. — [Zapier: 5 to-do list apps that actually work with ADHD](https://zapier.com/blog/adhd-to-do-list/)
- r/ADHD, 17 Feb 2025: user calls TickTick the "Best To-do list app imo" (premium), alongside Forest, Routinery and app blockers. — [r/ADHD: What are apps that actually help you](https://www.redditmedia.com/r/ADHD/comments/1ir83y9/what_are_apps_that_actually_help_you_and_why/)
- r/adhdwomen, Jul 2023 (older item): user describes a "fear-freeze-shame cycle" once tasks are overdue. — [r/adhdwomen](https://www.redditmedia.com/r/adhdwomen/comments/14w20cf/unable_to_complete_tasks_once_theyre_overdue_and/)
- Several 2025-2026 blogs say red overdue badges create a shame loop that makes users stop opening the app, and suggest roll-forward without penalty, no streak penalties, and "Today" views that hide the backlog. These are vendor or affiliate pages (for example Inflow, Saner, Mutra, Composed, Any.do) with unlinked anecdotes; treat as low confidence. — [Inflow: Todoist alternatives for ADHD](https://www.getinflow.io/post/best-alternatives-todoist-adhd); [ikoi: todo apps don't work for ADHD](https://ikoi.pages.dev/blog/todo-apps-dont-work-for-adhd); [Brightmind: ADHD task pile-up, Sep 2026](https://brightmind.club/blog/adhd-task-pileup); [Any.do blog](https://www.any.do/blog/the-best-to-do-list-app-for-adhd-how-to-stay-organized-when-your-brain-fights-structure/)
- A Jul 2026 YouTube video title, "The Red Overdue Tasks Dilemma in Todoist", shows the overdue pile is a known Todoist pain. — [Bing video result](https://www.bing.com/videos/) (title only seen)
- Todoist markets itself to ADHD users through a customer story. — [Todoist Inspiration: Managing ADHD](https://www.todoist.com/inspiration/managing-adhd-todoist)
- Other overlap: WebAIM SR Survey #10 found 5.2% of screen-reader respondents report a cognitive or learning disability. — [WebAIM Survey #10](https://webaim.org/projects/screenreadersurvey10/)
- Google Tasks ACR rates "Usage with limited cognition" as only "Partially" supported. — [Google Tasks ACR (PDF)](https://services.google.com/fh/files/misc/google_tasks_vpat.pdf)

### Inferences
- The strongest ADHD design levers are cheap: one-key capture, auto roll-forward or a gentle "stale" signal in place of red overdue counts, a "today only" default view, and visible completion feedback.
- ADHD needs (low clutter, predictable layout, no time pressure, plain language) overlap with WCAG cognitive guidance and with keyboard-first speed. One coherent "calm, fast, accessible" position can serve all three groups.

### Gaps
- No peer-reviewed study on to-do app features for adults with ADHD was found in the time box.
- Direct r/ADHD threads from 2025-2026 on overdue guilt were not retrieved (Reddit blocked); the claims rest mainly on blogs.

## 5. Audience size data

### Takeaway
The audiences are large in total but the paying, to-do-specific slice is UNKNOWN. Adult ADHD is about 6% of U.S. adults; about 16% of people worldwide have a significant disability.

### Cited Findings
- 15.5 million U.S. adults (6.0%) reported a current ADHD diagnosis in 2023; about half were diagnosed in adulthood. — [CDC MMWR, 10 Oct 2024](https://www.cdc.gov/mmwr/volumes/73/wr/mm7340a1.htm); [CHADD summary](https://chadd.org/about-adhd/general-prevalence-adults/)
- About 1.3 billion people, 16% of the world population, have a significant disability. — [WHO fact sheet: Disability](https://www.who.int/news-room/fact-sheets/detail/disability-and-health)
- WebAIM Screen Reader User Survey #10 (Dec 2023-Jan 2024, 1,539 respondents): primary desktop screen reader JAWS 40.5%, NVDA 37.7%, VoiceOver 9.7%; 91.3% also use a mobile screen reader; mobile platform iOS 70.6%, Android 27.6%; 76.6% blind, 19.9% low vision; 58% prefer an app over a website for common tasks (up from 51.8% in 2021). Self-selected sample. — [WebAIM Survey #10](https://webaim.org/projects/screenreadersurvey10/); [Adrian Roselli on sample bias, Feb 2024](https://adrianroselli.com/2024/02/my-webaim-10th-sr-user-survey-takeaways.html)
- Top screen-reader barriers (same survey): CAPTCHA; menus/tabs/dialogs that do not behave as expected; unclear links/buttons; unexpected screen changes; lack of keyboard access. — [WebAIM Survey #10](https://webaim.org/projects/screenreadersurvey10/)

### Inferences
- For a web to-do app, desktop screen-reader users mostly use JAWS or NVDA on Windows with Chrome; test with NVDA + Chrome first, then VoiceOver + Safari.
- The 58% app preference means screen-reader users lean to native mobile apps; a web app must be clearly better on desktop to win them.

### Gaps
- Number of screen-reader users worldwide: UNKNOWN (no reliable count found).
- Share of any to-do app's users who are disabled, keyboard-only or ADHD: UNKNOWN.
- No 2025-2026 WebAIM screen-reader survey (#11) was found; #10 (2024) is the latest seen.
