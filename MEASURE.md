# MEASURE: Tasks (product flow step 7)

Status: **plan only.** Nothing here has been run with real people yet. Results go in the tables below after the site ships to testers. They are the input to step 1 (research) of the next version.

## 1. The magic moment

From [docs/design/MAGIC-MOMENT.md](docs/design/MAGIC-MOMENT.md): the visitor types one plain line, presses Enter, and sees it land on the right day.

- **Target:** under 10 seconds from first page load to first saved task, by keyboard only.
- **How:** watch 5 or more first-time visitors on their own phone or laptop. Start a timer when the page appears. Stop it when their first line is saved. Do not explain anything.
- **Pass:** 4 of 5 or better under 10 seconds.

| Tester | Device | Seconds to first saved task | Used the hero input? | Notes |
|---|---|---|---|---|
| | | | | |

## 2. The 5-second stranger test (start page)

Design bible, Stage 7, check 7.

1. Give the phone to someone who has never seen the page. Show the first screen for 5 seconds.
2. Take the phone back.
3. Ask: "What does this do?" Write the answer word for word.
4. Ask: "What would you click first?" Write the answer.
5. Time each answer.

- **Pass:** the first answer says "a to-do list" or the same idea, and the second names the task box or "Add to my list".

| Tester | "What does this do?" | "What would you click first?" | Time to answer |
|---|---|---|---|
| | | | |

## 3. What users say

Write exact words, with the date and the channel (GitHub issue, message, talk). Never edit them and never invent them.

| Date | Channel | Words |
|---|---|---|
| | | |

## 4. Lab numbers at release (for comparison)

Measured by Claude on the local build, Lighthouse 12, mobile with slow 4G and a slowed CPU.

| Date | Page | Performance | LCP | Blocking time | CLS | Accessibility |
|---|---|---|---|---|---|---|
| 2026-11-15 | start page, 13 sections | 97 to 99 (3 runs) | 1.7 to 2.2 s | 0 ms | 0.001 to 0.007 | 100 |
