import '@fontsource-variable/overpass';
import '@fontsource-variable/overpass-mono';
import '@fontsource/kalam/400.css';
import { readConfig } from '../firebaseConfig';
import { addFromStartPage } from '../handoff';
import { parseLine } from './parseLine';
import { captureDates, heroIntro, inkFrame, lineMirror, scenes } from './scenes';
import './landing.css';

type Slot = 'today' | 'tomorrow' | 'week' | 'later';
interface Slip { text: string; list?: string; high: boolean; off: number | null; fresh?: boolean }

const form = document.getElementById('hero-form') as HTMLFormElement;
const input = document.getElementById('hero-line') as HTMLInputElement;
const status = document.getElementById('hero-status') as HTMLElement;
const openList = document.getElementById('hero-open') as HTMLAnchorElement;
const SVG = 'http://www.w3.org/2000/svg';

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const today = startOfDay(new Date());
const dayAt = (off: number) => { const d = new Date(today); d.setDate(d.getDate() + off); return d; };
const short = (d: Date) => d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
const slotOf = (off: number | null): Slot => (off === null || off > 6 || off < 0 ? 'later' : off === 0 ? 'today' : off === 1 ? 'tomorrow' : 'week');
const SLOT_NAME: Record<Slot, string> = { today: 'Today', tomorrow: 'Tomorrow', week: 'This week', later: 'Later' };

// A sample week, dated from the visitor's real today so it never goes stale.
const SAMPLE: Slip[] = [
  { text: 'Pick up the dry-cleaning', list: 'home', high: false, off: 0 },
  { text: 'Call Amma about Sunday lunch', list: 'family', high: false, off: 0 },
  { text: 'Lunch at Amma’s, bring Mysore pak', list: 'family', high: false, off: 1 },
  { text: 'Pay the electricity bill, ₹1,840', list: 'home', high: true, off: 4 },
  { text: 'Send the expense report to Priya', list: 'work', high: false, off: 6 },
  { text: 'Book the Pongal train to Madurai', list: 'travel', high: false, off: null },
];

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text) node.textContent = text;
  return node;
}

// The postmark: two rings, the date and four wavy cancel lines, roughened by the #ink filter.
function postmark(): SVGSVGElement {
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('class', 'postmark');
  svg.setAttribute('viewBox', '0 0 124 64');
  svg.setAttribute('aria-hidden', 'true');
  const g = document.createElementNS(SVG, 'g');
  g.setAttribute('filter', 'url(#ink)');
  g.setAttribute('fill', 'none');
  g.setAttribute('stroke', 'currentColor');
  const shape = (name: string, attrs: Record<string, string>) => {
    const s = document.createElementNS(SVG, name);
    for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v);
    g.append(s);
  };
  shape('circle', { cx: '32', cy: '32', r: '28', 'stroke-width': '2.2' });
  shape('circle', { cx: '32', cy: '32', r: '21', 'stroke-width': '1.2' });
  for (const y of [20, 29, 38, 47]) shape('path', { d: `M64 ${y} q7 -6 14 0 t14 0 t14 0 t14 0`, 'stroke-width': '2' });
  svg.append(g);
  const label = (y: number, size: number, text: string) => {
    const t = document.createElementNS(SVG, 'text');
    t.setAttribute('x', '32'); t.setAttribute('y', String(y)); t.setAttribute('text-anchor', 'middle');
    t.setAttribute('font-size', String(size));
    t.textContent = text;
    svg.append(t);
  };
  label(30, 9, today.toLocaleDateString(undefined, { day: '2-digit', month: 'short' }).toUpperCase());
  label(41, 7, 'TASKS');
  return svg;
}

function slipNode(s: Slip): HTMLLIElement {
  const li = el('li', s.fresh ? 'slip fresh' : 'slip');
  const text = el('p', 'slip-text', s.text);
  text.dir = 'auto';
  const meta = el('p', 'slip-meta');
  const slot = slotOf(s.off);
  if (s.off !== null && slot !== 'today' && slot !== 'tomorrow') meta.append(el('span', 'due', short(dayAt(s.off))));
  if (s.high) meta.append(el('span', 'tag tag-high', '!high'));
  if (s.list) meta.append(el('span', 'tag', `#${s.list}`));
  li.append(text);
  if (meta.childNodes.length) li.append(meta);
  if (s.fresh) li.append(postmark());
  return li;
}

const slotList = (slot: Slot) => document.querySelector<HTMLUListElement>(`[data-slot="${slot}"] .slips`)!;

// Slot labels carry the real date; screen readers hear "Today, Saturday 14 November".
function labelSlots() {
  const set = (slot: Slot, name: string, d: Date) => {
    const h = document.getElementById(`slot-${slot}`)!;
    h.textContent = `${name} · `;
    const date = el('span', 'date', short(d));
    h.append(date);
    h.setAttribute('aria-label', `${name}, ${d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}`);
  };
  set('today', 'Today', today);
  set('tomorrow', 'Tomorrow', dayAt(1));
}

function fill() {
  for (const s of SAMPLE) slotList(slotOf(s.off)).append(slipNode(s));
}

// Live-region text: cleared first, so the same message twice is still announced.
function say(text: string, isError = false) {
  status.textContent = '';
  status.toggleAttribute('data-error', isError);
  requestAnimationFrame(() => { status.textContent = text; });
}

labelSlots();
fill();
const frame = document.getElementById('frame');
const mirror = document.querySelector<HTMLElement>('.line-mirror-in');
if (frame) { inkFrame(frame); heroIntro(frame, document.querySelector('.chute'), document.querySelector('.aside')); }
document.querySelectorAll<HTMLElement>('.cap-frame').forEach(inkFrame);
if (mirror) lineMirror(input, mirror);
captureDates();
scenes();

input.addEventListener('input', () => {
  if (input.getAttribute('aria-invalid')) { input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby'); }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const line = input.value.trim();
  if (!line) {
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', 'hero-status');
    say('Nothing to add yet. Type a task, for example "Call the bank tomorrow".', true);
    input.focus();
    return;
  }
  input.removeAttribute('aria-invalid');
  input.removeAttribute('aria-describedby');
  const p = parseLine(line);
  const result = addFromStartPage({ text: p.title, priority: p.priority, dueDate: p.dueDate, listName: p.listName });
  const off = p.dueDate ? Math.round((startOfDay(new Date(`${p.dueDate}T00:00`)).getTime() - today.getTime()) / 86_400_000) : null;
  const slot = slotOf(off);

  if (result !== 'failed') {
    input.value = ''; // on failure the line stays in the box, so nothing typed is lost
    input.dispatchEvent(new Event('input'));
    document.querySelectorAll('.slip.fresh').forEach((n) => n.classList.remove('fresh'));
    document.querySelectorAll('.slip .postmark').forEach((n) => n.remove());
    slotList(slot).prepend(slipNode({ text: p.title, list: p.listName, high: p.priority === 'high', off, fresh: true }));
  }
  const title = [...p.title].length > 60 ? `${[...p.title].slice(0, 60).join('').trimEnd()}…` : p.title;
  const extras = [p.priority === 'high' ? 'high priority' : '', p.listName ? `list ${p.listName}` : ''].filter(Boolean).join(', ');
  say(
    result === 'saved' ? `Filed under ${SLOT_NAME[slot]}${extras ? `, ${extras}` : ''}: "${title}". It is in your list on this device.`
    : result === 'pending' ? `"${title}" is ready. It joins your synced list when you open it.`
    : 'Saving was blocked, so your line is still in the box. Open Tasks and paste it there.',
    result === 'failed',
  );
  openList.hidden = false;
});

// No focus on load (screen readers would skip the headline). The skip link goes straight to the
// box, and "n" puts the cursor there from anywhere, as in the app.
document.addEventListener('keydown', (e) => {
  const el = e.target as HTMLElement;
  if (e.key !== 'n' || e.metaKey || e.ctrlKey || e.altKey || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName) || el.isContentEditable) return;
  e.preventDefault();
  input.focus();
});

// Mentions of sync show only when this build has a Firebase project behind it.
if (readConfig()) document.querySelectorAll<HTMLElement>('[data-cloud]').forEach((n) => { n.hidden = false; });

// Follow the system theme when the visitor has not picked one in the app.
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  try { if (!localStorage.getItem('todo-theme')) document.documentElement.dataset.theme = e.matches ? 'dark' : 'light'; } catch { /* ignore */ }
});

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => { /* still works online */ }); });
}
