# Local-first, no-account, open-source personal to-do apps (as of 2026-11-12)

Method note: GitHub numbers came from the live GitHub REST API (`gh api repos/...`) on 2026-11-12. Endeavour numbers came from the GNOME GitLab API on the same day. HN numbers came from the HN Algolia API on the same day. Reddit's API refused unauthenticated requests, so there is no Reddit data. "Last push" is the last commit to any branch. "Latest release" is the newest GitHub Release object, and some projects publish releases elsewhere.

## 1. Which open-source / local-first to-do apps exist, and how popular are they?

### Takeaway
The segment is crowded and active. Super Productivity (23.6k stars, release 2026-11-06) is the closest large direct competitor: open source, no account, a web app, and optional E2EE sync. TodoMVC (29k stars) is a reference demo, not a product. The closest small competitors are new 2025-2026 projects such as Mindwtr (2.4k stars) and OpenTodo (390 stars). None of the large projects is a pure "browser localStorage only, keyboard-first" web app. That exact niche is mostly filled by small hobby repos with fewer than 100 stars.

### Cited Findings

**Dedicated to-do / task apps (sorted by stars)**

| App | Stars | Latest release (date) | License | Platforms | Sync approach | Source |
|---|---|---|---|---|---|---|
| TodoMVC (reference demos, not a product) | 28,974 | 2.0.0 (2026-06-06) | NOASSERTION | Web demos | None (localStorage demos) | [GitHub API: tastejs/todomvc](https://github.com/tastejs/todomvc) |
| Super Productivity | 23,620 | v20.0.0 (2026-11-06) | MIT | Linux, macOS, Windows, Android, iOS, web (app.super-productivity.com) | Optional: SuperSync (own service, "end-to-end encrypted with a password only you hold", self-hostable), Dropbox, WebDAV. No account needed | [GitHub](https://github.com/super-productivity/super-productivity) (fetched 2026-11-12) |
| todo.txt-cli | 6,199 | v2.14.0 (2026-09-01) | GPL-3.0 | CLI | Plain text file. Any file sync works | [GitHub](https://github.com/todotxt/todo.txt-cli) |
| Taskwarrior | 6,165 | v3.5.0 (2026-08-16) | MIT | CLI (Linux/macOS/Windows via WSL) | Local DB; optional sync server (details not checked this session) | [GitHub](https://github.com/GothenburgBitFactory/taskwarrior) |
| Vikunja | 6,028 | v2.8.0 (2026-11-05) | AGPL-3.0 | Self-hosted web server + clients | Self-hosted server (account on your own server) | [GitHub](https://github.com/go-vikunja/vikunja) |
| Planify | 5,796 | v4.20.0 (2026-09-10) | GPL-3.0 | Linux (GNOME) | Local, plus "Todoist, Nextcloud & CalDAV support" | [GitHub](https://github.com/alainm23/planify) |
| Tasks.org | 5,738 | 15.13 (2026-10-14) | GPL-3.0 | Android only | CalDAV, Tasks.org Cloud (hosted), self-hosted / third-party options | [GitHub](https://github.com/tasks/tasks); [tasks.org/docs](https://tasks.org/docs/) |
| todo.txt (format spec) | 3,445 | no GitHub release; last push 2026-06-28 | GPL-3.0 | Format | File-based | [GitHub](https://github.com/todotxt/todo.txt) |
| dooit (TUI) | 2,966 | v3.3.4 (2025-11-29) | — | Terminal | Local | [GitHub](https://github.com/dooit-org/dooit) |
| Mindwtr (GTD) | 2,390 | v1.3.8 (2026-11-04); repo created 2025-12-08 | AGPL-3.0 | Windows, macOS, Linux, iOS/iPadOS, Android; self-hostable web app | "Works offline, no account needed". Optional file sync (iCloud, Dropbox, shared folder), WebDAV, self-hosted sync server. E2EE not mentioned | [GitHub](https://github.com/dongdongbh/Mindwtr) |
| Tasks.md (Markdown kanban) | 2,219 | 3.3.0 (2026-03-08) | MIT | Self-hosted web | Markdown files on server | [GitHub](https://github.com/BaldissaraMatheus/Tasks.md) |
| WeekToDo | 2,192 | v2.2.0 (2024-02-12); last push 2025-07-20 (stale) | — | Windows, macOS, Linux, web (weektodo.me) | Local only; describes itself as "focused on privacy" | [GitHub](https://github.com/manuelernestog/weektodo) |
| sleek (todo.txt GUI) | 2,054 | v2.1.1 (2026-10-18) | MIT | Desktop | todo.txt file | [GitHub](https://github.com/ransome1/sleek) |
| tuxedo (todo.txt TUI, "keyboard-driven") | 1,900 | v2026.8.1 (2026-08-30); repo created 2026-05-07 | — | Terminal | todo.txt file | [GitHub](https://github.com/webstonehq/tuxedo) |
| tududi | 3,546 | v2.1.0 (2026-11-06) | MIT | Self-hosted web | Self-hosted server | [GitHub](https://github.com/chrisvel/tududi) |
| Donetick | 2,738 | v0.1.86 (2026-11-03) | AGPL-3.0 | Self-hosted web | Self-hosted server | [GitHub](https://github.com/donetick/donetick) |
| Errands (GNOME) | 528 | 51.0.6 (2026-11-11) | Zlib | Linux | Local / CalDAV (not verified) | [GitHub](https://github.com/mrvladus/Errands) |
| Simpletask (todo.txt Android) | 564 | archived; last push 2023-11-25 | GPL-3.0 | Android | todo.txt file | [GitHub](https://github.com/mpcjanssen/simpletask-android) |
| OpenTodo | 390 | v1.4.2 (2026-11-10); repo created 2026-10-10 | — | Self-hosted | "open-source, local-first task manager you can host yourself" | [GitHub](https://github.com/OpenTodoApp/OpenTodo) |
| Endeavour (formerly GNOME To Do) | 105 (GNOME GitLab) | 43.0 (2022-11-02); last activity 2026-09-19 | — | Linux | Local / online accounts (not verified) | [GNOME GitLab API](https://gitlab.gnome.org/World/Endeavour) |
| todofy (Tauri) | 111 | — | — | Linux, macOS, Windows | "local-first ... optional self-hosted account sync" | [GitHub](https://github.com/salarzeidanlou/todofy) |
| plain-week | 67 | v0.3.17 (2026-11-12); created 2026-10-15 | MIT | Web, self-hostable | — | [GitHub](https://github.com/victor-falcon/plain-week) |
| rxdb-quickstart (demo) | 54 | — | — | Web | "Local-First peer-to-peer replicated todo list with RxDB and WebRTC" | [GitHub](https://github.com/pubkey/rxdb-quickstart) |

**Note / PKM tools that include tasks (wider competition)**

| App | Stars | Latest release (date) | License | Sync approach | Source |
|---|---|---|---|---|---|
| AFFiNE | 74,480 | v0.27.4 (2026-08-18) | NOASSERTION | Local-first, optional cloud (not verified) | [GitHub](https://github.com/toeverything/AFFiNE) |
| Joplin | 57,152 | v3.7.22 (2026-10-28) | NOASSERTION | Notes with to-dos; file / WebDAV / Dropbox / Joplin Cloud sync (not verified this session) | [GitHub](https://github.com/laurent22/joplin) |
| Logseq | 45,561 | 2.0.2 (2026-10-07) | AGPL-3.0 | Outliner with TODO/DOING tasks; local files (sync details not verified) | [GitHub](https://github.com/logseq/logseq) |
| TriliumNext | 38,886 | v0.107.0 (2026-11-08) | AGPL-3.0 | Self-hosted sync server | [GitHub](https://github.com/TriliumNext/Trilium) |
| Planka (kanban) | 12,677 | v2.3.1 (2026-11-05) | NOASSERTION | Self-hosted | [GitHub](https://github.com/plankanban/planka) |
| Kanboard | 9,956 | v1.2.57 (2026-10-31) | MIT | Self-hosted | [GitHub](https://github.com/kanboard/kanboard) |
| Anytype | 9,080 | v0.57.8-alpha (2026-11-10) | NOASSERTION | Local-first P2P (HN title: "local-first, P2P Notion alternative", 2023) | [GitHub](https://github.com/anyproto/anytype-ts); [HN 2023-07-20](https://news.ycombinator.com/item?id=36799548) |
| Markor (Android, supports todo.txt) | 6,417 | v2026.10.0 (2026-10-25) | NOASSERTION | Plain files | [GitHub](https://github.com/gsantner/markor) |
| QOwnNotes | 5,956 | last push 2026-11-12 | — | "plain-text file notepad and todo-list manager ... Nextcloud / ownCloud integration" | [GitHub](https://github.com/pbek/QOwnNotes) |
| Obsidian Tasks plugin | 4,098 | 8.6.0 (2026-10-16) | MIT | Inside Obsidian vault (Markdown files) | [GitHub](https://github.com/obsidian-tasks-group/obsidian-tasks) |

**Other small no-account, local-only to-do launches in 2026 (snippets only, not verified)**
- Dly (Indie Hackers, about June 2026), a local-first daily planner, "no account" — [Indie Hackers](https://www.indiehackers.com/product/dly)
- Offlist (Indie Hackers, about April 2026), an offline to-do and notes app with no accounts — [Indie Hackers](https://www.indiehackers.com/product/offlist)
- maxgfr/today, an offline-first to-do app with no account, server or tracking — [GitHub](https://github.com/maxgfr/today)
- Mindwtr was also launched on Product Hunt — [Product Hunt](https://www.producthunt.com/p/mindwtr)

**Keyboard-first closed-source reference:** Godspeed (Mac, "100% keyboard oriented todo app") got 328 points and 223 comments on HN — [Show HN, 2024-03-19](https://news.ycombinator.com/item?id=39756325).

### Inferences
- Super Productivity is the direct competitor to beat. It already offers a free OSS web app, no account, and optional E2EE sync. A new entrant must win on simplicity, speed and keyboard flow, not on privacy alone.
- Activity is high. Most listed projects pushed code in October-November 2026. Several new entrants appeared in 2025-2026 (Mindwtr, tuxedo, OpenTodo, plain-week). This signals live demand, and also rising competition.
- Mindwtr went from repo creation (2025-12-08) to 2,390 stars in about 11 months. tuxedo went from 2026-05-07 to 1,900 stars. Both are "no account / keyboard / plain" positioned. New, focused tools can still gain traction.
- The pure localStorage-only web niche has no breakout project above roughly 300 stars in the GitHub searches I ran. Either the niche is open, or demand without sync is weak. Section 3 suggests that users want sync as well as privacy.
- TodoMVC's star count reflects developers, not end users. Do not count it as market demand.

### Gaps
- Sync details for Vikunja, Taskwarrior, Logseq (DB version / RTC sync), Joplin, AFFiNE, Errands and Endeavour were not checked against primary docs this session. Each one is marked "not verified".
- License shows "—" where the API returned no SPDX id in my query output.
- User counts (downloads, MAU) are UNKNOWN for all projects. Stars are only a proxy.
- Obsidian's own user numbers and the Tasks plugin's download count are UNKNOWN (not fetched).
- Google Play install counts for Tasks.org are UNKNOWN (not fetched).

## 2. How do local-first apps solve multi-device sync without accounts?

### Takeaway
In practice, shipping to-do apps use four methods. The most common is file-based sync through the user's own storage (Dropbox, iCloud, WebDAV, Nextcloud, a shared folder, or plain todo.txt files). Next come self-hosted servers (CalDAV, Vikunja, tududi), then an optional vendor relay with E2EE (Super Productivity's SuperSync). CRDT/P2P is mostly found in libraries and in a few apps such as Anytype. No-account sync usually means "bring your own storage".

### Cited Findings
- Super Productivity: no account required. It syncs through SuperSync ("end-to-end encrypted with a password only you hold", self-hostable), Dropbox or WebDAV — [GitHub](https://github.com/super-productivity/super-productivity)
- Mindwtr: optional file sync via iCloud, Dropbox or a shared folder, plus WebDAV and a self-hosted server. E2EE and CRDT are not mentioned — [GitHub](https://github.com/dongdongbh/Mindwtr)
- Tasks.org: CalDAV, its own hosted "Tasks.org Cloud", and self-hosted / third-party options — [tasks.org/docs](https://tasks.org/docs/)
- Planify: Todoist, Nextcloud and CalDAV — [GitHub](https://github.com/alainm23/planify)
- todo.txt ecosystem (todo.txt-cli, sleek, tuxedo, Markor): one plain text file. Sync is left to any file-sync tool. Syncthing (P2P file sync, 90,407 stars, v2.1.7 on 2026-10-21) is a common pairing — [GitHub: syncthing](https://github.com/syncthing/syncthing). The pairing itself is an inference, not a sourced fact.
- Anytype is described as "local-first, P2P" — [HN 2023-07-20, 414 points](https://news.ycombinator.com/item?id=36799548)
- RxDB demo: a P2P to-do list over WebRTC — [GitHub](https://github.com/pubkey/rxdb-quickstart)
- Local-first sync libraries and engines (GitHub API, 2026-11-12):
  - Yjs (CRDT): 23,052 stars, v13.6.33 (2026-09-23) — [GitHub](https://github.com/yjs/yjs)
  - RxDB: 23,423 stars, 17.6.0 (2026-10-05) — [GitHub](https://github.com/pubkey/rxdb)
  - Dexie.js (IndexedDB wrapper, with optional Dexie Cloud): 14,684 stars, v4.4.7 (2026-10-19) — [GitHub](https://github.com/dexie/Dexie.js)
  - InstantDB: 10,561 stars — [GitHub](https://github.com/instantdb/instant)
  - ElectricSQL (repo now under neondatabase/electric): 10,429 stars — [GitHub](https://github.com/neondatabase/electric)
  - Automerge (CRDT): 6,728 stars, js 3.5.0 (2026-09-16) — [GitHub](https://github.com/automerge/automerge)
  - TinyBase: 5,213 stars, v10.1.0 (2026-11-12) — [GitHub](https://github.com/tinyplex/tinybase)
  - cr-sqlite (CRDT SQLite): 3,829 stars, latest release 2024-01-17 (stale) — [GitHub](https://github.com/vlcn-io/cr-sqlite)
  - LiveStore: 3,757 stars, v0.5.0 (2026-10-15) — [GitHub](https://github.com/livestorejs/livestore)
  - Triplit: 3,121 stars, last push 2026-01-19, last release 2025-07-31 (slowing) — [GitHub](https://github.com/aspen-cloud/triplit)
  - Evolu (E2EE local-first, no-account oriented): 1,917 stars, @evolu/web 3.7.1 (2026-11-04) — [GitHub](https://github.com/evoluhq/evolu)
  - PowerSync JS: 741 stars — [GitHub](https://github.com/powersync-ja/powersync-js)
- HN commenters in "Why haven't local-first apps become popular?" (2025-09-22, 505 points, 485 comments) named working approaches. These were CRDTs (Automerge, LWW registers), iCloud file sync ("still has conflicts"), Dropbox, Git-style merging, store-and-forward queues, and self-hostable relays. Commenters said CRDTs guarantee convergence but do not remove conflicts, and that last-write-wins can silently lose data — [HN thread](https://news.ycombinator.com/item?id=45333021)
- The Local-First Conf 2026 recap mentions Iroh's 1.0 release (a P2P networking library) — [Adam Wiggins, July 2026](https://adamwiggins.com/posts/politics-and-emotion-at-local-first-conf/)

### Inferences
- For a localStorage-only web app, the lowest-risk path to sync without accounts has three steps. First, export/import a JSON or todo.txt file. Second, use the File System Access API or a file saved to a user-synced folder. Third, optionally offer a WebDAV or E2EE relay. This matches what Super Productivity and Mindwtr ship.
- A to-do list is a small dataset with simple merges (add, complete, reorder). Per-item last-write-wins with timestamps is often enough. A full CRDT (Yjs or Automerge) is the safer choice if concurrent edits on two devices must never lose data.
- Several sync-engine vendors (Electric, Instant, PowerSync, Triplit) need a backend. They do not fit a "no account, no server" promise unless the user self-hosts.

### Gaps
- Logseq's 2.0 DB-version sync model and Obsidian Sync's E2EE details were not fetched this session.
- No usage data shows which sync method end users actually choose.

## 3. Evidence of demand for "no account / privacy / local-first"

### Takeaway
Developer and enthusiast demand is real and growing. The evidence is HN front pages, a conference that grew from about 300 to about 400 attendees, a FOSDEM devroom, and fast-growing new no-account apps. Mass-market demand is unproven. HN's largest recent local-first debate centred on why these apps are not popular, citing sync difficulty, business model, and users choosing convenience.

### Cited Findings
- The Ink & Switch essay "Local-first software: you own your data, in spite of the cloud" is from 2019. Its HN posts got 566 points (2019-05-02), 748 points (2019-11-20), 262 points (2020-08-02) and 883 points / 297 comments (2025-07-05 repost) — [HN 2019-05](https://news.ycombinator.com/item?id=19804478); [HN 2019-11](https://news.ycombinator.com/item?id=21581444); [HN 2025-07](https://news.ycombinator.com/item?id=44473135)
- Other high-scoring local-first HN posts:
  - "Local First, Forever": 689 points (2024-06-25) — [HN](https://news.ycombinator.com/item?id=40786425)
  - "Linear sent me down a local-first rabbit hole": 467 points (2025-08-08) — [HN](https://news.ycombinator.com/item?id=44833834)
  - "Zedless: Zed fork focused on privacy and being local-first": 556 points (2025-08-20) — [HN](https://news.ycombinator.com/item?id=44964916)
  - "Show HN: Whispering – open-source, local-first dictation": 591 points (2025-08-18) — [HN](https://news.ycombinator.com/item?id=44942731)
  - "Grid: Free, local-first, browser-based 3D printing slicer": 398 points (2026-01-29) — [HN](https://news.ycombinator.com/item?id=46817813)
  - The HN Algolia API returned 40 "local-first" stories above 200 points — [HN Algolia query, 2026-11-12](https://hn.algolia.com/api/v1/search?query=local-first&tags=story&numericFilters=points>200)
- Counter-signal: "Why haven't local-first apps become popular?" got 505 points and 485 comments (2025-09-22). Reasons given: conflict resolution, data model overhead, no SaaS-style revenue, users preferring convenience, multi-device complexity, and immature auth. Some commenters said many users do not care about privacy — [HN](https://news.ycombinator.com/item?id=45333021)
- Super Productivity's HN posts got little traction: 28 points (2023-12-16) and 5 points (2026-01-03). GitHub stars (23.6k) give a stronger signal than HN for this app — [HN 2023](https://news.ycombinator.com/item?id=38664792); [HN 2026](https://news.ycombinator.com/item?id=46481400)
- Show HN for a keyboard-first to-do app: Godspeed got 328 points and 223 comments (2024-03-19). "Show HN: I built a task manager that separates do and due dates" got 160 points (2024-10-23) — [HN Godspeed](https://news.ycombinator.com/item?id=39756325); [HN do/due](https://news.ycombinator.com/item?id=41925644)
- Local-First Conf: about 300 attendees in 2025 (second edition) — [wal.sh listing](https://wal.sh/events/localfirst-conf-2025). About 400 attendees at the third edition in Berlin, July 2026. The official theme was user empowerment in computing, and digital sovereignty was a major topic — [Adam Wiggins, July 2026](https://adamwiggins.com/posts/politics-and-emotion-at-local-first-conf/). Martin Kleppmann also wrote about the conference — [kleppmann.com, 2026-07-12](https://martin.kleppmann.com/2026/07/12/local-first-conf.html) (not fetched)
- FOSDEM 2026 put out a call for participation for a "Local First, Sync engines and CRDTs" devroom — [FOSDEM mailing list, 2025 Q4](https://lists.fosdem.org/pipermail/fosdem/2025q4/003650.html)
- Ink & Switch held a "Tenfold" 10-year lab day event in 2026 — [inkandswitch.com](https://www.inkandswitch.com/events/2026-lab-day/) (not fetched)
- The localfirst.fm podcast is active, with a special episode on the 2026 conference — [localfirst.fm mirror](https://localfirst-fm.vercel.app/s3/transcript) (not fetched)
- New no-account to-do apps keep launching: Mindwtr (2,390 stars in about 11 months), tuxedo (1,900 stars in about 6 months), OpenTodo (390 stars in about 1 month) — GitHub API, 2026-11-12 (see the table in section 1)

### Inferences
- Demand is concentrated among developers, privacy-minded users and self-hosters. These are the same people who give GitHub stars and HN points. That fits a free OSS product but says little about mass-market willingness.
- "No account" alone is not a moat. Super Productivity, Mindwtr and WeekToDo all offer it. The repeated complaint is that people want privacy and multi-device sync. A localStorage-only app meets the first need but not the second.
- Rising EU "digital sovereignty" sentiment (Local-First Conf 2026 theme) is a tailwind for European positioning.

### Gaps
- Google Trends data for "local-first", "todo app no account" and "offline todo app" is UNKNOWN. It was not retrieved because Trends has no simple public API.
- Reddit data (r/selfhosted, r/privacy, r/opensource subscriber counts and top threads) is UNKNOWN. Reddit's JSON API rejected unauthenticated requests on 2026-11-12.
- No survey data was found on the share of to-do users who refuse to create accounts.
- The 2026 Local-First Conf attendance (about 400) comes from one attendee's blog, not from the organisers.

## 4. Technical risks of browser-only storage (localStorage)

### Takeaway
The main risk is Safari. With tracking prevention on, Safari deletes all script-writable storage (localStorage and IndexedDB included) for a site that gets no user interaction during 7 days of Safari use. Home Screen web apps have their own day counter, and WebKit says it does not expect their data to be deleted. Since iOS 26, every site added to the Home Screen opens as a web app by default, which makes the exemption easier to reach. `navigator.storage.persist()` works in Chrome, Firefox and Safari 17+. Chrome and Safari decide by heuristics with no prompt, and Firefox asks the user.

### Cited Findings
- WebKit (2020-03-24): a "7-Day Cap on All Script-Writeable Storage" covers IndexedDB, LocalStorage, SessionStorage, Media keys and Service Worker registrations/cache. Data is deleted "after seven days of Safari use without user interaction on the site". Home Screen web apps are not part of Safari and keep their own count of days of use, which resets with actual use. WebKit does not expect first-party data in these apps to be deleted and would call that a serious bug — [WebKit blog, 2020-03-24](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/)
- MDN (last modified 2026-01-05): with cross-site tracking prevention on, Safari deletes an origin's script-created data if it gets no click or tap in the last 7 days of browser use. Server-set cookies are exempt. MDN does not repeat the Home Screen exemption in this section. Eviction deletes all of an origin's data at once — [MDN: Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- WebKit storage policy for Safari 17 / iOS 17 / macOS Sonoma (2023-08-10):
  - An origin can use up to 60% of total disk in browser apps and 15% in other WebKit apps. The overall cap is 80% (browsers) or 20% (others).
  - Origins default to best-effort mode, and eviction is LRU per origin.
  - Persistent-mode origins may be excluded from eviction.
  - The Storage API, including `persist()`, is fully supported. WebKit grants it by heuristics "like whether the website is opened as a Home Screen Web App".
  - Home Screen and Dock apps get browser-level quotas.
  - Source: [WebKit blog, 2023-08-10](https://webkit.org/blog/14403/updates-to-storage-policy/)
- Chromium (MDN, 2026): `persist()` is "automatically approve[d] or den[ied] ... based on the user's history of interaction with the site", with no prompt. The origin quota is up to 60% of disk. Best-effort origins are evicted LRU under storage pressure, and persistent origins are skipped. MDN describes no proactive time-based eviction for Chromium — [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- Firefox (MDN, 2026): `persist()` shows a permission popup. The best-effort quota is the smaller of 10% of disk or 10 GiB per site group. The persistent quota is up to 50% of disk — [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- iOS 26 / iPadOS 26 (2025): every website added to the Home Screen opens as a web app by default, even without a manifest. Users can turn off "Open as Web App" in the dialog — [iDownloadBlog](https://www.idownloadblog.com/?p=1042117); [heise, 2025](https://heise.de/-10749652); [MacRumors how-to](https://www.macrumors.com/how-to/save-safari-bookmark-web-app-iphone-home-screen/) (search-result summaries, not fetched in full)

### Inferences
- The worst case for this product: an iPhone user opens the app in a Safari tab, then does not touch it for 7 days of Safari use. All their tasks are deleted silently. For a to-do app, this means total data loss.
- Mitigations, in order of value:
  1. Prompt iOS users to add the app to the Home Screen (the iOS 26 default makes this one tap).
  2. Call `navigator.storage.persist()` on first use and show the result.
  3. Use IndexedDB instead of localStorage (same eviction rules, but bigger and async).
  4. Offer easy export/backup, such as a file download or the File System Access API on Chromium.
  5. Show a "last backup" reminder.
- localStorage is synchronous and limited (about 5 MB per origin in most browsers, not verified this session). It fits a to-do list but blocks the main thread on large writes.
- Android Chrome PWAs install through the manifest, and Chromium's heuristics usually grant persistence to installed or often-used sites. This was not verified against a primary source this session.

### Gaps
- An official 2025-2026 WebKit statement confirming that the 7-day rule still applies in Safari 26 was not found. The latest primary sources are WebKit 2020 and 2023 plus MDN 2026-01-05.
- The localStorage size limit per browser in 2026 was not checked against a primary source.
- Android PWA install criteria in 2026 (web.dev), and whether Chrome on Android auto-grants `persist()` to installed PWAs, were not fetched.
- The status of iOS web push and the Background Sync API for Home Screen apps in 2026 was not checked.
- The EU DMA question (Apple's 2024 attempt to remove Home Screen web apps in the EU, then reversed) was not re-verified this session.
