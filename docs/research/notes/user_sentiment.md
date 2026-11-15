# User Sentiment: Personal To-Do / Task Manager Apps (2024-2026)

Research date: 2026-11-12. Breadth-first, time-boxed pass.

Source-quality legend (applies to every section):
- PRIMARY = the original discussion or data (Hacker News thread, vendor help page, forum thread, peer-reviewed paper).
- SECONDARY = journalist or reviewer article.
- VENDOR/AGGREGATOR = content from a competing app maker or an AI review-summary site. Treat its numbers and framing with caution.
- Many Reddit threads could not be fetched directly. Reddit evidence below comes from mirrors, aggregators, or second-hand quotes, and is marked as such.

## Top recurring complaints, and which apps are named

### Takeaway
The best-evidenced complaints are (1) subscription price rises and paywalled features (Todoist Dec 2025, TickTick, Any.do), (2) sync failures and data loss (Microsoft To Do, Any.do, TickTick, Notion), (3) slow or heavy apps and feature bloat (Notion, TickTick), and (4) forced accounts / cloud lock-in. I found only weak evidence for "AI features nobody asked for". The common pattern is a price rise, a smaller free tier, or a forced account.

### Cited Findings

**1. Subscription price and paywalls (strongest signal, 2025-2026)**
- Todoist raised Pro on 10 Dec 2025: monthly $5 to $7 (+40%), yearly $48 to $60 (+25%). It was the first rise since 2022. Legacy users (signed up before June 2022) do not pay more but lose new features. SECONDARY, 14 Nov 2025 — [Android Authority](https://www.androidauthority.com/best-todoist-alternatives-3615857/)
- Android Authority reader poll "Will you move to a competing app because of the price hike?": 71% Yes, 18% still thinking, 11% No, 184 votes when fetched 2026-11-12. An earlier search snapshot showed 177 votes. Self-selected, not representative. — [Android Authority](https://www.androidauthority.com/best-todoist-alternatives-3615857/)
- The author called the rise "too big for a task management app." — [Android Authority, Nov 2025](https://www.androidauthority.com/best-todoist-alternatives-3615857/)
- Todoist's official reason: long-term sustainability and new features. PRIMARY (vendor help page), 2025 — [Todoist Help: Pro pricing update 2025](https://www.todoist.com/ko/help/articles/todoist-pricing-and-plans-update-2025-everything-you-need-to-know-Tn6Pg1JKI)
- A review says the rise, plus removal of regional pricing in some countries, hurt long-time user goodwill. It also says no flagship feature came with the rise. SECONDARY/VENDOR, 2026 — [Saner.ai Todoist review](https://blog.saner.ai/todoist-review/)
- Review analysis of App Store and Google Play 1-3 star reviews of Notion, Todoist, Trello, Obsidian, TickTick, Any.do and Microsoft To Do: "Pricing and subscription changes" = 18% of negative reviews (rank 2). TickTick and Todoist are named. Sample is "thousands", with no exact count and no collection window. VENDOR/AGGREGATOR, 31 Mar 2026 — [Unstar.app](https://unstar.app/blog/productivity-app-reviews-what-power-users-complain-about-2026)
- Example quote in that analysis: "$10/month for a to-do list app is insane". — [Unstar.app, Mar 2026](https://unstar.app/blog/productivity-app-reviews-what-power-users-complain-about-2026)
- Long-time Todoist/TickTick users say they downloaded the app for natural-language input and later found it behind Premium. Users accept a price, but "feel betrayed" when it rises while the free tier shrinks. VENDOR/AGGREGATOR, 2026 — [Unstar.app ranking](https://unstar.app/blog/todoist-ticktick-things-3-microsoft-todo-apple-reminders-todo-apps-ranked-2026)
- TickTick moved calendar view, custom themes and Siri integration behind Premium (claim from aggregator, not verified against TickTick docs). 2026 — [Unstar.app ranking](https://unstar.app/blog/todoist-ticktick-things-3-microsoft-todo-apple-reminders-todo-apps-ranked-2026)
- Any.do: Capterra reviewers say recurring tasks and collaboration are locked behind paid plans, and subscription prompts irritate. A Trustpilot review (cited second-hand) reports an unused annual charge with a refused refund. 2025-2026 — [Capterra Any.do reviews](https://www.capterra.com/p/173614/Any-do/reviews?page=4); [checkthat.ai Any.do pricing](https://checkthat.ai/brands/any-do/pricing)
- Hacker News (Aug 2025): a small number of comments (~2 in the sampled part) raise price. Privacy and lock-in come up more often. PRIMARY — [HN 44864134](https://news.ycombinator.com/item?id=44864134)

**2. Sync failures and data loss**
- Unstar analysis: "Sync issues and data loss" = 15% of negative reviews (rank 3). It names Obsidian Sync, and Notion and Any.do as cloud-first apps with more sync complaints. VENDOR/AGGREGATOR, Mar 2026 — [Unstar.app](https://unstar.app/blog/productivity-app-reviews-what-power-users-complain-about-2026)
- Microsoft To Do: several Microsoft Tech Community threads from Aug-Sep 2025 report one-way sync on shared lists (since about mid-Aug 2025), stalled "Synchronization in progress", Android "Unable to Sync", and list order that does not sync. Workarounds (sign out, re-add account) help only for a short time. PRIMARY — [Synchronization issue thread](https://techcommunity.microsoft.com/discussions/to-do/synchronization-issue/4445162); [List order not syncing](https://techcommunity.microsoft.com/discussions/to-do/list-order-not-syncing-between-devices/4461221/replies/4467784); [Outlook web vs mobile sync failure](https://techcommunity.microsoft.com/discussions/to-do/tasks-sync-failure---outlook-web-vs-mobile-outlook-vs-desktop-outlook/4532616)
- Microsoft To Do: a post dated Aug 2026 reports Graph API 500 errors on the task-list endpoint, with no replies. PRIMARY — [Tech Community](https://techcommunity.microsoft.com/discussions/to-do/microsoft-to-do-sync-broken-%E2%80%94-graph-api-returns-500-internal-server-error-on-met/4547540)
- Any.do: an AI review-summary site lists "Data Loss and Account Forced Login" as a common complaint. A user says reminders vanished after the app made them register. Methodology not verifiable (page returned 403 on fetch). VENDOR/AGGREGATOR, Apr 2026 — [marlvel.ai Any.do](https://marlvel.ai/apps/any-do-to-do-list-planner)
- TickTick: one comparison blog says device sync lags 30-120 s; another edition of the same article says 30-90 s. Treat as unreliable. Another review says Google Calendar sync can lag minutes and sometimes fails silently. VENDOR/AGGREGATOR, 2026 — [Unstar.app ranking](https://unstar.app/blog/todoist-ticktick-things-3-microsoft-todo-apple-reminders-todo-apps-ranked-2026); [Lifestack TickTick review](https://lifestack.ai/blog/ticktick-review)
- TickTick: Trustpilot reviewers praise support, but a small subset report sync hiccups (second-hand). — [Doolpa TickTick review](https://doolpa.com/article/ticktick)
- Plain-text users have sync problems too: one HN user had "issues with syncing when my file was concurrently edited". PRIMARY, Aug 2025 — [HN 44864134](https://news.ycombinator.com/item?id=44864134)

**3. Performance, slowness, feature bloat, complexity**
- Unstar analysis: "Performance and speed" = 21% of negative reviews (rank 1, mostly Notion). "Complexity and learning curve" = 6% (Notion, compared with Todoist and Microsoft To Do). "UI/UX changes" = 12% (Trello, Todoist). VENDOR/AGGREGATOR, Mar 2026 — [Unstar.app](https://unstar.app/blog/productivity-app-reviews-what-power-users-complain-about-2026)
- Example quotes there: "Notion takes 8 seconds to open a page"; "The old design was perfect, who asked for this?" — [Unstar.app](https://unstar.app/blog/productivity-app-reviews-what-power-users-complain-about-2026)
- TickTick bloat: a long-time Todoist user who tried it said it had "too many features that were just distracting side quests" (second-hand). — [Doolpa](https://doolpa.com/article/ticktick)
- HN: "Todo software is too opinionated." (basch). Notion is blamed for time lost reorganizing; JIRA is seen as too complex. PRIMARY, Aug 2025 — [HN 44864134](https://news.ycombinator.com/item?id=44864134)

**4. Forced accounts / login / cloud lock-in**
- HN: "you can't use this software without logging in" (davsti4). Another commenter rejects apps that are "not local first, proprietary, subscriptions, or no encryption" (seansh). About 5 comments on local-only/privacy in the sampled part. PRIMARY, Aug 2025 — [HN 44864134](https://news.ycombinator.com/item?id=44864134)
- Todoist and TickTick both need an account and store data in the vendor cloud (from a competing vendor's comparison). VENDOR, 2026 — [Super Productivity: private alternatives](https://super-productivity.com/blog/private-alternatives-todoist-ticktick-notion-microsoft-todo/)
- Any.do forced registration (see item 2). — [marlvel.ai](https://marlvel.ai/apps/any-do-to-do-list-planner)
- Google Tasks con on Reddit: one user does not want a third party to own their data. AGGREGATOR, date UNKNOWN — [GummySearch Reddit to-do summary](https://gummysearch.com/tools/best-products/to-do-list-app)

**5. Overdue pile-up and guilt**
- Todoist's CEO said about 70% of active users have at least one overdue task, and that a long overdue list "creates a lot of anxiety". SECONDARY, 2016 (old) — [Fast Company, 2016](https://www.fastcompany.com/3065714/todoists-ai-task-scheduler-could-help-you-procrastinate-less)
- HN: "Many tasks accumulated there so it became an inconvenience" (yard2010); "I tended to record too many todos" (komali2). About 5 comments in the sampled part. A backlog causes guilt that makes people quit. PRIMARY, Aug 2025 — [HN 44864134](https://news.ycombinator.com/item?id=44864134)
- "Solving the backlog problem is the holy grail of To-Do systems." (Aerbil313). PRIMARY, Aug 2025 — [HN 44864134](https://news.ycombinator.com/item?id=44864134)

**6. Notifications**
- Unstar analysis: "Notifications and reminders" = only 2% of negative reviews (rank 10). VENDOR/AGGREGATOR, Mar 2026 — [Unstar.app](https://unstar.app/blog/productivity-app-reviews-what-power-users-complain-about-2026)
- HN: "I hate notifications" (renegat0x0). Others say time alerts belong in the calendar or alarm. About 3 comments in the sampled part. PRIMARY, Aug 2025 — [HN 44864134](https://news.ycombinator.com/item?id=44864134)

**7. AI features nobody asked for**
- I found NO direct sample of users complaining about unwanted AI in to-do apps. Reviews treat Todoist AI (Task Assist, Ramble voice-to-task) as a selling point. TickTick is described as having little native AI. 2026 — [Unstar.app ranking](https://unstar.app/blog/todoist-ticktick-things-3-microsoft-todo-apple-reminders-todo-apps-ranked-2026); [2sync TickTick vs Todoist](https://2sync.com/blog/ticktick-vs-todoist)
- A Russian tech article links the Todoist price rise to calendar, deadline and AI features. This gives an indirect link: users may pay for AI they did not ask for. SECONDARY, 2025 — [vc.ru](https://vc.ru/services/2666875-todoist-povyshenie-tsen)

**8. Platform lock-in (Things 3, Apple Reminders)**
- Things 3: the main criticism is Apple-only (no Android, Windows or web), separate purchases per device, and no collaboration. 2025-2026, mostly VENDOR comparisons — [ClickUp Things 3 alternatives](https://clickup.com/blog?p=70910); [get-alfred.ai](https://get-alfred.ai/blog/best-things-3-alternatives); [Things 3 reviews roundup: Digital Project Manager](https://thedigitalprojectmanager.com/tools/things-3-review/)
- Apple Reminders: does not run outside Apple. Shared lists need everyone on Apple ID/devices. HN commenters call it unreliable for repeating tasks. 2025 — [Hulry](https://hulry.com/todoist-vs-apple-reminders/); [HN 44864134](https://news.ycombinator.com/item?id=44864134)

### Inferences
- Price is the strongest switch trigger in 2025-2026, because Todoist (the most-mentioned app) raised prices sharply while many free alternatives exist.
- Users dislike a change in the deal (price rise, feature moved to paid, forced sign-up) more than a high price that stays the same. One-time-purchase apps (Things 3) get less anger about price.
- Sync complaints concentrate on cloud-first apps with large user bases (Microsoft To Do, Any.do). This suggests reliability, not features, decides trust.
- "AI nobody asked for" is a plausible concern, but no evidence in this pass supports it. Do not state it as a finding.

### Gaps
- Raw counts per complaint category: UNKNOWN. Unstar gives shares but no sample size or date window. It is also a review-analysis vendor.
- Direct Reddit thread counts (r/todoist, r/ticktick reaction to the price rise): UNKNOWN. Reddit pages were not fetched directly.
- App Store / Google Play star-rating trends before and after Dec 2025 for Todoist: UNKNOWN.
- marlvel.ai methodology and exact shares: UNKNOWN (HTTP 403).

## Top recurring praise

### Takeaway
Users praise fast capture (Things Quick Entry, TickTick easy entry), natural-language date input (Todoist), cross-platform reach (Todoist, TickTick, Microsoft To Do), a useful free tier (TickTick, Microsoft To Do, Google Keep), and polished, fast sync (Things 3). Simplicity is also praised, but it can feel "boring".

### Cited Findings
- Reddit mention ranking (450 reviews, 32 subreddits, 70 posts; collection date UNKNOWN): Todoist 63 mentions, TickTick 41, Apple Reminders 25, Google Keep 23, Wunderlist 22, Microsoft To Do 20, Trello 20, Notion 13, Google Tasks 13, Things 12 + Things 3 11 (= 23 combined), Asana 8, Any.do 8. AGGREGATOR — [GummySearch](https://gummysearch.com/tools/best-products/to-do-list-app)
- Praise per app in that ranking: Todoist = cross-platform, Google Calendar link, useful free tier (con: setup time). TickTick = free tier covers basics, easy task entry, Pomodoro and habits. Apple Reminders = Apple sync, Siri, easy sharing. Microsoft To Do = free, cross-platform, Outlook flagged email as tasks. Things = polished design, fast sync, Watch app. — [GummySearch](https://gummysearch.com/tools/best-products/to-do-list-app)
- Wunderlist still has 22 Reddit mentions years after shutdown, praised for simplicity and easy sharing. — [GummySearch](https://gummysearch.com/tools/best-products/to-do-list-app)
- Things 3 Quick Entry: reviewers call it the standout feature. It opens in under a second from any app. A June 2025 Capterra reviewer calls the UI and quick entry smooth and intuitive. One reviewer scored it 9.2/10. 2025 — [Capterra Things reviews](https://www.capterra.com/p/119096/Things/reviews/); [Toolfinder Things 3](https://toolfinder.co/tools/things-3/reviews); [Asian Efficiency Things 3 review](https://www.asianefficiency.com/task-management/things-3-review/)
- Things 3 sync: App Store reviewers say sync is very fast. Things Cloud is free, with a one-time purchase. 2025-2026 — [App Store Things 3](https://apps.apple.com/gb/app/things-3/id904280696?mt=12); [MakerStack Things 3 review](https://makerstack.co/reviews/things-3-review/)
- Todoist natural language: one review calls it the best it has used in any app. Comparisons say Todoist NLP is stronger than Things. 2026 — [dev.to Todoist review 2026](https://dev.to/onsen/todoist-review-2026-honest-opinion-after-daily-use-moe); [Upbase Todoist vs Things 3](https://upbase.io/blog/todoist-vs-things-3/)
- Apple Reminders switchers say it is free, syncs well, and covers their needs. One switcher moved at Todoist renewal time after 2+ years of daily use. 2025, anecdotal — [Hulry](https://hulry.com/todoist-vs-apple-reminders/); [Digital Trends ES](https://es.digitaltrends.com/apple/5-razones-por-las-que-sigo-volviendo-a-apple-reminders/)
- Tasks.org (Android, open source): a Privacy Guides user calls it the best Android task app they used, with many sync methods. Date UNKNOWN — [Privacy Guides forum](https://discuss.privacyguides.net/t/are-there-any-free-private-and-secure-collaborative-to-do-list-applications/14213.md)
- HN praise list (Aug 2025): Org-mode (Orgzly Revived, Logseq), Obsidian, Todoist, TickTick, Things 3, Taskwarrior, todo.txt, CalDAV. Simplicity has a cost: "Simple can be boring." (slightwinder). PRIMARY — [HN 44864134](https://news.ycombinator.com/item?id=44864134)
- Keyboard shortcuts: no specific 2025-2026 user evidence found in this pass. HN developers prefer tools inside their editor: "I am not going to completely change my editor" (jorvi). PRIMARY, Aug 2025 — [HN 44864134](https://news.ycombinator.com/item?id=44864134)

### Inferences
- Capture speed and a free, cross-platform base are the two praise themes that appear across all source types.
- Reliability is mostly praised when it is absent elsewhere: users name it in complaints more than in praise.

### Gaps
- Keyboard-shortcut praise: no quantified or direct 2025-2026 evidence found.
- Share of praise per theme in store reviews: UNKNOWN.

## Why people abandon to-do apps or return to paper / plain text / notes

### Takeaway
People quit because upkeep costs more than the benefit, the backlog grows and causes guilt, the system becomes a way to procrastinate, and trust falls once the list lags behind reality. Academic work says personal task tools have high abandonment and pen and paper is chosen again and again. I found no reliable recent survey with an abandonment percentage.

### Cited Findings
- HN thread "I tried every todo app and ended up with a .txt file": 1,402 points, 799 comments, 11 Aug 2025. It is the largest single 2025 signal found. PRIMARY — [HN 44864134](https://news.ycombinator.com/item?id=44864134)
- Themes there: tools are too opinionated; tinkering is procrastination ("I think it's a form of procrastinating." — kilroy123); backlog guilt drives quitting; many prefer a .txt file, paper, index cards or a bullet journal; paper friction limits the backlog; forgetting old tasks is useful. PRIMARY, Aug 2025 — [HN 44864134](https://news.ycombinator.com/item?id=44864134)
- Counter-view in the same thread: "Generally the tool isn't the problem" (bluGill). Some say plain text is hard for subtasks and recurring items. PRIMARY, Aug 2025 — [HN 44864134](https://news.ycombinator.com/item?id=44864134); [Outliner Software mirror](https://outlinersoftware.com/topics/viewt/11986)
- Haraty, McGrenere, Tang, "How personal task management differs across individuals", International Journal of Human-Computer Studies (online Dec 2015, 2016 volume; DOI 10.1016/j.ijhcs.2015.11.006). Method: focus group + contextual interviews. It states that all solutions have high abandonment rates, and that pen and paper is repeatedly chosen as the best task manager. No percentage given. PRIMARY, 2015/2016 (old) — [UBC PDF](https://www.cs.ubc.ca/labs/edapt/papers/haraty2016_2.pdf)
- Haraty et al., Graphics Interface 2015, "How and why personal task management behaviors change over time": survey of 178 participants. Changes come from changing needs, dissatisfaction from unmet needs, and newly noticed needs. PRIMARY, 2015 (old) — [GI 2015](https://graphicsinterface.org/proceedings/gi2015/gi2015-19)
- Haraty et al., GI 2012: electronic personal task tools have low adoption rates. Three user types: adopters, make-doers, do-it-yourselfers. PRIMARY, 2012 (old) — [GI 2012 PDF](https://www.cs.ubc.ca/~joanna/papers/GI2012_Haraty.pdf)
- LinkedIn survey of 6,000+ professionals: only 11% regularly finish all tasks on their daily list. SECONDARY, about 2012 (old) — [HuffPost UK](https://huffingtonpost.co.uk/entry/majority-of-people-dont-finish-daily-to-do-lists_n_1586796)
- Kelton Research for Microsoft (2008): 78% of Canadians rely on to-do lists, and items stay about 26 days before completion. Vendor-sponsored, 2008 (old) — [Microsoft News 2008](https://news.microsoft.com/source/2008/01/14/survey-shows-increasing-worldwide-reliance-on-to-do-lists/?ref=anangsha.me)
- "41% of items on to-do lists are never finished" is attributed to Forbes, but the original was not verified. UNVERIFIED — [CU Insight](https://www.cuinsight.com/41-of-items-on-the-average-to-do-list-are-never-finished/)
- Project.co 2021 survey: 80% of people who do not make task lists think lists would help them plan. 2021 — [Project.co](https://project.co/project-management-statistics-2021-new-data/)
- Personal essays: one writer added 60 tasks in three weeks, then quit because upkeep cost more than the benefit. Another kept today.txt and someday.txt with no sync for about six months. Date UNKNOWN / older — [Medium "Why I Quit Using ToDo List"](https://medium.com/taking-notes/why-i-quit-using-todo-list-d84d48de3d00); [frantic.im "TODO Apps Are Meant for Robots"](https://frantic.im/todo-for-robots/); [Jamie Rubin, 2021](https://jamierubin.net/2021/08/16/why-to-do-apps-dont-work-for-me/)
- ADHD angle: an often-repeated Reddit pattern is a new app that is exciting for a few days, then unused. Apps that hide tasks in folders lose ADHD users. Paper is always visible; digital gives reminders. VENDOR/blog sources, 2025 — [dev.to TAMSIV](https://dev.to/tamsiv/why-productivity-apps-fail-with-adhd-and-the-3-principles-that-actually-work-5gm3); [Fabric blog](https://fabric.so/blog/how-to-actually-use-a-todo-list-when-you-have-adhd)
- Trust loss: once the app falls behind reality, people stop trusting it, then stop using it. Low-quality blog, Jan 2026 — [toolverdicts](https://toolverdicts.blogspot.com/2026/01/why-you-stop-using-productivity-apps.html)

### Inferences
- The main abandonment cause is maintenance cost and backlog guilt, not missing features. An app that makes old tasks fade or forces a small daily list may answer the most common reason to quit.
- Paper and plain text win on zero friction and visibility. They lose on recurring tasks, reminders, and phone + laptop access.

### Gaps
- A 2024-2026 survey with an abandonment percentage for to-do apps: NOT FOUND. Do not cite a number.
- 30-day retention for to-do apps from app analytics firms: UNKNOWN (not searched in depth).

## "No account" / local-only apps: valued or a dealbreaker?

### Takeaway
A vocal minority (HN, self-hosted, privacy forums) strongly values no account, local-first storage and encryption. Most of them still want sync and solve it with Syncthing, CalDAV, Nextcloud or WebDAV. No-account apps that cannot sync get sync requests from users. Evidence that it is a "dealbreaker" for the mass market is indirect.

### Cited Findings
- HN (Aug 2025): about 5 comments in the sampled part reject login-required, proprietary or unencrypted tools. Users sync with Syncthing, CalDAV or Nextcloud. Some want encryption because calendar providers can read their data. PRIMARY — [HN 44864134](https://news.ycombinator.com/item?id=44864134)
- "I use syncthing to sync it between my devices." (dngray). PRIMARY, Aug 2025 — [HN 44864134](https://news.ycombinator.com/item?id=44864134)
- Another HN commenter settled on CalDAV plus a basic to-do app and calendar after years of custom systems. PRIMARY, 2025 — [HN 44864134 via search summary](https://news.ycombinator.com/item?id=44864134)
- Tasks.txt (todo.txt-style app) maker on Product Hunt: some users ask for cross-device sync, which needs some account; iCloud sync may come later. PRIMARY, date UNKNOWN — [Product Hunt Tasks.txt](https://www.producthunt.com/posts/tasks-txt)
- A commenter notes that "offline-first" means it works offline, not that no account is needed. Check each app's sync model. — [Product Hunt / Indie Hackers results via search](https://www.indiehackers.com/product/offlist)
- tsk.lol commenters praise its local-first, no-server design. Product Hunt, date UNKNOWN — [Product Hunt tsk.lol](https://www.producthunt.com/posts/tsk-lol)
- Dly: the maker built a no-account, no-cloud app where all data stays on the phone. Indie Hackers, date UNKNOWN — [Indie Hackers Dly](https://www.indiehackers.com/product/dly)
- Super Productivity: optional sync via WebDAV, Dropbox, local file or its own Super Sync with optional encryption. VENDOR, 2026 — [Super Productivity blog](https://super-productivity.com/blog/best-local-first-todo-apps-2026/)
- Super Productivity users report friction: the Dropbox sync must be set up again on each new PC/browser; one Lemmy user stayed local-only because the mobile app is strict about SSL certificates. Date UNKNOWN — [r/superProductivity mirror](https://reddit.birdcat.cafe/r/superProductivity); [Lemmy thread](https://campfyre.nickwebster.dev/post/2157732)
- Privacy Guides forum: Tasks.org is not end-to-end encrypted unless paired with EteSync; users self-host with Nextcloud CalDAV. Date UNKNOWN — [Privacy Guides](https://discuss.privacyguides.net/t/are-there-any-free-private-and-secure-collaborative-to-do-list-applications/14213.md)
- Small apps market "no account" as the headline (Hash#Todo, Plainlist, Todolet, Zero-Friction Task Manager uses a sync code instead of an account). Vendor claims, not verified. — [Plainlist privacy](https://plainlist.pages.dev/privacy.html); [AlternativeTo Hash#Todo](https://alternativeto.net/software/hash-todo/about); [App Store Zero-Friction](https://apps.apple.com/us/app/id6752873580)
- Apple Reminders switchers cite a "privacy-friendly" approach (blog claim). 2025 — [Hulry](https://hulry.com/todoist-vs-apple-reminders/)

### Inferences
- "No account" is a real value, but almost no one wants "no sync". The winning pattern in these communities is no vendor account + user-controlled sync (file sync, CalDAV, sync code, iCloud).
- Sync setup friction (tokens, certificates, re-setup per device) is the main cost that local-first users report.

### Gaps
- Share of mainstream users who would refuse a no-sync app: UNKNOWN. No survey found.
- Direct r/privacy or r/selfhosted thread counts: UNKNOWN (not fetched).

## The phone + laptop split (same list on both devices)

### Takeaway
Users expect the same list on phone and computer. Cross-platform reach is the top praise for Todoist, TickTick and Microsoft To Do, and the top reason people leave Things 3 and Apple Reminders. Plain-text users accept extra sync work, and some find it uncomfortable on a phone.

### Cited Findings
- Things 3 users leave mainly because it is Apple-only; if you use Windows or Android "you're out of luck" (vendor framing). 2025 — [ClickUp](https://clickup.com/blog?p=70910); [crm.org](https://crm.org/news/best-things-3-alternatives)
- Todoist is the most recommended replacement because of near-identical features on Windows, Mac, iOS, Android and web. TickTick is the lower-cost cross-platform pick. 2025-2026 — [get-alfred.ai](https://get-alfred.ai/blog/best-things-3-alternatives); [Lifestack Things alternatives](https://lifestack.ai/blog/things-alternatives)
- Reddit praise for Todoist, Microsoft To Do, Google Keep and Trello names cross-device sync or cross-platform as a pro. Date UNKNOWN — [GummySearch](https://gummysearch.com/tools/best-products/to-do-list-app)
- Apple Reminders: shared lists need everyone on Apple devices. 2025 — [Hulry](https://hulry.com/todoist-vs-apple-reminders/)
- HN (Aug 2025): about 6 comments in the sampled part discuss phone + laptop sync with plain text. One says "it's just so uncomfortable using a text file like that" (seansh). PRIMARY — [HN 44864134](https://news.ycombinator.com/item?id=44864134)
- Microsoft To Do sync failures between web, desktop and mobile Outlook break this split even inside one ecosystem (Aug-Sep 2025). PRIMARY — [Tech Community](https://techcommunity.microsoft.com/discussions/to-do/tasks-sync-failure---outlook-web-vs-mobile-outlook-vs-desktop-outlook/4532616)
- Unstar: "Mobile app quality" = 8% of negative reviews (Notion named). VENDOR/AGGREGATOR, Mar 2026 — [Unstar.app](https://unstar.app/blog/productivity-app-reviews-what-power-users-complain-about-2026)

### Inferences
- Capture happens on the phone; planning and review often happen on the laptop. An app that works well on only one side gets dropped or paired with a second tool.
- Users on mixed ecosystems (iPhone + Windows PC, Android + Mac) are underserved by Things 3 and Apple Reminders, and that is where Todoist and TickTick gain.

### Gaps
- Share of users who use a to-do app on both phone and computer: UNKNOWN. No survey found.
- Phone vs desktop usage split per app: UNKNOWN.
