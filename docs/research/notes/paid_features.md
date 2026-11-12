# Paid-only features in leading personal to-do apps (November 2026)

All live pages checked 2026-11-12 unless marked otherwise. "Search summary" means the fact came from a search-engine summary of the named official page, not from a direct fetch. Treat those as slightly weaker.

## Todoist Pro and Business: every Pro-only / Business-only feature and the free-tier (Beginner) limits

### Takeaway
Todoist Beginner (free) caps the account at 5 personal projects, 3 filters, 1 week of activity history, 5 MB uploads, 4 themes and 10 AI capture sessions a month. Pro (US$5/mo yearly) unlocks calendar and table layouts, task duration, custom and location reminders, deadlines, auto backups, Task Assist and Email Assist. Business adds team workspaces, team projects, shared templates and team filters.

### Cited Findings
Prices
- Beginner US$0; Pro US$5/mo billed yearly (US$60/yr) or US$7/mo monthly; Business US$8/user/mo yearly or US$10/user/mo monthly — [Todoist pricing, checked 2026-11-12](https://todoist.com/pricing)

Pricing-page comparison table (Beginner / Pro / Business) — [Todoist pricing, checked 2026-11-12](https://todoist.com/pricing)
- Personal projects: 5 / 300 / "300 for each member"
- Custom filters: 3 / 150 / 150 per member
- Task reminders (automatic): all plans
- Custom reminders: Pro and Business only
- File upload size: 5 MB / 100 MB / 100 MB
- Activity ("reporting") history: 1 week / Full / Full
- Calendar layout: Pro and Business only
- Table layout: Pro and Business only
- Board layout: free; Pro row reads "In label, filter, and personal project views"; Business row "In team projects, too"
- Task duration: Pro and Business only
- Deadlines: listed among Pro plan features; not listed for Beginner
- Collaborators per personal project: 5 on every plan (Pro does not raise it)
- Team workspace, team members/guests (1,000 / 1,000), team projects (up to 500), 250 people per team project, custom team filters (150): Business only
- Templates: all plans; shared (team) templates: Business
- Themes: 4 / 8 / 8
- Filter Assist (AI): all plans
- Task Assist (AI): Pro and Business only
- Email Assist (AI): Pro and Business only
- Ramble (AI voice capture): "Limited sessions" / Unlimited / Unlimited
- Auto backups: Pro and Business only

Help-center usage limits — [Usage limits in Todoist, checked 2026-11-12](https://www.todoist.com/help/todoist/get-started/usage-limits-in-todoist-e5rcSY)
- All plans: 300 active tasks per project (sub-tasks and recurring included), 20 sections per project, 500 active projects total, 500 labels per account, 100 labels per task, 1 file per comment, 100 templates.
- Beginner vs Pro: 5 vs 300 personal projects (sub-projects count); 3 vs 150 filters; 700 automatic reminders on both; custom reminders not available vs 700 (shared with automatic); activity history 1 week vs full; email attachment size 5 MB vs 25 MB.
- Task Capture Assist + Ramble: Beginner (and "Pro Legacy") 10 sessions per month, shared, reset on the 1st (UTC); only sessions that create at least one task count. Pro and Business: unlimited, fair use.
- Team side: Beginner team workspace 5 team projects, 3 team filters, 1-week team history, 5 MB comment attachments; Business up to 500 team projects, 150 team filters, full history, 100 MB.

Reminders detail — [Introduction to reminders, checked 2026-11-12](https://www.todoist.com/help/articles/introduction-to-reminders-9PezfU)
- "If you're on Todoist Pro or Business, you can add multiple custom reminders."
- The `!` reminder shortcut in Quick Add is Pro/Business only.
- Urgent recurring reminders: "available on paid plans only."
- Location reminders are Pro/Business only and fire only on mobile — search summary of [Todoist help/plan pages](https://www.todoist.com/help/account-and-billing/plans/get-started-with-todoist-pro-K3fDksPPh), checked 2026-11-12.
- On Beginner, a deadline or duration dictated in Ramble is ignored — search summary of [Dictate to add tasks with Ramble](https://www.todoist.com/help/articles/dictate-to-add-tasks-with-ramble-P1Raq7vVF), checked 2026-11-12.

### Inferences
- Free Todoist keeps recurrence, labels, board view, templates, comments and automatic reminders. It paywalls planning views (calendar, table), time features (duration, deadlines), custom/location reminders, history depth, backups and most AI.
- Pro does not raise collaborators per project (5). So sharing is not really a Pro upsell; team workspaces are the Business upsell.

### Gaps
- Exact date of the last Todoist pricing change: UNKNOWN.
- Whether recurring tasks, comments and labels have any free-tier cap beyond the shared limits: no cap found; treated as free.
- Calendar sync (Google/Outlook) plan availability: not on the pricing page; UNKNOWN.
- "Pro Legacy" plan details beyond the 10-session Ramble cap: UNKNOWN.

## TickTick Premium: every Premium-only feature and free limits

### Takeaway
TickTick Premium costs US$49.99/year on the official page. Free gets 9 lists, 99 tasks per list, 2 reminders per task, 5 habits, list and Kanban views, and "Basic" calendar, Eisenhower matrix, themes, widgets and statistics. Premium-only: duration, constant reminders, checklist-item reminders, activity history, filters (custom smart lists), timeline view, integrations, email reminders and most AI features.

### Cited Findings
Source for all items: [TickTick upgrade page "Compare All Features", checked 2026-11-12](https://ticktick.com/about/upgrade). The table uses check and dash icons. I decoded them from the page HTML (check icon class `check_*`, dash icon class `dash_*`).
- Price: Free US$0; Premium US$49.99/year ("less than US$4.17/month").
- Free plan bullets: "9 Lists, 99 Tasks per list", "List & Kanban Views", NLP, task reminders, cross-platform sync.
- Premium bullets: "299 Lists, 999 Tasks per list", "Multiple Calendar Views", "Task Duration", "Email Reminder", "AI Features", "Themes".
- Numeric limits (Free / Premium): lists 9 / 299; tasks and notes 99 per list / 999 per list; attachments 1 per day / 199 per day; checklist items 19 per task / 199 per task; task reminders 2 / 5 (per task); members 2 / 29; habits 5 / 299; countdowns 5 / 299.
- Free AND Premium (check on both): priority, tag, subtask, recurring task, comment, template, MCP servers.
- Premium only (dash on free): duration, constant reminder, checklist item reminder, list/task activities (history), filter, AI Assistant, AI Voice Capture, Recording Summary, Timeline view, integrations.
- "Basic" free vs "Unlimited" Premium: calendar view, Eisenhower matrix, widgets, themes, statistics.
- After Premium expires, data is kept and the account falls back to free.

Older / secondary detail (to explain "Basic")
- Calendar has List, Month, Day, 3-Day and Week views. Free users get only the list view — [TickTick blog, Premium 101, dated 2020-10-30](https://blog.ticktick.com/2020/10/30/ticktick-premium-101/) (old; may be stale).
- Premium adds calendar subscriptions, custom smart lists, grid view, list activities on desktop and extra white-noise options — search summary of the same blog post and [crm.org review 2026](https://crm.org/news/ticktick-review). Secondary.
- Price conflict: some 2026 reviews still say US$35.99/year ([ClickUp review](https://clickup.com/learn/topic/task-management/tools/ticktick/)); the official page now says US$49.99/year. Official page wins.

### Inferences
- TickTick, unlike Any.do, keeps recurrence, tags, subtasks, comments and templates free. Its main paywall is capacity (lists, tasks, reminders, habits), planning views (calendar, timeline) and time features (duration).
- Pomodoro/focus timer is not a row in the table. "Statistics: Basic" probably covers focus and habit stats. Not confirmed.

### Gaps
- Pomodoro/focus timer limits and focus-statistics depth on free: UNKNOWN (not on the page).
- What exactly "Basic" means for themes, widgets, Eisenhower matrix and statistics in 2026: UNKNOWN beyond the 2020 blog.
- Whether "Email Reminder" is a separate row: only in the Premium bullet list, not in the table.

## Any.do Premium, Microsoft To Do, Things 3, Google Tasks

### Takeaway
Any.do is the most aggressive: even repeating tasks are Premium-only, along with location reminders, WhatsApp reminders, color tags, themes and AI. Microsoft To Do, Google Tasks and Things 3 have no in-app paywall; Things 3 is a one-time purchase per platform with free sync.

### Cited Findings
Any.do — [Any.do pricing, checked 2026-11-12](https://www.any.do/pricing)
- Personal (free): "Free Forever. No credit card." Tasks and lists, reminders, calendar, daily planner, sync across devices; FAQ says unlimited tasks, subtasks and grocery lists.
- Premium: US$4.99/mo billed yearly or US$7.99/mo monthly. Adds repeating tasks, WhatsApp reminders, AI-powered features, color tags, location reminders, custom backgrounds and themes.
- Family: US$8.33/mo yearly (US$9.99 monthly) for 4 fixed members. Adds a shared family space, shared grocery list and up to 4 shared projects.
- Teams: US$4.99/member/mo yearly (US$7.99 monthly). Adds a collaborative workspace, unlimited project boards, unlimited members, "100+ workflow templates", admin tools and permissions; 14-day free trial.
- No limits for uploads, reminder count or file size are on the page.

Microsoft To Do
- Personal task app on Android, iOS, Mac, Windows and web. Tasks sync through the Microsoft Tasks API and are stored in Exchange, so they show in Outlook Tasks — [Microsoft Support, What is Microsoft To Do, checked 2026-11-12](https://support.microsoft.com/office/490c1a8c-2333-4952-8125-841afadb9620)
- Work or school accounts need a To Do license and an Exchange Online mailbox. Licenses are included in most Microsoft 365 business subscriptions — same source.
- File attachments: all file types, up to 25 MB per task. Rolled out to all users in 2019 — search summary of [Microsoft Support, Add files to your tasks](https://support.microsoft.com/en-us/office/add-files-to-your-tasks-13cd5a6a-6d23-47c6-860d-3550404643c7) and [Windows Central, 2019](https://www.windowscentral.com/microsoft-do-file-attachments-now-available-everyone).
- Planner-assigned tasks and flagged Outlook email appear in To Do through Microsoft 365 integration — search summary of [IU IT Training guide](https://ittraining.iu.edu/explore-topics/titles/ms-todo/index.html). Secondary.

Things 3 — [Cultured Code store page, checked 2026-11-12](https://culturedcode.com/things/mac/store/)
- One-time purchase per platform (Mac, iPad, iPhone, Vision sold separately; Watch app comes with iPhone). No subscriptions. Sync "at no extra charge". 15-day free trial (Mac).
- Reported prices: Mac US$49.99, iPhone US$9.99, iPad US$19.99 — [toolguide.io](https://toolguide.io/en/tool/things-3/index.md) (secondary; official page links to App Store pricing only).
- Nothing inside the app is paywalled after purchase — inferred from "no subscriptions" on the official page; no in-app purchase mention found.

Google Tasks
- Free with every Google account and Workspace plan; no premium tier — search summary of 2026 reviews ([tasksboard review](https://tasksboard.com/blog/google-tasks-review), [toolguide.io](https://toolguide.io/en/tool/google-tasks/)). Secondary; no official Google pricing page exists for it.
- Has repeat (daily/weekly/monthly/yearly with end date or count), date-only deadlines and starred tasks — same secondary sources.

### Inferences
- Recurrence is the clearest "free in most, paid in one" feature: free in Todoist, TickTick, Microsoft To Do, Google Tasks and Things; paid in Any.do.
- Location reminders are paid in Todoist and Any.do.
- Microsoft To Do's only real "paid" link is organisational: Microsoft 365 work licensing and Planner/Outlook integration, not personal features.

### Gaps
- Microsoft To Do: whether any personal feature (for example Copilot in To Do) needs a paid Microsoft 365 Personal/Family plan: UNKNOWN. The product page timed out.
- Microsoft To Do: limits on lists, shared-list members and tasks: UNKNOWN.
- Any.do: free-tier limits on attachments, shared lists and integrations (Google Calendar, WhatsApp): UNKNOWN.
- Google Tasks: no official 2026 feature list found; facts are from reviews.

## Server-bound vs on-device: which paid features could run fully in a browser

### Takeaway
Most paywalled features are pure UI or local logic and can run on the device for free. Only sync, sharing/collaboration, email/WhatsApp/push delivery, cross-device AI, calendar subscriptions and third-party integrations truly need a server.

### Cited Findings
- No source states this split. This section is analysis. The features it classifies come from the cited findings above.

### Inferences
Inventory by category. Format: feature — apps that paywall it (free limit) — server needed?

Projects, lists, capacity
- More projects/lists — Todoist (5 personal projects), TickTick (9 lists) — on-device.
- More tasks per list — TickTick (99 per list) — on-device.
- More checklist items / subtasks — TickTick (19 per task) — on-device.

Reminders
- Multiple custom reminders, relative reminders — Todoist (automatic only on free) — on-device (Notifications API + service worker; browser must be open or PWA installed; true background push needs a server).
- More reminders per task — TickTick (2 per task) — on-device.
- Constant (nagging) reminders, checklist-item reminders — TickTick — on-device.
- Location reminders — Todoist, Any.do — on-device only on mobile native apps (geofencing). A web browser cannot geofence in the background. Effectively needs a native app, not a server.
- Email reminders — TickTick — server needed.
- WhatsApp reminders — Any.do — server needed.
- Urgent recurring reminders — Todoist — on-device.

Recurrence
- Repeating tasks — Any.do — on-device.

Views
- Calendar layout / multiple calendar views — Todoist, TickTick (list only on free per 2020 blog) — on-device.
- Table layout — Todoist — on-device.
- Timeline view — TickTick — on-device.
- Board in filter/label views — Todoist (personal projects only on free) — on-device.
- Eisenhower matrix (full) — TickTick ("Basic") — on-device.
- Calendar subscriptions (iCal feed in) — TickTick (secondary source) — needs network fetch; a CORS proxy or server for most feeds.

Filters and labels
- Custom filters — Todoist (3), TickTick (none) — on-device.
- Color tags — Any.do — on-device.

Time
- Task duration / time blocking — Todoist, TickTick — on-device.
- Deadlines — Todoist (not on free per pricing page) — on-device.

History and backup
- Full activity history — Todoist (1 week), TickTick (none) — on-device (local event log).
- Auto backups — Todoist — on-device (scheduled export to a file or OPFS); offsite copy needs a server or user cloud drive.

Files
- Larger / more uploads — Todoist (5 MB), TickTick (1 per day) — on-device storage (IndexedDB/OPFS) is free; syncing files across devices needs a server.

Sharing and collaboration
- More members per list — TickTick (2) — server needed.
- Team workspace, team projects, team filters, shared templates, admin roles — Todoist Business, Any.do Teams — server needed.
- Family shared space and shared grocery list — Any.do Family — server needed.

Themes, widgets, stats
- More themes — Todoist (4), TickTick ("Basic"), Any.do (none) — on-device.
- Widgets (full) — TickTick ("Basic") — OS widgets need native apps; not a server.
- Statistics (full) — TickTick ("Basic") — on-device.

Habits, focus
- More habits — TickTick (5) — on-device.
- More countdowns — TickTick (5) — on-device.
- Pomodoro/focus stats — TickTick (UNKNOWN limit) — on-device.

Templates
- Templates — free in Todoist and TickTick; Any.do Teams "100+ workflow templates" — on-device.

AI
- Task Assist, Email Assist — Todoist — server needed (LLM), unless a small on-device model is used (WebGPU), which is heavy.
- Ramble / voice capture — Todoist (10 per month), TickTick (Premium) — speech-to-text can run in the browser (Web Speech API, but Chrome sends audio to Google) or with a local model; parsing into tasks can be rule-based NLP on-device.
- AI assistant, recording summary — TickTick, Any.do — server needed for LLM quality.
- Email-to-task (Email Assist) — Todoist — server needed (inbound mail).

Integrations
- Integrations — TickTick (Premium), Any.do (imports for paid members) — server needed for OAuth and webhooks; plain file import/export is on-device.

Sync
- Cross-device sync — free in all six apps — server needed (or peer-to-peer / user-owned storage).

### Gaps
- No source compares the cost of running these features; server-cost judgements are analysis only.
- Browser limits for background notifications differ by browser and OS; not researched here.
