import { parseLine } from './parseLine';

// The start page's drawing and motion. Everything here is progressive: without it (no script, or
// reduced motion) the page is complete and still. Only transform, opacity and visibility change.

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const out = (t: number) => 1 - (1 - t) ** 3;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const SVG = 'http://www.w3.org/2000/svg';
export const motionOn = () => document.documentElement.classList.contains('motion');

// A small seeded random source, so a drawing looks the same on every visit.
export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
}

// One hand-drawn line: two loose passes whose ends and middle drift a little, like a pen going twice.
export function sketch(x1: number, y1: number, x2: number, y2: number, r: () => number): [string, string] {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const j = Math.min(2.4, 0.6 + len / 140);
  const pass = (k: number) => {
    const n = () => (r() - 0.5) * j * k;
    const mx = (x1 + x2) / 2 + n() * 1.6, my = (y1 + y2) / 2 + n() * 1.6;
    return `M${(x1 + n()).toFixed(1)} ${(y1 + n()).toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${(x2 + n()).toFixed(1)} ${(y2 + n()).toFixed(1)}`;
  };
  return [pass(1), pass(1.8)];
}

// The sorting frame's rules, drawn by hand over the real grid (which stays as the fallback).
export function inkFrame(frame: HTMLElement) {
  const svg = frame.querySelector<SVGSVGElement>('.frame-ink');
  if (!svg) return;
  const main = document.createElementNS(SVG, 'path');
  const echo = document.createElementNS(SVG, 'path');
  main.setAttribute('class', 'main');
  echo.setAttribute('class', 'echo');
  svg.append(echo, main);
  const draw = () => {
    const fr = frame.getBoundingClientRect();
    const W = fr.width + 6, H = fr.height + 6;
    svg.setAttribute('viewBox', `0 0 ${W.toFixed(1)} ${H.toFixed(1)}`);
    const r = rng(11);
    const o = 1.6;
    const lines: number[][] = [[o, o, W - o, o], [W - o, o, W - o, H - o], [W - o, H - o, o, H - o], [o, H - o, o, o]];
    const slots = [...frame.querySelectorAll<HTMLElement>('.slot')].map((el) => {
      const b = el.getBoundingClientRect();
      return { l: b.left - fr.left + 3, t: b.top - fr.top + 3, r: b.right - fr.left + 3, b: b.bottom - fr.top + 3 };
    });
    for (const a of slots) for (const b of slots) {
      if (Math.abs(b.l - a.r - 3) < 2 && Math.abs(b.t - a.t) < 2) lines.push([(a.r + b.l) / 2, Math.min(a.t, b.t) - 1, (a.r + b.l) / 2, Math.max(a.b, b.b) + 1]);
      if (Math.abs(b.t - a.b - 3) < 2 && Math.abs(b.l - a.l) < 2) lines.push([a.l - 1, (a.b + b.t) / 2, a.r + 1, (a.b + b.t) / 2]);
    }
    const passes = lines.map(([x1, y1, x2, y2]) => sketch(x1, y1, x2, y2, r));
    main.setAttribute('d', passes.map((p) => p[0]).join(' '));
    echo.setAttribute('d', passes.map((p) => p[1]).join(' '));
    frame.classList.add('inked');
  };
  let queued = false;
  new ResizeObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; draw(); });
  }).observe(frame);
  draw();
}

// The input marks the words it understands while you type, inside the box, using the real parser.
export function lineMirror(input: HTMLInputElement, mirrorIn: HTMLElement) {
  const KIND = { due: 'm-due', priority: 'm-pr', list: 'm-list' } as const;
  const sync = () => { mirrorIn.style.transform = `translateX(${-input.scrollLeft}px)`; };
  const render = () => {
    const v = input.value;
    mirrorIn.textContent = '';
    let i = 0;
    for (const t of v ? parseLine(v).tokens : []) {
      if (t.start > i) mirrorIn.append(v.slice(i, t.start));
      const s = document.createElement('span');
      s.className = KIND[t.kind];
      s.textContent = v.slice(t.start, t.end);
      mirrorIn.append(s);
      i = t.end;
    }
    if (i < v.length) mirrorIn.append(v.slice(i));
    requestAnimationFrame(sync);
  };
  mirrorIn.parentElement?.setAttribute('dir', 'auto');
  for (const ev of ['input', 'focus', 'select', 'keyup']) input.addEventListener(ev, ev === 'input' ? render : sync);
  input.addEventListener('scroll', sync);
  document.documentElement.classList.add('mirror-on');
  render();
}

// Hero, once per visit: three-quarters of a second after load, the sample slips come down the chute
// one by one and settle into their days; then the handwritten arrow draws itself toward the box.
export function heroIntro(frame: HTMLElement, chute: Element | null, aside: HTMLElement | null) {
  const root = document.documentElement;
  let seen = false;
  try { seen = sessionStorage.getItem('tasks-intro') === '1'; sessionStorage.setItem('tasks-intro', '1'); } catch { /* storage blocked */ }
  if (!motionOn() || seen || !chute) { aside?.classList.add('drawn'); return; }
  root.classList.add('intro');
  const c = chute.getBoundingClientRect();
  const mx = c.left + c.width / 2, my = c.top + c.height * 0.9;
  const slips = [...frame.querySelectorAll<HTMLElement>('.slip')];
  const START = 300, GAP = 150, DUR = 640;
  slips.forEach((el, i) => {
    const b = el.getBoundingClientRect();
    const dx = mx - (b.left + b.width / 2), dy = my - b.top;
    el.animate([
      { transform: `translate(${dx}px, ${dy - 80}px) rotate(-7deg) scale(.45)`, opacity: 0 },
      { transform: `translate(${dx}px, ${dy}px) rotate(-3deg) scale(.5)`, opacity: 1, offset: 0.3 },
      { transform: 'none', opacity: 1 },
    ], { duration: DUR, delay: START + i * GAP, easing: 'cubic-bezier(.23, 1, .32, 1)', fill: 'backwards' });
  });
  setTimeout(() => { root.classList.remove('intro'); aside?.classList.add('drawn'); }, START + slips.length * GAP + DUR - 120);
}

// Real dates in the capture example, with or without motion: "friday" means the next Friday from today.
export function captureDates() {
  const parsed = parseLine('Pay rent friday !high #home');
  if (!parsed.dueDate) return;
  const d = new Date(`${parsed.dueDate}T00:00`);
  document.querySelectorAll('.h-due').forEach((n) => { n.textContent = d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase(); });
  document.querySelectorAll('.cap-day').forEach((n) => { n.textContent = d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' }); });
}

type Scene = { el: HTMLElement; run: (p: number) => void; measure?: () => void };

// 2 · Pain: the six pieces are pulled into one envelope, which drops into the slot.
// On a phone the drawing is re-laid as a tall pile in two columns, so it can be drawn twice as big.
const PHONE_PILE = { box: '0 0 560 830', pos: [[130, 120], [400, 95], [420, 270], [150, 330], [410, 470], [160, 560]], env: [280, 700], mouth: [-220, 230], drop: 90 };
export function pain(el: HTMLElement, moving: boolean): Scene | null {
  const svg = el.querySelector<SVGSVGElement>('.pain-art');
  const env = el.querySelector<SVGGElement>('.envelope');
  const mouth = el.querySelector<SVGGElement>('.slot-mouth');
  const arrows = el.querySelector<SVGGElement>('.arrows');
  if (!svg || !env) return null;
  const pieces = [...el.querySelectorAll<SVGGElement>('.piece')].map((g) => ({ g, x: Number(g.dataset.x), y: Number(g.dataset.y), bx: 0, by: 0 }));
  const phone = matchMedia('(max-width: 560px)');
  let EX = 500, EY = 288, ebx = 0, eby = 0, DROP = 240, lastP = -1;

  const measure = () => {
    const pile = phone.matches;
    svg.setAttribute('viewBox', pile ? PHONE_PILE.box : '0 0 1000 600');
    el.classList.toggle('pain-pile', pile);
    pieces.forEach((pc, i) => {
      const [px, py] = pile ? PHONE_PILE.pos[i] : [pc.x, pc.y];
      pc.bx = px - pc.x; pc.by = py - pc.y;
    });
    [EX, EY] = pile ? PHONE_PILE.env : [500, 288];
    [ebx, eby] = pile ? [PHONE_PILE.env[0] - 500, PHONE_PILE.env[1] - 288] : [0, 0];
    DROP = pile ? PHONE_PILE.drop : 240;
    if (mouth) mouth.style.transform = pile ? `translate(${PHONE_PILE.mouth[0]}px, ${PHONE_PILE.mouth[1]}px)` : '';
    run(moving ? Math.max(lastP, 0) : -1);
  };

  // p = -1 is the still picture: every piece in its place, the envelope faint in the middle.
  const run = (p: number) => {
    lastP = p;
    const e = p < 0 ? 0 : inOut(clamp((p - 0.2) / 0.42));
    for (const { g, x, y, bx, by } of pieces) {
      const tx = bx + (EX - x - bx) * e, ty = by + (EY - y - by) * e;
      g.style.transform = tx || ty || e ? `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) rotate(${(e * 8).toFixed(1)}deg) scale(${(1 - 0.82 * e).toFixed(3)})` : '';
      g.style.opacity = String(1 - clamp((e - 0.72) / 0.28));
    }
    if (arrows) arrows.style.opacity = String(1 - clamp(e * 1.8));
    const show = p < 0 ? 1 : out(clamp((p - 0.32) / 0.22)); // the envelope opens as the pieces start to gather
    const drop = p < 0 ? 0 : inOut(clamp((p - 0.78) / 0.18));
    if (p >= 0) env.style.opacity = String(show * (1 - clamp((drop - 0.75) / 0.25)));
    env.style.transform = `translate(${ebx}px, ${(eby + drop * DROP).toFixed(1)}px) scale(${(0.7 + 0.3 * show).toFixed(3)})`;
  };
  phone.addEventListener('change', measure);
  measure();
  return { el, run, measure };
}

// 3 · Capture: the line types itself, the three words light up, then each flies to its place on a slip.
function capture(el: HTMLElement): Scene | null {
  const stage = el.querySelector<HTMLElement>('.cap-stage');
  const line = stage?.querySelector<HTMLElement>('.cap-line');
  const text = line?.querySelector<HTMLElement>('.cap-text');
  const caret = line?.querySelector<HTMLElement>('.cap-caret');
  if (!stage || !line || !text || !caret) return null;

  // Split the line into one span per character, so it can be typed out across line wraps.
  const chars: HTMLElement[] = [];
  const walk = (node: Node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        for (const ch of [...(child.textContent ?? '')]) {
          const s = document.createElement('span');
          s.className = 'ch';
          s.textContent = ch;
          chars.push(s);
          frag.append(s);
        }
        child.replaceWith(frag);
      } else walk(child);
    }
  };
  walk(text);

  const flights = ([['.w-title', '.h-title', 0.8, 0.95], ['.tok-due', '.h-due', 0.36, 0.52], ['.tok-pr', '.h-pr', 0.5, 0.66], ['.tok-list', '.h-list', 0.64, 0.8]] as const)
    .map(([s, h, a, b]) => {
      const src = line.querySelector<HTMLElement>(s)!;
      const hole = stage.querySelector<HTMLElement>(h)!;
      const fly = src.cloneNode(true) as HTMLElement;
      fly.classList.add('fly');
      stage.append(fly);
      return { src, hole, fly, a, b, fx: 0, fy: 0, fh: 1, tx: 0, ty: 0, th: 1 };
    });
  let rects: { x: number; y: number; h: number }[] = [];
  let lastP = -1;

  const measure = () => {
    const sr = stage.getBoundingClientRect();
    const lr = line.getBoundingClientRect();
    rects = chars.map((c) => { const r = c.getBoundingClientRect(); return { x: r.right - lr.left, y: r.top - lr.top, h: r.height }; });
    for (const f of flights) {
      const a = f.src.getBoundingClientRect(), b = f.hole.getBoundingClientRect();
      f.fx = a.left - sr.left; f.fy = a.top - sr.top; f.fh = a.height || 1;
      f.tx = b.left - sr.left; f.ty = b.top - sr.top; f.th = b.height || 1;
    }
    if (lastP >= 0) run(lastP);
  };

  const run = (p: number) => {
    lastP = p;
    const k = Math.round(clamp(p / 0.3) * chars.length);
    chars.forEach((c, i) => c.classList.toggle('hid', i >= k));
    const at = rects[Math.max(0, k - 1)];
    if (at) { caret.style.transform = `translate(${(k ? at.x : at.x - 14).toFixed(1)}px, ${at.y.toFixed(1)}px)`; caret.style.height = `${at.h.toFixed(1)}px`; }
    caret.style.opacity = p < 0.33 ? '1' : '0';
    line.classList.toggle('lit', p > 0.31);
    for (const f of flights) {
      const t = inOut(clamp((p - f.a) / (f.b - f.a)));
      const flying = t > 0 && t < 1;
      const s = lerp(1, f.th / f.fh, t);
      f.fly.style.transform = `translate(${lerp(f.fx, f.tx, t).toFixed(1)}px, ${(lerp(f.fy, f.ty, t) - Math.sin(Math.PI * t) * 46).toFixed(1)}px) scale(${s.toFixed(3)})`;
      f.fly.style.opacity = flying ? String(1 - clamp((t - 0.88) / 0.12)) : '0';
      f.src.style.opacity = t > 0 ? '0.18' : '';
      f.hole.style.opacity = String(clamp((t - 0.82) / 0.18));
    }
  };
  return { el, run, measure };
}

// 7 · Calm: night turns to morning. The moon goes, the sun climbs, the two unfinished slips slide
// into Carried over and turn grey, the red "14 overdue" of other apps is crossed out by hand.
// There are two drawings, wide and tall (phones); both are driven, only one is shown.
function calmArt(svg: SVGSVGElement) {
  const arc = svg.querySelector<SVGPathElement>('.arc');
  const moon = svg.querySelector<SVGGElement>('.moon');
  const sun = svg.querySelector<SVGGElement>('.sun');
  const morning = svg.querySelector<SVGTextElement>('.calm-morning');
  const note = svg.querySelector<SVGTextElement>('.calm-note');
  if (!arc || !moon || !sun || !morning || !note) return null;
  const slips = [...svg.querySelectorAll<SVGGElement>('.cslip')].map((g) => ({ g, dx: Number(g.dataset.dx) || 0, dy: Number(g.dataset.dy) || 0 }));
  const strikes = [...svg.querySelectorAll<SVGPathElement>('.strike')].map((s) => ({ s, len: 0 }));
  let L = 0;
  const measure = () => {
    L = arc.getTotalLength();
    for (const k of strikes) { k.len = k.s.getTotalLength(); k.s.style.strokeDasharray = `${k.len.toFixed(1)}`; }
  };
  const run = (p: number) => {
    moon.style.opacity = String(1 - clamp((p - 0.08) / 0.22));
    const t = out(clamp((p - 0.1) / 0.42));
    const at = arc.getPointAtLength(L * lerp(0.03, 0.3, t));
    sun.style.transform = `translate(${at.x.toFixed(1)}px, ${at.y.toFixed(1)}px)`;
    sun.style.opacity = String(clamp(t * 5));
    morning.style.opacity = String(clamp((p - 0.46) / 0.1));
    slips.forEach(({ g, dx, dy }, i) => {
      const e = inOut(clamp((p - 0.18 - i * 0.06) / 0.3));
      g.style.transform = `translate(${(dx * e).toFixed(1)}px, ${(dy * e - Math.sin(Math.PI * e) * 26).toFixed(1)}px)`;
      g.classList.toggle('carried', e >= 1);
    });
    strikes.forEach(({ s, len }, i) => { s.style.strokeDashoffset = (len * (1 - clamp((p - 0.56 - i * 0.07) / 0.12))).toFixed(1); });
    note.style.opacity = String(clamp((p - 0.76) / 0.1));
  };
  return { run, measure };
}
function calm(el: HTMLElement): Scene | null {
  const arts = [...el.querySelectorAll<SVGSVGElement>('.calm-art')].map(calmArt).filter((a) => a !== null);
  if (!arts.length) return null;
  return { el, run: (p) => { for (const a of arts) a.run(p); }, measure: () => { for (const a of arts) a.measure(); } };
}

// Pinned scenes advance with the scroll position. One listener, one frame of work per scroll.
export function scenes() {
  const p = document.getElementById('pain');
  if (!motionOn()) { if (p) pain(p, false); return; } // still picture; on a phone, the tall pile
  const list: Scene[] = [];
  const c = document.getElementById('capture');
  const n = document.getElementById('calm');
  const gather = p ? pain(p, true) : null;
  if (gather) list.push(gather);
  const cap = c ? capture(c) : null;
  if (cap) list.push(cap);
  const night = n ? calm(n) : null;
  if (night) list.push(night);
  if (!list.length) return;
  document.documentElement.classList.add('scenes-on');
  let queued = false;
  // A scene measures itself only when it comes near, so the page does no layout work up front
  // for scenes far below.
  const dirty = new Set(list);
  const tick = () => {
    queued = false;
    const vh = window.innerHeight;
    for (const s of list) {
      const r = s.el.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) continue;
      if (dirty.delete(s)) s.measure?.();
      const span = r.height - vh;
      s.run(span > 0 ? clamp(-r.top / span) : clamp((vh - r.top) / vh));
    }
  };
  const request = () => { if (!queued) { queued = true; requestAnimationFrame(tick); } };
  const remeasure = () => { for (const s of list) dirty.add(s); request(); };
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', remeasure);
  remeasure();
  document.fonts?.ready.then(remeasure).catch(() => {});
}
