import { readConfig } from '../firebaseConfig';
import { addFromStartPage } from '../handoff';
import { parseLine } from './parseLine';
import { drawPencil, readTheme, type PencilRun } from './pencil';
import './landing.css';

const DEMO = 'Pay rent friday !high #home';

const canvas = document.getElementById('pencil') as HTMLCanvasElement;
const form = document.getElementById('hero-form') as HTMLFormElement;
const input = document.getElementById('hero-line') as HTMLInputElement;
const status = document.getElementById('hero-status') as HTMLElement;
const openList = document.getElementById('hero-open') as HTMLAnchorElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
const dark = window.matchMedia('(prefers-color-scheme: dark)');

let line = DEMO;
let run: PencilRun | null = null;

function describe(text: string) {
  const p = parseLine(text);
  const parts = [p.dueLabel, p.tokens.some((t) => t.kind === 'priority') ? `${p.priority === 'med' ? 'medium' : p.priority} priority` : '', p.listName ? `list ${p.listName}` : ''].filter(Boolean);
  return `Handwritten in pencil: "${text}". It becomes the task "${p.title}"${parts.length ? `, ${parts.join(', ')}` : ''}.`;
}

function render(animate: boolean) {
  run?.stop();
  canvas.setAttribute('aria-label', describe(line));
  run = drawPencil(canvas, line, parseLine(line), readTheme(canvas), animate && !reduce.matches);
}

// Draw only once the handwriting and UI fonts are in, so the first stroke is the real one.
Promise.all([
  document.fonts.load(`120px "Nanum Pen Script"`, line),
  document.fonts.load(`700 34px "Atkinson Hyperlegible Next"`),
]).catch(() => {}).then(() => render(true));

// A resize or a theme change redraws the finished frame; it never replays the animation.
let resizeTimer = 0;
let lastWidth = canvas.clientWidth;
new ResizeObserver(() => {
  if (Math.abs(canvas.clientWidth - lastWidth) < 2) return;
  lastWidth = canvas.clientWidth;
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => render(false), 120);
}).observe(canvas);
dark.addEventListener('change', () => {
  try { if (!localStorage.getItem('todo-theme')) document.documentElement.dataset.theme = dark.matches ? 'dark' : 'light'; } catch { /* ignore */ }
  render(false);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) {
    status.textContent = 'Type a task first, for example "Call the bank tomorrow".';
    input.setAttribute('aria-invalid', 'true');
    input.focus();
    return;
  }
  input.removeAttribute('aria-invalid');
  const p = parseLine(text);
  line = text;
  render(true);
  const result = addFromStartPage({ text: p.title, priority: p.priority, dueDate: p.dueDate, listName: p.listName });
  status.textContent =
    result === 'saved' ? `Added "${p.title}" to your list on this device.`
    : result === 'pending' ? `"${p.title}" is ready. It joins your synced list when you open it.`
    : 'This browser blocked saving. Open Tasks and add it there.';
  openList.hidden = result === 'failed';
  input.value = '';
});

// Mentions of sync show only when this build has a Firebase project behind it.
if (readConfig()) document.querySelectorAll<HTMLElement>('[data-cloud]').forEach((el) => { el.hidden = false; });

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => { /* still works online */ }); });
}
