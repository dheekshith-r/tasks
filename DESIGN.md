---
version: alpha
name: Tasks · Sorting Frame
description: A personal to-do list set as a post-office sorting frame. One typed line is postmarked and filed under its day.
colors:
  bg: "#FFFFFF"
  surface: "#FFFFFF"
  soft: "#F3F3F1"
  line: "#E2E2DF"
  ink: "#161616"
  muted: "#4A4A4A"
  frame: "#161616"
  accent: "#D62839"
  accent-ink: "#FFFFFF"
  accent-text: "#C8202F"
  accent-hover: "#B3202F"
  sun: "#FFC53D"
  sun-ink: "#161616"
  danger: "#A4161A"
  mark: "#D62839"
typography:
  sans:
    fontFamily: Overpass Variable
    fontWeight: 400 600 700 800
  mono:
    fontFamily: Overpass Mono Variable
    fontWeight: 500 600 700
rounded:
  base: 0px
  button: 2px
spacing:
  s1: 4px
  s2: 8px
  s3: 12px
  s4: 16px
  s5: 24px
  s6: 32px
  s7: 48px
  s8: 64px
---

# Design System: Tasks · Sorting Frame

## Overview

**Creative North Star: "Your week, sorted like the post."**

The page and the app are one sorting frame: 3px ink rules divide pigeonhole slots (Carried over, Today, Tomorrow, This week, Later, Done). A yellow strip labels each slot. Every task is a white paper slip. The newest slip carries a red postmark with today's date, drawn in code and roughened by an SVG ink filter. The frame refuses the hero-plus-screenshot landing page and the sidebar-plus-list app.

**Key characteristics**
- The frame is the layout: slots are sections of one grid, at least 280px wide, wrapping into rows. An empty cell at the end of a row stays open, as if the frame continues.
- The start page's first slot is the IN slot: the headline, one line of help and the working input. The same IN strip opens the app's quick-add.
- Square corners everywhere (buttons 2px). Depth comes from a soft inner shade at the top of each slot and a 1px shadow under each slip.

## Colour roles

| Role | Light | Dark | Use |
|---|---|---|---|
| Ground | #FFFFFF | #101010 | page, IN slot |
| Slot | #F3F3F1 | #1A1A1A | inside each pigeonhole |
| Slip | #FFFFFF | #262626 | each task |
| Ink / frame | #161616 | #EDEDED / #4A4A4A frame | text and the 3px rules |
| Yellow #FFC53D | same | same | slot label strips, the day tag, "Today" |
| Red #D62839 | same | same | the main action, the postmark, "High" (always with its word) |
| Calm grey | line token | line token | Carried over and Done labels: never red |

Every text pair is checked by `npm run contrast` in both themes.

## Typography

- Overpass for all text: 800 for headings and labels, 600 for task titles, 400 for body.
- Overpass Mono for dates, tags, counts and keys (data, not decoration), with tabular figures.
- Labels: 0.75rem, 800, uppercase, 0.09em tracking. Headings: -0.025em tracking, `text-wrap: balance`.

## Components

- **Slot label:** yellow strip, ink text, mono count. Calm grey for Carried over and Done.
- **Slip:** white, 12px padding, 1px bottom shadow; square check (2px ink border, ink fill when done); title strikes through with an ink stripe; meta row in mono.
- **Postmark:** two rings, today's date, four wavy cancel lines; red at 55% opacity under the text in the app, full on the start page.
- **Buttons:** red solid for the main action; 2px ink outline for secondary; press scale 0.97; hover only with a fine pointer.
- **Inputs:** 2px ink border, 56px tall for the main line.

## Motion

- Start page (rare, first visit): the new slip drops 14px in 240ms and the postmark stamps in 180ms, ease-out cubic-bezier(.23,1,.32,1). None with reduced motion.
- App (many times a day, keyboard): no motion on add or move; the postmark appears still. Drawer 280ms iOS curve; palette instant.

## Layout

- Slots: `repeat(auto-fill, minmax(280px, 1fr))`; four per row at 1280px, one per row on phones.
- With a mouse, row actions float over the slip so narrow slots keep their width for text; on touch they stay in the row.
- First view: the headline and the input are visible with no scroll at 375x667 and 1280x720.

## Do and don't

- Do keep nav, footer and forms standard; the frame is the one strange thing.
- Do date the sample week from the visitor's real today.
- Don't use red for overdue or for decoration. Don't animate keyboard actions. Don't add a third font family for text.
