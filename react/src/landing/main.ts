import '@fontsource-variable/atkinson-hyperlegible-next';
import '@fontsource-variable/atkinson-hyperlegible-mono';
import '@fontsource/nanum-pen-script/latin.css';
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
let played = false;

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
// Fonts never block the hero for long: after the timeout it draws with the fallback face.
// The pen face's Korean subsets (about 110 small files) are listed only when a line has Hangul.
let korean: Promise<unknown> | null = null;
const fontsReady = (text: string, ms: number) => Promise.race([
  Promise.all([
    /\p{Script=Hangul}/u.test(text) ? (korean ??= import('@fontsource/nanum-pen-script/index.css')) : null,
  ]).then(() => Promise.all([
    document.fonts.load(`120px "Nanum Pen Script"`, text),
    document.fonts.load(`700 34px "Atkinson Hyperlegible Next Variable"`),
  ])).catch(() => {}),
  wait(ms),
]);

// Long text is cut by whole characters, so messages stay short and an emoji is never split.
const short = (text: string, max = 60) => ([...text].length > max ? [...text].slice(0, max).join('').trimEnd() + '…' : text);

function describe(text: string) {
  const p = parseLine(text);
  const shown = short(text);
  const parts = [p.dueLabel, p.tokens.some((t) => t.kind === 'priority') ? `${p.priority === 'med' ? 'medium' : p.priority} priority` : '', p.listName ? `list ${p.listName}` : ''].filter(Boolean);
  return `Pencil drawing: "${shown}" becomes the task ${p.title}${parts.length ? `, ${parts.join(', ')}` : ''}.`;
}

// The first show plays at full speed; later lines play faster, as a repeated action should.
function render(animate: boolean, startAt = 0) {
  run?.stop();
  canvas.setAttribute('aria-label', describe(line));
  canvas.textContent = describe(line);
  run = drawPencil(canvas, line, parseLine(line), readTheme(canvas), {
    animate: animate && !reduce.matches,
    speed: played ? 2.2 : 1,
    startAt,
  });
  if (animate) played = true;
}

// Live-region text: cleared first, so the same message twice is still announced.
function say(text: string, isError = false) {
  status.textContent = '';
  status.toggleAttribute('data-error', isError);
  requestAnimationFrame(() => { status.textContent = text; });
}

fontsReady(DEMO, 1500).then(() => render(true));

// Typing the next line finishes the current show at once.
input.addEventListener('input', () => {
  run?.finish();
  if (input.getAttribute('aria-invalid')) { input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby'); }
});

// A resize continues the show from the same moment; at rest it only redraws.
let resizeTimer = 0;
let lastWidth = canvas.clientWidth;
new ResizeObserver(() => {
  if (Math.abs(canvas.clientWidth - lastWidth) < 2) return;
  lastWidth = canvas.clientWidth;
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    const resume = run?.playing() ? run.elapsed() : null;
    if (resume === null) render(false);
    else { const p = played; played = false; render(true, resume); played = p; }
  }, 120);
}).observe(canvas);
dark.addEventListener('change', () => {
  try { if (!localStorage.getItem('todo-theme')) document.documentElement.dataset.theme = dark.matches ? 'dark' : 'light'; } catch { /* ignore */ }
  render(false);
});
reduce.addEventListener('change', () => { if (reduce.matches) run?.finish(); });

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) {
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', 'hero-status');
    say('Nothing to add yet. Type a task, for example "Call the bank tomorrow".', true);
    input.focus();
    return;
  }
  input.removeAttribute('aria-invalid');
  input.removeAttribute('aria-describedby');
  const p = parseLine(text);
  const result = addFromStartPage({ text: p.title, priority: p.priority, dueDate: p.dueDate, listName: p.listName });
  const details = [p.dueLabel, p.tokens.some((t) => t.kind === 'priority') ? `${p.priority === 'med' ? 'medium' : p.priority} priority` : '', p.listName ? `list ${p.listName.charAt(0).toUpperCase()}${p.listName.slice(1)}` : ''].filter(Boolean).join(', ');
  say(
    result === 'saved' ? `Added "${short(p.title)}"${details ? `: ${details}` : ''}. It is in your list on this device.`
    : result === 'pending' ? `"${short(p.title)}" is ready. It joins your synced list when you open it.`
    : 'This browser blocked saving. Open Tasks and add it there.',
    result === 'failed',
  );
  openList.hidden = result === 'failed';
  input.value = '';
  line = text;
  await fontsReady(text, 800); // a new script (Hindi, Korean) gets its glyphs before the pencil writes it
  render(true);
});

// Desktop only: put the cursor in the box, so the magic moment needs no click. On phones this
// would open the keyboard over the hero.
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) input.focus({ preventScroll: true });

// Mentions of sync show only when this build has a Firebase project behind it.
if (readConfig()) document.querySelectorAll<HTMLElement>('[data-cloud]').forEach((el) => { el.hidden = false; });

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => { /* still works online */ }); });
}
