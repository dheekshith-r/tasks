import type { ParsedLine } from './parseLine';

// "Pencil to type": the start page's hero. A typed line is written in pencil, the date gets a
// highlighter swipe, the priority a red pen circle, the list an underline, and an arrow drops to
// the clean task the app will store. Everything is drawn in code; nothing is an image file.
// It plays once and rests. With reduced motion it shows the finished frame at once.

export interface PencilTheme {
  paper: string; grain: string; graphite: string; graphiteLight: string;
  highlight: string; highlightBlend: GlobalCompositeOperation; highlightLow: boolean; pen: string;
  ink: string; line: string; chipSoft: string; chipYellow: string; chipInk: string;
}

const HAND = '"Nanum Pen Script", "Segoe Print", "Bradley Hand", cursive';
const SANS = '"Atkinson Hyperlegible Next", system-ui, sans-serif';
export const PLAY_SECONDS = 3.9;

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
const ease = (x: number) => { const c = Math.max(0, Math.min(1, x)); return 1 - (1 - c) ** 3; };
type Pt = [number, number];

export function readTheme(el: Element): PencilTheme {
  const css = getComputedStyle(el);
  const v = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
  const dark = v('--pencil-mode', 'light') === 'dark';
  return {
    paper: v('--bg', '#ffffff'),
    grain: dark ? 'rgba(255,255,255,' : 'rgba(20,20,20,',
    graphite: dark ? 'rgba(232,232,232,0.92)' : 'rgba(38,38,40,0.92)',
    graphiteLight: dark ? 'rgba(232,232,232,0.35)' : 'rgba(38,38,40,0.35)',
    // On dark paper a full yellow block would swallow the light chalk, so the marker runs low,
    // under the bottom of the word, at full strength.
    highlight: dark ? 'rgba(255,197,61,0.9)' : 'rgba(255,197,61,0.78)',
    highlightBlend: dark ? 'source-over' : 'multiply',
    highlightLow: dark,
    pen: dark ? 'rgba(255,107,118,0.95)' : 'rgba(214,40,57,0.92)',
    ink: v('--ink', '#141414'),
    line: v('--line', '#E6E6E6'),
    chipSoft: v('--soft', '#F2F2F2'),
    chipYellow: v('--sun', '#FFC53D'),
    chipInk: v('--sun-ink', '#141414'),
  };
}

export interface PencilRun { stop(): void }

export function drawPencil(canvas: HTMLCanvasElement, line: string, parsed: ParsedLine, theme: PencilTheme, animate: boolean): PencilRun {
  const W = Math.max(280, Math.round(canvas.clientWidth));
  const H = W >= 760 ? Math.round(W * 0.48) : Math.round(W * 0.92);
  canvas.style.height = `${H}px`;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  const ctx = canvas.getContext('2d');
  if (!ctx) return { stop() {} };
  const rand = rng(hash(line));

  const margin = Math.max(16, Math.round(W * 0.06));
  const base = Math.round(H * (W >= 760 ? 0.36 : 0.3));
  const rowY = Math.round(H * (W >= 760 ? 0.78 : 0.76));

  const offscreen = () => { const c = document.createElement('canvas'); c.width = canvas.width; c.height = canvas.height; const g = c.getContext('2d')!; g.scale(dpr, dpr); return [c, g] as const; };

  // Paper with a faint tooth.
  const [paper, pg] = offscreen();
  pg.fillStyle = theme.paper; pg.fillRect(0, 0, W, H);
  const specks = Math.round(W * H / 70);
  for (let i = 0; i < specks; i++) { pg.fillStyle = theme.grain + (0.015 + rand() * 0.03) + ')'; pg.fillRect(rand() * W, rand() * H, 1, 1); }

  // Handwriting, sized so the whole line fits.
  const [pen, pc] = offscreen();
  let size = Math.min(124, Math.round(W * 0.1));
  pc.font = `${size}px ${HAND}`;
  const fit = W - margin * 2;
  if (pc.measureText(line).width > fit) size = Math.max(22, Math.floor(size * fit / pc.measureText(line).width));
  pc.font = `${size}px ${HAND}`;
  pc.fillStyle = theme.graphite; pc.fillText(line, margin, base);
  pc.fillStyle = theme.graphiteLight; pc.fillText(line, margin + 0.7, base - 0.5); // a second, lighter pass
  // Graphite grain: break the strokes up so they read as pencil, not as a font.
  const img = pc.getImageData(0, 0, pen.width, pen.height);
  const d = img.data;
  for (let k = 3; k < d.length; k += 4) if (d[k]) d[k] = d[k] * (0.55 + rand() * 0.45);
  pc.putImageData(img, 0, 0);
  const textW = pc.measureText(line).width;
  const xAt = (i: number) => margin + pc.measureText(line.slice(0, i)).width;

  const wobble = (pts: Pt[], amp: number): Pt[] => pts.map((p, i) => { const n = Math.sin(i * 0.9 + rand() * 6) * amp; return [p[0] + n * 0.4, p[1] + n]; });

  interface Mark { kind: 'due' | 'priority' | 'list'; from: number; dur: number; pts: Pt[]; bottom?: Pt[] }
  const marks: Mark[] = parsed.tokens.map((t) => {
    const x0 = xAt(t.start), x1 = xAt(t.end);
    if (t.kind === 'due') {
      const top: Pt[] = [], bottom: Pt[] = [];
      for (let i = 0; i <= 24; i++) {
        const x = x0 - size * 0.08 + (x1 - x0 + size * 0.16) * i / 24;
        top.push([x, base - size * (theme.highlightLow ? 0.06 : 0.5) + (rand() - 0.5) * size * 0.04 - i * size * 0.002]);
        bottom.push([x, base + size * (theme.highlightLow ? 0.14 : 0.06) + (rand() - 0.5) * size * 0.04 - i * size * 0.002]);
      }
      return { kind: 'due', from: 1.45, dur: 0.45, pts: top, bottom };
    }
    if (t.kind === 'priority') {
      const cx = (x0 + x1) / 2, cy = base - size * 0.24, rx = (x1 - x0) / 2 + size * 0.15, ry = size * 0.42, ph = rand() * 6, pts: Pt[] = [];
      for (let i = 0; i <= 90; i++) {
        const a = -2.3 + (Math.PI * 2 + 0.55) * i / 90, r = 1 + 0.06 * Math.sin(a * 3 + ph);
        pts.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r + i * size * 0.0007]);
      }
      return { kind: 'priority', from: 1.95, dur: 0.5, pts };
    }
    const pts: Pt[] = [];
    for (let i = 0; i <= 40; i++) pts.push([x0 - 4 + (x1 - x0 + 8) * i / 40, base + size * 0.12 + Math.sin(i * 0.7) * 2]);
    return { kind: 'list', from: 2.45, dur: 0.3, pts: wobble(pts, 1.1) };
  });

  // A pencil arrow from the note down to the clean task.
  const ax = margin + Math.min(textW, W * 0.4) * 0.35, ay = base + size * 0.3, drop = rowY - ay - 46;
  const arrow = wobble(Array.from({ length: 51 }, (_, j): Pt => { const t = j / 50; return [ax + W * 0.05 * Math.sin(t * 1.4) - 10 * t, ay + drop * t]; }), 1.1);
  const tip = arrow[arrow.length - 1];

  function stroke(pts: Pt[], t: number, color: string, width: number) {
    const n = Math.max(2, Math.floor(pts.length * Math.min(1, t)));
    ctx!.strokeStyle = color; ctx!.lineCap = 'round'; ctx!.lineJoin = 'round';
    for (let i = 1; i < n; i++) {
      ctx!.lineWidth = width * (0.65 + 0.35 * Math.sin(Math.PI * i / pts.length)); // heavier mid-stroke, like a real pen
      ctx!.beginPath(); ctx!.moveTo(pts[i - 1][0], pts[i - 1][1]); ctx!.lineTo(pts[i][0], pts[i][1]); ctx!.stroke();
    }
  }

  const titleSize = Math.max(18, Math.min(34, Math.round(W * 0.027)));
  const chipSize = Math.max(13, Math.min(17, Math.round(W * 0.014)));
  const chips: { text: string; fill?: string; outline?: string }[] = [];
  if (parsed.dueLabel) chips.push({ text: parsed.dueLabel, fill: theme.chipYellow });
  if (parsed.priority !== 'med' || parsed.tokens.some((t) => t.kind === 'priority')) chips.push({ text: `${parsed.priority === 'med' ? 'Medium' : parsed.priority === 'high' ? 'High' : 'Low'} priority`, outline: theme.ink });
  if (parsed.listName) chips.push({ text: parsed.listName.charAt(0).toUpperCase() + parsed.listName.slice(1), fill: theme.chipSoft });

  function row(t: number) {
    const a = ease((t - 2.85) / 0.4);
    if (a <= 0) return;
    const c = ctx!;
    c.save(); c.globalAlpha = a; c.translate(0, (1 - a) * 12);
    const half = titleSize * 1.3;
    c.strokeStyle = theme.line; c.lineWidth = 1;
    c.beginPath(); c.moveTo(margin, rowY - half); c.lineTo(W - margin, rowY - half); c.moveTo(margin, rowY + half); c.lineTo(W - margin, rowY + half); c.stroke();
    c.strokeStyle = theme.ink; c.lineWidth = 2.5; c.beginPath(); c.arc(margin + titleSize * 0.4, rowY, titleSize * 0.38, 0, Math.PI * 2); c.stroke();
    c.fillStyle = theme.ink; c.textBaseline = 'middle'; c.font = `700 ${titleSize}px ${SANS}`;
    const titleX = margin + titleSize * 1.4;
    c.fillText(parsed.title, titleX, rowY + 1);
    const titleWidth = c.measureText(parsed.title).width; // measured in the title font, before switching
    // Chips wrap below the title on narrow screens.
    c.font = `700 ${chipSize}px ${SANS}`;
    let cx = titleX + titleWidth + chipSize * 1.4;
    let cy = rowY;
    chips.forEach((ch, i) => {
      const ca = ease((t - 3.05 - i * 0.09) / 0.3);
      const w = c.measureText(ch.text).width + chipSize * 1.4, h = chipSize * 2;
      if (cx + w > W - margin) { cx = titleX; cy = rowY + half + h * 0.75; }
      if (ca > 0) {
        c.save(); c.globalAlpha = a * ca;
        c.beginPath(); c.roundRect(cx, cy - h / 2 + (1 - ca) * 6, w, h, 7);
        if (ch.fill) { c.fillStyle = ch.fill; c.fill(); }
        if (ch.outline) { c.strokeStyle = ch.outline; c.lineWidth = 2; c.stroke(); }
        c.fillStyle = ch.fill === theme.chipYellow ? theme.chipInk : theme.ink;
        c.fillText(ch.text, cx + chipSize * 0.7, cy + 1 + (1 - ca) * 6);
        c.restore();
      }
      cx += w + chipSize * 0.6;
    });
    c.restore();
  }

  let raf = 0;
  const start = performance.now();
  function frame(now: number) {
    const c = ctx!;
    const t = animate ? (now - start) / 1000 : PLAY_SECONDS;
    c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(paper, 0, 0); c.setTransform(dpr, 0, 0, dpr, 0, 0);

    for (const m of marks) { // the highlighter goes under the graphite
      if (m.kind !== 'due' || !m.bottom) continue;
      const q = ease((t - m.from) / m.dur);
      if (q <= 0) continue;
      const n = Math.max(2, Math.round(m.pts.length * q));
      c.save(); c.globalCompositeOperation = theme.highlightBlend; c.fillStyle = theme.highlight;
      c.beginPath(); c.moveTo(m.pts[0][0], m.pts[0][1]);
      for (let i = 1; i < n; i++) c.lineTo(m.pts[i][0], m.pts[i][1]);
      for (let k = n - 1; k >= 0; k--) c.lineTo(m.bottom[k][0], m.bottom[k][1]);
      c.closePath(); c.fill(); c.restore();
    }

    // Writing: revealed left to right behind a pen tip that wobbles.
    const w = (margin + textW + 20) * ease(t / 1.35);
    c.save(); c.beginPath(); c.moveTo(0, 0); c.lineTo(w, 0);
    for (let y = 0; y <= H; y += 24) c.lineTo(w + Math.sin(y * 0.05 + t * 9) * 10, y);
    c.lineTo(0, H); c.closePath(); c.clip();
    c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(pen, 0, 0); c.restore();
    c.setTransform(dpr, 0, 0, dpr, 0, 0);

    for (const m of marks) {
      if (m.kind === 'due') continue;
      const q = (t - m.from) / m.dur;
      if (q > 0) stroke(m.pts, ease(q), m.kind === 'priority' ? theme.pen : theme.graphite, m.kind === 'priority' ? Math.max(2.4, size * 0.034) : 2.4);
    }
    const aq = (t - 2.55) / 0.35;
    if (aq > 0) {
      stroke(arrow, ease(aq), theme.graphite, 2.2);
      if (aq >= 1) { c.strokeStyle = theme.graphite; c.lineWidth = 2.2; c.beginPath(); c.moveTo(tip[0] - 11, tip[1] - 12); c.lineTo(tip[0], tip[1]); c.lineTo(tip[0] + 13, tip[1] - 9); c.stroke(); }
    }
    row(t);
    if (t < PLAY_SECONDS) raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  return { stop: () => cancelAnimationFrame(raf) };
}
