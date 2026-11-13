import type { ParsedLine } from './parseLine';

// "Pencil to type": the start page's hero. A typed line is written in pencil, the date gets a
// highlighter, the priority a red pen circle, the list an underline, and an arrow drops to the
// clean task the app will store. Everything is drawn in code; nothing is an image file.
//
// Motion rules (animate, review-animations, animation-performance):
// - The schedule is built from what the line contains, so short lines finish sooner.
// - Time advances by clamped frame deltas, so a hidden tab or a long task never skips the show.
// - Later runs play faster (speed), any typing finishes the current run, and a resize resumes
//   from the same moment instead of jumping to the end.
// - Without animation the final frame is drawn at once, in the same call (no blank flash).
// - Heavy work (paper grain, pencil grain) is cached or limited to the text band.

export interface PencilTheme {
  paper: string; grain: string; graphite: string; graphiteLight: string;
  highlight: string; highlightBlend: GlobalCompositeOperation; highlightLow: boolean; pen: string;
  ink: string; line: string; chipSoft: string; chipYellow: string; chipInk: string;
}

export interface PencilRun {
  stop(): void;    // cancel without drawing more
  finish(): void;  // jump to the final frame
  elapsed(): number;
  playing(): boolean;
}

export interface PencilOptions { animate: boolean; speed?: number; startAt?: number }

const HAND = '"Nanum Pen Script", "Segoe Print", "Bradley Hand", cursive';
const SANS = '"Atkinson Hyperlegible Next Variable", "Atkinson Hyperlegible Next", system-ui, sans-serif';
const RTL = /[֐-ࣿיִ-﷿ﹰ-﻿]/;
type Pt = [number, number];

// Seeded random numbers: the same line always gets the same hand, so a resize never changes it.
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const ease3 = (x: number) => 1 - (1 - clamp01(x)) ** 3;
const ease5 = (x: number) => 1 - (1 - clamp01(x)) ** 5;
const easeWrite = (x: number) => { const c = clamp01(x); return c * (2 - c) * 0.35 + c * 0.65; }; // near-linear, like a hand

export function readTheme(el: Element): PencilTheme {
  const css = getComputedStyle(el);
  const v = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
  const dark = v('--pencil-mode', 'light') === 'dark';
  return {
    paper: v('--bg', '#ffffff'),
    grain: dark ? 'rgba(255,255,255,' : 'rgba(20,20,20,',
    graphite: dark ? 'rgba(232,232,232,0.92)' : 'rgba(38,38,40,0.92)',
    graphiteLight: dark ? 'rgba(232,232,232,0.35)' : 'rgba(38,38,40,0.35)',
    // On dark paper a full yellow block would swallow the light chalk, so the marker runs low.
    highlight: dark ? 'rgba(255,197,61,0.9)' : 'rgba(255,197,61,0.78)',
    highlightBlend: dark ? 'source-over' : 'multiply',
    highlightLow: dark,
    pen: v('--red-text', dark ? '#FF6B76' : '#C8202F'),
    ink: v('--ink', '#141414'),
    line: v('--line', '#E6E6E6'),
    chipSoft: v('--soft', '#F2F2F2'),
    chipYellow: v('--sun', '#FFC53D'),
    chipInk: v('--sun-ink', '#141414'),
  };
}

// Paper is the same for every line at a given size and theme, so it is made once.
const paperCache = new Map<string, HTMLCanvasElement>();
function paperFor(w: number, h: number, dpr: number, theme: PencilTheme) {
  const key = `${w}x${h}@${dpr}:${theme.paper}`;
  let c = paperCache.get(key);
  if (c) return c;
  c = document.createElement('canvas');
  c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
  const g = c.getContext('2d')!;
  g.scale(dpr, dpr);
  g.fillStyle = theme.paper; g.fillRect(0, 0, w, h);
  const r = rng(7);
  const specks = Math.round((w * h) / 70);
  g.fillStyle = theme.grain + '0.03)';
  for (let i = 0; i < specks; i++) { g.globalAlpha = 0.5 + r(); g.fillRect(r() * w, r() * h, 1, 1); }
  g.globalAlpha = 1;
  if (paperCache.size > 4) paperCache.delete(paperCache.keys().next().value!);
  paperCache.set(key, c);
  return c;
}

// Cuts text to fit a width, by whole characters (never half an emoji), with an ellipsis.
function ellipsize(g: CanvasRenderingContext2D, text: string, max: number, force = false) {
  if (!force && g.measureText(text).width <= max) return text;
  const chars = [...text];
  while (chars.length > 1 && g.measureText(chars.join('') + '…').width > max) chars.pop();
  return chars.join('') + '…';
}

interface Line { text: string; start: number; base: number }

export function drawPencil(canvas: HTMLCanvasElement, line: string, parsed: ParsedLine, theme: PencilTheme, opts: PencilOptions): PencilRun {
  const noop: PencilRun = { stop() {}, finish() {}, elapsed: () => 0, playing: () => false };
  const W = Math.round(canvas.clientWidth);
  const ctx = canvas.getContext('2d');
  if (!ctx || W < 120) return noop;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rand = rng(hash(line));
  const rtl = RTL.test(line);
  const margin = Math.max(16, Math.round(W * 0.06));
  const fit = W - margin * 2;
  const measurer = document.createElement('canvas').getContext('2d')!;

  // 1. Wrap the handwriting into at most three lines, shrinking the size before giving up.
  let size = Math.min(124, Math.max(30, Math.round(W * 0.1)));
  const minSize = 26;
  const wrap = (s: number): { text: string; start: number }[] => {
    measurer.font = `${s}px ${HAND}`;
    const out: { text: string; start: number }[] = [];
    let cur = '', start = 0, pos = 0;
    for (const m of line.matchAll(/\S+\s*/g)) {
      const word = m[0];
      if (cur && measurer.measureText((cur + word).trimEnd()).width > fit) { out.push({ text: cur.trimEnd(), start }); start = pos; cur = ''; }
      cur += word; pos = (m.index ?? 0) + word.length;
    }
    out.push({ text: cur.trimEnd(), start });
    return out;
  };
  let rows = wrap(size);
  while ((rows.length > 3 || rows.some((r) => measurer.measureText(r.text).width > fit)) && size > minSize) { size -= 4; rows = wrap(size); }
  measurer.font = `${size}px ${HAND}`;
  const cut = rows.length > 3;
  if (cut) rows = rows.slice(0, 3);
  // A single giant word is cut to fit; when a fourth line was dropped, the third always ends in "…".
  rows = rows.map((r, i) => ({ ...r, text: ellipsize(measurer, r.text, fit, cut && i === 2) }));
  const lineH = size * 1.08;
  const pad = Math.max(18, Math.round(size * 0.35));
  const lines: Line[] = rows.map((r, k) => ({ ...r, base: pad + size * 0.85 + k * lineH }));
  const lastBase = lines[lines.length - 1].base;
  const lineX = (ln: Line) => (rtl ? W - margin : margin);
  // Always measured in the pen face: the shared measurer is switched to the chip font below.
  const handFont = `${size}px ${HAND}`;
  const handWidth = (s: string) => { measurer.font = handFont; return measurer.measureText(s).width; };
  const xOf = (ln: Line, i: number) => {
    const w = handWidth(ln.text.slice(0, Math.max(0, i - ln.start)));
    return rtl ? W - margin - w : margin + w;
  };

  // 2. The task row under the note: title, then chips that wrap onto new rows.
  const titleSize = Math.max(18, Math.min(34, Math.round(W * 0.027)));
  const chipSize = Math.max(13, Math.min(17, Math.round(W * 0.014)));
  const chipH = chipSize * 2;
  const titleX = margin + titleSize * 1.4;
  const arrowLen = Math.max(44, Math.min(100, W * 0.07));
  const rowY = lastBase + size * 0.3 + arrowLen + titleSize * 1.5;
  measurer.font = `700 ${titleSize}px ${SANS}`;
  const title = ellipsize(measurer, parsed.title, W - margin - titleX);
  const titleW = measurer.measureText(title).width;
  const chipDefs: { text: string; fill?: string; outline?: string }[] = [];
  if (parsed.dueLabel) chipDefs.push({ text: parsed.dueLabel, fill: theme.chipYellow });
  if (parsed.tokens.some((t) => t.kind === 'priority')) chipDefs.push({ text: `${parsed.priority === 'med' ? 'Medium' : parsed.priority === 'high' ? 'High' : 'Low'} priority`, outline: theme.ink });
  if (parsed.listName) chipDefs.push({ text: parsed.listName.charAt(0).toUpperCase() + parsed.listName.slice(1), fill: theme.chipSoft });
  measurer.font = `700 ${chipSize}px ${SANS}`;
  const chips: { text: string; x: number; y: number; w: number; fill?: string; outline?: string }[] = [];
  let cx = titleX + titleW + chipSize * 1.4, cy = rowY;
  for (const def of chipDefs) {
    const text = ellipsize(measurer, def.text, W - margin - titleX - chipSize * 1.4);
    const w = measurer.measureText(text).width + chipSize * 1.4;
    if (cx + w > W - margin && cx > titleX) { cx = titleX; cy = cy === rowY ? rowY + titleSize * 0.8 + chipH * 0.8 : cy + chipH + chipSize * 0.5; }
    chips.push({ ...def, text, x: cx, y: cy, w });
    cx += w + chipSize * 0.6;
  }
  const rowBottom = Math.max(rowY + titleSize * 0.9, cy + chipH / 2) + titleSize * 0.5;
  const H = Math.round(rowBottom + pad);
  canvas.style.height = `${H}px`;
  canvas.style.aspectRatio = `${W} / ${H}`;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);

  // 3. The pencil layer: handwriting with graphite grain, limited to the text band.
  const pen = document.createElement('canvas');
  pen.width = canvas.width; pen.height = canvas.height;
  const pc = pen.getContext('2d', { willReadFrequently: true })!;
  pc.scale(dpr, dpr);
  pc.font = `${size}px ${HAND}`;
  pc.direction = rtl ? 'rtl' : 'ltr';
  pc.textAlign = rtl ? 'right' : 'left';
  for (const ln of lines) {
    pc.fillStyle = theme.graphite; pc.fillText(ln.text, lineX(ln), ln.base);
    pc.fillStyle = theme.graphiteLight; pc.fillText(ln.text, lineX(ln) + 0.7, ln.base - 0.5); // a second, lighter pass
  }
  const bandTop = Math.max(0, Math.floor((lines[0].base - size * 1.05) * dpr));
  const bandH = Math.min(pen.height - bandTop, Math.ceil((lastBase - lines[0].base + size * 1.5) * dpr));
  const img = pc.getImageData(0, bandTop, pen.width, bandH);
  const d = img.data;
  for (let k = 3; k < d.length; k += 4) if (d[k]) d[k] = d[k] * (0.55 + rand() * 0.45);
  pc.putImageData(img, 0, bandTop);

  // 4. The schedule, built from what this line contains (60 ms between steps).
  const chars = line.length;
  const writeDur = Math.max(0.9, Math.min(1.6, 0.8 + chars * 0.014));
  let cur = writeDur;
  const slot = (dur: number) => { const from = cur + 0.06; cur = from + dur; return from; };
  const wobble = (pts: Pt[], amp: number): Pt[] => pts.map((p, i) => { const n = Math.sin(i * 0.9 + rand() * 6) * amp; return [p[0] + n * 0.4, p[1] + n]; });

  interface Mark { kind: 'due' | 'priority' | 'list'; from: number; dur: number; pts: Pt[]; bottom?: Pt[] }
  const marks: Mark[] = [];
  if (!rtl) {
    for (const t of parsed.tokens) {
      const ln = [...lines].reverse().find((l) => l.start <= t.start);
      if (!ln || t.end - ln.start > ln.text.length) continue; // the word was cut off: no mark
      const x0 = xOf(ln, t.start), x1 = xOf(ln, t.end), base = ln.base;
      if (t.kind === 'due') {
        const top: Pt[] = [], bottom: Pt[] = [];
        for (let i = 0; i <= 24; i++) {
          const x = x0 - size * 0.08 + (x1 - x0 + size * 0.16) * i / 24;
          top.push([x, base - size * (theme.highlightLow ? 0.06 : 0.5) + (rand() - 0.5) * size * 0.04 - i * size * 0.002]);
          bottom.push([x, base + size * (theme.highlightLow ? 0.14 : 0.06) + (rand() - 0.5) * size * 0.04 - i * size * 0.002]);
        }
        marks.push({ kind: 'due', dur: 0.4, from: slot(0.4), pts: top, bottom });
      } else if (t.kind === 'priority') {
        const ccx = (x0 + x1) / 2, ccy = base - size * 0.24, rx = (x1 - x0) / 2 + size * 0.15, ry = size * 0.42, ph = rand() * 6, pts: Pt[] = [];
        for (let i = 0; i <= 90; i++) {
          const a = -2.3 + (Math.PI * 2 + 0.55) * i / 90, r = 1 + 0.06 * Math.sin(a * 3 + ph);
          pts.push([ccx + Math.cos(a) * rx * r, ccy + Math.sin(a) * ry * r + i * size * 0.0007]);
        }
        marks.push({ kind: 'priority', dur: 0.45, from: slot(0.45), pts });
      } else {
        const pts: Pt[] = [];
        for (let i = 0; i <= 40; i++) pts.push([x0 - 4 + (x1 - x0 + 8) * i / 40, base + size * 0.12 + Math.sin(i * 0.7) * 2]);
        marks.push({ kind: 'list', dur: 0.25, from: slot(0.25), pts: wobble(pts, 1.1) });
      }
    }
  }
  const ax = margin + Math.min(W * 0.18, fit * 0.35);
  const ay = lastBase + size * 0.3;
  const arrow = wobble(Array.from({ length: 41 }, (_, j): Pt => { const t = j / 40; return [ax + W * 0.04 * Math.sin(t * 1.4) - 8 * t, ay + arrowLen * t]; }), 1);
  const tip = arrow[arrow.length - 1];
  const arrowFrom = slot(0.3);
  const rowFrom = cur + 0.05;
  const end = rowFrom + 0.15 + chips.length * 0.06 + 0.3 + 0.1;

  // 5. Drawing.
  const paper = paperFor(W, H, dpr, theme);
  function stroke(pts: Pt[], q: number, color: string, width: number) {
    const n = Math.max(2, Math.floor(pts.length * Math.min(1, q)));
    ctx!.strokeStyle = color; ctx!.lineCap = 'round'; ctx!.lineJoin = 'round';
    for (let i = 1; i < n; i++) {
      ctx!.lineWidth = width * (0.65 + 0.35 * Math.sin(Math.PI * i / pts.length)); // heavier mid-stroke, like a real pen
      ctx!.beginPath(); ctx!.moveTo(pts[i - 1][0], pts[i - 1][1]); ctx!.lineTo(pts[i][0], pts[i][1]); ctx!.stroke();
    }
  }
  function draw(t: number) {
    const c = ctx!;
    c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(paper, 0, 0); c.setTransform(dpr, 0, 0, dpr, 0, 0);

    for (const m of marks) { // the highlighter goes under the graphite
      if (m.kind !== 'due' || !m.bottom) continue;
      const q = ease3((t - m.from) / m.dur);
      if (q <= 0) continue;
      const n = Math.max(2, Math.round(m.pts.length * q));
      c.save(); c.globalCompositeOperation = theme.highlightBlend; c.fillStyle = theme.highlight;
      c.beginPath(); c.moveTo(m.pts[0][0], m.pts[0][1]);
      for (let i = 1; i < n; i++) c.lineTo(m.pts[i][0], m.pts[i][1]);
      for (let k = n - 1; k >= 0; k--) c.lineTo(m.bottom[k][0], m.bottom[k][1]);
      c.closePath(); c.fill(); c.restore();
    }

    // Writing: line by line, revealed behind a pen tip that wobbles.
    const p = easeWrite(t / writeDur);
    let before = 0;
    const total = lines.reduce((s, l) => s + l.text.length, 0) || 1;
    for (const ln of lines) {
      const q = clamp01((p * total - before) / (ln.text.length || 1));
      before += ln.text.length;
      if (q <= 0) break;
      const full = handWidth(ln.text) + 20;
      const w = full * q, top = ln.base - size * 1.05, bottom = ln.base + size * 0.4;
      c.save(); c.beginPath();
      if (rtl) { c.moveTo(W, top); c.lineTo(W - margin - w, top); for (let y = top; y <= bottom; y += 12) c.lineTo(W - margin - w - Math.sin(y * 0.05 + t * 9) * 8, y); c.lineTo(W, bottom); }
      else { c.moveTo(0, top); c.lineTo(margin + w, top); for (let y = top; y <= bottom; y += 12) c.lineTo(margin + w + Math.sin(y * 0.05 + t * 9) * 8, y); c.lineTo(0, bottom); }
      c.closePath(); c.clip();
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.drawImage(pen, 0, bandTop, pen.width, bandH, 0, bandTop, pen.width, bandH);
      c.restore(); c.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    for (const m of marks) {
      if (m.kind === 'due') continue;
      const q = (t - m.from) / m.dur;
      if (q > 0) stroke(m.pts, ease3(q), m.kind === 'priority' ? theme.pen : theme.graphite, m.kind === 'priority' ? Math.max(2.4, size * 0.034) : 2.4);
    }
    const aq = (t - arrowFrom) / 0.3;
    if (aq > 0) {
      stroke(arrow, ease3(aq), theme.graphite, 2.2);
      if (aq >= 1) { c.strokeStyle = theme.graphite; c.lineWidth = 2.2; c.beginPath(); c.moveTo(tip[0] - 10, tip[1] - 11); c.lineTo(tip[0], tip[1]); c.lineTo(tip[0] + 12, tip[1] - 8); c.stroke(); }
    }

    const a = ease5((t - rowFrom) / 0.35);
    if (a > 0) {
      c.save(); c.globalAlpha = a; c.translate(0, Math.round((1 - a) * 10));
      const half = titleSize * 1.25;
      c.strokeStyle = theme.line; c.lineWidth = 1;
      c.beginPath(); c.moveTo(margin, rowY - half); c.lineTo(W - margin, rowY - half); c.moveTo(margin, rowBottom); c.lineTo(W - margin, rowBottom); c.stroke();
      c.strokeStyle = theme.ink; c.lineWidth = 2.5; c.beginPath(); c.arc(margin + titleSize * 0.4, rowY, titleSize * 0.38, 0, Math.PI * 2); c.stroke();
      c.fillStyle = theme.ink; c.textBaseline = 'middle'; c.font = `700 ${titleSize}px ${SANS}`;
      c.fillText(title, titleX, rowY + 1);
      c.font = `700 ${chipSize}px ${SANS}`;
      chips.forEach((ch, i) => {
        const ca = ease5((t - rowFrom - 0.15 - i * 0.06) / 0.3);
        if (ca <= 0) return;
        const dy = Math.round((1 - ca) * 6);
        c.save(); c.globalAlpha = a * ca;
        c.beginPath(); c.roundRect(ch.x, ch.y - chipH / 2 + dy, ch.w, chipH, 7);
        if (ch.fill) { c.fillStyle = ch.fill; c.fill(); }
        if (ch.outline) { c.strokeStyle = ch.outline; c.lineWidth = 2; c.stroke(); }
        c.fillStyle = ch.fill === theme.chipYellow ? theme.chipInk : theme.ink;
        c.fillText(ch.text, ch.x + chipSize * 0.7, ch.y + 1 + dy);
        c.restore();
      });
      c.restore();
    }
  }

  // 6. The clock: clamped deltas, a speed factor, and a resumable start.
  const speed = opts.speed ?? 1;
  let t = Math.min(end, Math.max(0, opts.startAt ?? 0));
  let last = 0, raf = 0, done = false;
  const release = () => { pen.width = 0; pen.height = 0; }; // free the memory once the final frame is on screen
  const finishNow = () => { cancelAnimationFrame(raf); if (done) return; t = end; draw(t); done = true; release(); };
  if (!opts.animate) { finishNow(); return { stop() {}, finish() {}, elapsed: () => end, playing: () => false }; }
  function frame(now: number) {
    t += Math.min((now - (last || now)) / 1000, 0.05) * speed;
    last = now;
    if (t >= end) { finishNow(); return; }
    draw(t);
    raf = requestAnimationFrame(frame);
  }
  draw(t);
  raf = requestAnimationFrame(frame);
  return {
    stop() { cancelAnimationFrame(raf); done = true; },
    finish: finishNow,
    elapsed: () => t,
    playing: () => !done,
  };
}
