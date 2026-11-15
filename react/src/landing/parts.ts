import { dueInfo, todayISO } from '../dates';
import { motionOn, rng, sketch } from './scenes';

// Sections 4 to 9 of the start page. Each one is complete as plain HTML; this code adds the live
// parts. Motion runs only when the visitor allows it (the `motion` class on <html>).

const SVG = 'http://www.w3.org/2000/svg';
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const dayAt = (off: number) => { const d = startOfDay(new Date()); d.setDate(d.getDate() + off); return d; };
const shortDay = (d: Date) => d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text) node.textContent = text;
  return node;
}

// Runs `fn` once, when `target` comes within one screen of view: set-up work for the sections
// below waits until someone scrolls toward them.
export function whenNear(target: Element | null, fn: () => void) {
  if (!target) return;
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); fn(); }
  }, { rootMargin: '100% 0px' });
  io.observe(target);
}

// Runs `fn` once, the first time `target` is mostly on screen.
function onView(target: Element, fn: () => void, threshold = 0.4) {
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); fn(); }
  }, { threshold });
  io.observe(target);
}

/* ---------- 4 · The demo: the app's views on sample tasks dated from the visitor's today ---------- */

interface DemoTask { text: string; off: number | null; high?: boolean; list?: string; repeat?: string }
const TASKS: DemoTask[] = [
  { text: 'Renew passport', off: 0, high: true, list: 'documents' },
  { text: 'Call Amma about Sunday lunch', off: 0, list: 'family' },
  { text: 'Water the tulsi plant', off: 0, repeat: 'repeats daily' },
  { text: 'Return the library book', off: -1 },
  { text: 'Reply to the landlord', off: -2, list: 'home' },
  { text: 'Lunch at Amma’s, bring Mysore pak', off: 1, list: 'family' },
  { text: 'Dentist at 5:30', off: 2, list: 'health' },
  { text: 'Pay the electricity bill, ₹1,840', off: 4, high: true, list: 'home' },
  { text: 'Send the expense report to Priya', off: 6, list: 'work' },
  { text: 'Book the Pongal train to Madurai', off: null, list: 'travel' },
];
// The app's own command menu entries (App.tsx), in its order.
const COMMANDS: { label: string; view?: View }[] = [
  { label: 'New task' }, { label: 'Search tasks', view: 'search' }, { label: 'Go to All tasks' },
  { label: 'Go to Today', view: 'today' }, { label: 'Go to Upcoming', view: 'upcoming' },
  { label: 'Go to Carried over', view: 'carried' }, { label: 'Switch to dark theme' }, { label: 'Export backup' },
];
type View = 'today' | 'upcoming' | 'carried' | 'search' | 'commands';
const TITLES: Record<View, string> = { today: 'Today', upcoming: 'Upcoming', carried: 'Carried over', search: 'Search', commands: 'Commands' };

// Text with every match of `q` wrapped in <mark>.
function marked(text: string, q: string): Node[] {
  if (!q) return [document.createTextNode(text)];
  const out: Node[] = [];
  const lower = text.toLowerCase(), needle = q.toLowerCase();
  let i = 0;
  for (let at = lower.indexOf(needle); at !== -1; at = lower.indexOf(needle, i)) {
    if (at > i) out.push(document.createTextNode(text.slice(i, at)));
    out.push(el('mark', undefined, text.slice(at, at + q.length)));
    i = at + q.length;
  }
  if (i < text.length) out.push(document.createTextNode(text.slice(i)));
  return out;
}

function demoSlip(t: DemoTask, q = '', withDate = false) {
  const li = el('li', t.off !== null && t.off < 0 ? 'slip is-carried' : 'slip');
  const text = el('p', 'slip-text');
  text.append(...marked(t.text, q));
  const meta = el('p', 'slip-meta');
  if (t.off !== null && (withDate || t.off < 0)) meta.append(el('span', t.off < 0 ? undefined : 'due', dueInfo(todayISO(dayAt(t.off)), false).label));
  if (t.high) meta.append(el('span', 'tag tag-high', '!high'));
  if (t.list) meta.append(el('span', 'tag', `#${t.list}`));
  if (t.repeat) meta.append(el('span', 'tag', t.repeat));
  li.append(text);
  if (meta.childNodes.length) li.append(meta);
  return li;
}

export function demo() {
  const root = document.getElementById('demo');
  const panel = document.getElementById('demo-panel');
  const dayLabel = document.getElementById('demo-day');
  const clock = document.getElementById('demo-clock');
  if (!root || !panel || !dayLabel || !clock) return;
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  let query = 'amma';
  let cmdQuery = 'go to';

  const tick = () => { clock.textContent = new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }); };
  tick();
  setInterval(tick, 30_000);

  const list = (items: DemoTask[], q = '', withDate = false) => {
    const ul = el('ul', 'slips');
    for (const t of items) ul.append(demoSlip(t, q, withDate));
    return ul;
  };

  const searchResults = (box: HTMLElement, status?: HTMLElement) => {
    box.textContent = '';
    const q = query.trim();
    const found = q ? TASKS.filter((t) => t.text.toLowerCase().includes(q.toLowerCase()) || t.list?.includes(q.toLowerCase())) : [];
    if (status) status.textContent = q ? `${found.length} ${found.length === 1 ? 'task' : 'tasks'} found` : '';
    if (!q) box.append(el('p', 'demo-empty', 'Type to search every list at once.'));
    else if (!found.length) box.append(el('p', 'demo-empty', `No tasks match "${q}".`));
    else box.append(list(found, q, true));
  };

  const commandRows = (box: HTMLElement) => {
    box.textContent = '';
    const q = cmdQuery.trim().toLowerCase();
    const found = COMMANDS.filter((c) => c.label.toLowerCase().includes(q));
    if (!found.length) { box.append(el('p', 'demo-empty', 'No command matches.')); return; }
    const ul = el('ul', 'demo-cmds');
    for (const c of found) {
      const li = el('li');
      li.append(el('span', undefined, c.label), el('span', 'run', c.view ? 'runs here' : 'in the app'));
      ul.append(li);
    }
    box.append(ul);
  };

  const field = (value: string, label: string, placeholder: string, onInput: (v: string) => void) => {
    const input = el('input', 'demo-field');
    input.type = 'search';
    input.value = value;
    input.placeholder = placeholder;
    input.setAttribute('aria-label', label);
    input.autocomplete = 'off';
    input.enterKeyHint = label.startsWith('Search') ? 'search' : 'go'; // the phone keyboard's Enter says what it does
    input.addEventListener('input', () => onInput(input.value));
    return input;
  };

  const render = (view: View) => {
    panel.textContent = '';
    dayLabel.textContent = TITLES[view];
    if (view === 'today') {
      dayLabel.append(' · ', el('span', 'date', shortDay(dayAt(0))));
      panel.append(list(TASKS.filter((t) => t.off === 0)));
    } else if (view === 'upcoming') {
      const offs = [...new Set(TASKS.filter((t) => t.off !== null && t.off > 0).map((t) => t.off as number))].sort((a, b) => a - b);
      for (const off of offs) {
        const g = el('div', 'demo-group');
        g.append(el('p', 'demo-group-h', `${off === 1 ? 'Tomorrow · ' : ''}${shortDay(dayAt(off))}`), list(TASKS.filter((t) => t.off === off)));
        panel.append(g);
      }
    } else if (view === 'carried') {
      panel.append(list(TASKS.filter((t) => t.off !== null && t.off < 0)));
      panel.append(el('p', 'demo-hint', 'Grey, with no red count. They wait until you give them a new date.'));
    } else if (view === 'search') {
      const box = el('div');
      const status = el('p', 'sr-only');
      status.setAttribute('role', 'status');
      panel.append(field(query, 'Search the sample tasks', 'Search tasks', (v) => { query = v; searchResults(box, status); }), box, status);
      searchResults(box);
    } else {
      const box = el('div');
      const input = field(cmdQuery, 'Filter the commands', 'Type a command', (v) => { cmdQuery = v; commandRows(box); });
      // Enter runs the first matching command, when it can run here.
      input.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' || e.isComposing) return;
        const first = COMMANDS.find((c) => c.label.toLowerCase().includes(cmdQuery.trim().toLowerCase()));
        if (first?.view) { e.preventDefault(); select(tabs.find((t) => t.dataset.view === first.view)!, true); }
      });
      panel.append(input, box, el('p', 'demo-hint', 'Press Enter to run the first one.'));
      commandRows(box);
    }
  };

  const select = (tab: HTMLButtonElement, focus: boolean) => {
    for (const t of tabs) {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    }
    panel.setAttribute('aria-labelledby', tab.id);
    render(tab.dataset.view as View);
    if (focus) tab.focus();
  };

  for (const tab of tabs) tab.addEventListener('click', () => select(tab, false));
  root.querySelector('[role="tablist"]')?.addEventListener('keydown', (e) => {
    const k = (e as KeyboardEvent).key;
    const i = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    const next = k === 'ArrowRight' ? (i + 1) % tabs.length : k === 'ArrowLeft' ? (i - 1 + tabs.length) % tabs.length : k === 'Home' ? 0 : k === 'End' ? tabs.length - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    select(tabs[next], true);
  });
  render('today');
}

/* ---------- 5 · The keyboard: drawn by code; a real key press pushes the drawn key down ---------- */

type KeyDef = [label: string, units: number, code?: string];
const ROWS: { y: number; h: number; keys: (KeyDef | number)[] }[] = [
  { y: 16, h: 26, keys: [['Esc', 1, 'Escape'], 0.5, ...[1, 2, 3, 4].map((n): KeyDef => [`F${n}`, 1, `F${n}`]), 0.5, ...[5, 6, 7, 8].map((n): KeyDef => [`F${n}`, 1, `F${n}`]), 0.5, ...[9, 10, 11, 12].map((n): KeyDef => [`F${n}`, 1, `F${n}`])] },
  { y: 50, h: 36, keys: [['`', 1, 'Backquote'], ...'1234567890'.split('').map((c): KeyDef => [c, 1, `Digit${c}`]), ['-', 1, 'Minus'], ['=', 1, 'Equal'], ['Back', 2, 'Backspace']] },
  { y: 90, h: 36, keys: [['Tab', 1.5, 'Tab'], ...'QWERTYUIOP'.split('').map((c): KeyDef => [c, 1, `Key${c}`]), ['[', 1, 'BracketLeft'], [']', 1, 'BracketRight'], ['\\', 1.5, 'Backslash']] },
  { y: 130, h: 36, keys: [['Caps', 1.75, 'CapsLock'], ...'ASDFGHJKL'.split('').map((c): KeyDef => [c, 1, `Key${c}`]), [';', 1, 'Semicolon'], ["'", 1, 'Quote'], ['Enter', 2.25, 'Enter']] },
  { y: 170, h: 36, keys: [['Shift', 2.25, 'ShiftLeft'], ...'ZXCVBNM'.split('').map((c): KeyDef => [c, 1, `Key${c}`]), [',', 1, 'Comma'], ['.', 1, 'Period'], ['/', 1, 'Slash'], ['Shift', 2.75, 'ShiftRight']] },
  { y: 210, h: 36, keys: [['Ctrl', 1.5, 'ControlLeft'], ['Win', 1.25, 'MetaLeft'], ['Alt', 1.25, 'AltLeft'], ['', 5.5, 'Space'], ['Alt', 1.25, 'AltRight'], ['Ctrl', 1.25, 'ControlRight'], ['←', 1, 'ArrowLeft'], ['↑', 1, 'ArrowUp'], ['→', 1, 'ArrowRight']] },
];
const USED = new Set(['Escape', 'F2', 'KeyN', 'KeyK', 'KeyZ', 'Slash', 'ControlLeft', 'ControlRight', 'AltLeft', 'AltRight', 'ArrowUp', 'ArrowDown', 'MetaLeft']);
// What each shortcut does, by its main key; the key list row with the same data-key lights up.
const DOES: Record<string, { row: string; say: string; mod?: 'ctrl' | 'alt' }> = {
  KeyN: { row: 'n', say: 'N · New task' },
  Slash: { row: '/', say: '/ · Search' },
  KeyK: { row: 'k', say: 'Ctrl K · Command menu', mod: 'ctrl' },
  ArrowUp: { row: 'arrow', say: 'Alt ↑ · Move the task up', mod: 'alt' },
  ArrowDown: { row: 'arrow', say: 'Alt ↓ · Move the task down', mod: 'alt' },
  F2: { row: 'f2', say: 'F2 · Rename' },
  KeyZ: { row: 'z', say: 'Ctrl Z · Undo the delete', mod: 'ctrl' },
  Escape: { row: 'escape', say: 'Esc · Close the panel' },
};

function drawKeyboard(svg: SVGSVGElement) {
  const U = 40, X0 = 20, GAP = 4;
  const r = rng(29);
  const base = document.createElementNS(SVG, 'path');
  base.setAttribute('class', 'kb-base');
  svg.append(base);
  let baseD = '';
  const keys = new Map<string, SVGGElement>();
  const key = (label: string, code: string | undefined, x: number, y: number, w: number, h: number) => {
    const g = document.createElementNS(SVG, 'g');
    g.setAttribute('class', code && USED.has(code) ? 'kb-key used' : 'kb-key');
    const cap = document.createElementNS(SVG, 'rect');
    cap.setAttribute('class', 'cap');
    for (const [k, v] of Object.entries({ x, y, width: w, height: h })) cap.setAttribute(k, v.toFixed(1));
    const edge = document.createElementNS(SVG, 'path');
    edge.setAttribute('class', 'edge');
    edge.setAttribute('d', [sketch(x, y, x + w, y, r)[0], sketch(x + w, y, x + w, y + h, r)[0], sketch(x + w, y + h, x, y + h, r)[0], sketch(x, y + h, x, y, r)[0]].join(' '));
    g.append(cap, edge);
    if (label) {
      const t = document.createElementNS(SVG, 'text');
      t.setAttribute('x', (x + w / 2).toFixed(1));
      t.setAttribute('y', (y + h / 2 + 4).toFixed(1));
      t.setAttribute('text-anchor', 'middle');
      t.textContent = label;
      g.append(t);
    }
    baseD += `M${x.toFixed(1)} ${(y + 3.5).toFixed(1)}h${w.toFixed(1)}v${h.toFixed(1)}h${(-w).toFixed(1)}Z`;
    svg.append(g);
    if (code) keys.set(code, g);
  };
  for (const row of ROWS) {
    let x = X0;
    for (const k of row.keys) {
      if (typeof k === 'number') { x += k * U; continue; }
      const [label, units, code] = k;
      const w = units * U - GAP;
      if (code === 'ArrowUp') {
        // ↑ and ↓ share one key space, stacked, as on most laptops.
        const hh = (row.h - GAP) / 2;
        key('↑', 'ArrowUp', x, row.y, w, hh);
        key('↓', 'ArrowDown', x, row.y + hh + GAP, w, hh);
      } else key(label, code, x, row.y, w, row.h);
      x += units * U;
    }
  }
  base.setAttribute('d', baseD);
  return keys;
}

export function keyboard() {
  const sec = document.getElementById('keys');
  const svg = document.getElementById('kbd-art') as SVGSVGElement | null;
  const said = document.getElementById('kbd-said');
  if (!sec || !svg || !said) return;
  const keys = drawKeyboard(svg);
  const rows = new Map([...sec.querySelectorAll<HTMLElement>('[data-key]')].map((n) => [n.dataset.key!, n]));
  const MOD: Record<string, string[]> = { ctrl: ['ControlLeft'], alt: ['AltLeft'] };
  let inView = false;
  let demoTimer = 0;

  const light = (code: string, on: boolean) => keys.get(code)?.classList.toggle('down', on);
  const clearAll = () => { for (const g of keys.values()) g.classList.remove('down'); for (const n of rows.values()) n.classList.remove('on'); };
  const show = (code: string, mods: { ctrl: boolean; alt: boolean }) => {
    const d = DOES[code];
    for (const n of rows.values()) n.classList.remove('on');
    if (d && (!d.mod || mods[d.mod]) && !(code === 'KeyN' && mods.ctrl)) {
      rows.get(d.row)?.classList.add('on');
      said.textContent = d.say;
    } else {
      const label = keys.get(code)?.querySelector('text')?.textContent || code.replace(/^(Key|Digit)/, '');
      said.textContent = `${label} · not a shortcut`;
    }
  };

  // Real keys, only while this section is on screen and nobody is typing in a field.
  window.addEventListener('keydown', (e) => {
    if (!inView || !keys.has(e.code)) return;
    const t = e.target as HTMLElement;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName) || t.isContentEditable) return;
    if (demoTimer) { clearTimeout(demoTimer); demoTimer = 0; clearAll(); said.setAttribute('aria-live', 'polite'); }
    light(e.code, true);
    const ctrl = e.ctrlKey || e.metaKey;
    // Modifiers and the keys people move around the page with press the drawn key without words,
    // so a keyboard or screen-reader user is not told "not a shortcut" on every Tab.
    const quiet = /^(Control|Alt|Shift|Meta|Tab|Space|Enter|CapsLock|Backspace|Page|Home|End)/.test(e.code) || (e.code.startsWith('Arrow') && !e.altKey);
    if (!quiet) show(e.code, { ctrl, alt: e.altKey });
    // Keep the browser's own meaning of these keys out of the way while you try them here.
    if (e.code === 'Slash' || (ctrl && e.code === 'KeyK') || e.code === 'F2') e.preventDefault();
    if (e.code === 'KeyN') e.stopPropagation(); // the page's "n puts the cursor in the box" waits
  }, true);
  window.addEventListener('keyup', (e) => { light(e.code, false); if (e.key === 'Meta') clearAll(); }, true); // macOS sends no keyup for keys let go while Cmd is down
  window.addEventListener('blur', clearAll);

  new IntersectionObserver((entries) => {
    inView = entries.some((e) => e.isIntersecting);
    if (!inView) clearAll();
  }, { threshold: 0.35 }).observe(svg);

  // Once, the first time it is seen: the shortcuts play themselves.
  if (!motionOn()) return;
  onView(svg, () => {
    const steps: [string, string[]][] = [['KeyN', []], ['Slash', []], ['KeyK', MOD.ctrl], ['ArrowDown', MOD.alt], ['F2', []], ['KeyZ', MOD.ctrl], ['Escape', []]];
    let i = 0;
    const next = () => {
      clearAll();
      if (i >= steps.length) { said.textContent = 'Now try one yourself.'; said.setAttribute('aria-live', 'polite'); demoTimer = 0; return; }
      const [code, mods] = steps[i++];
      for (const m of mods) light(m, true);
      light(code, true);
      show(code, { ctrl: mods === MOD.ctrl, alt: mods === MOD.alt });
      demoTimer = window.setTimeout(() => { clearAll(); demoTimer = window.setTimeout(next, 260); }, 620);
    };
    said.setAttribute('aria-live', 'off'); // nobody pressed these: do not read them aloud
    demoTimer = window.setTimeout(next, 400);
  }, 0.6);
}

/* ---------- 6 · Heard: the announcements are spoken one by one ---------- */

export function heard() {
  const list = document.getElementById('said');
  const art = document.querySelector<SVGSVGElement>('.heard-art');
  if (!list || !art || !motionOn()) return;
  const lines = [...list.querySelectorAll('li')];
  onView(list, () => {
    art.classList.add('speaking');
    lines.forEach((li, i) => setTimeout(() => li.classList.add('spoken'), i * 820));
    setTimeout(() => art.classList.remove('speaking'), lines.length * 820 + 400);
  }, 0.5);
}

/* ---------- 8 · Free: each line ticks as it passes the middle of the screen; the stamp lands ---------- */

export function freeList() {
  const items = [...document.querySelectorAll<HTMLElement>('.lit-list li')];
  const stamp = document.querySelector('.free-stamp');
  if (!motionOn() || !items.length) return;
  let near = false, queued = false;
  const tick = () => {
    queued = false;
    const mid = window.innerHeight * 0.62;
    for (const li of items) { const r = li.getBoundingClientRect(); li.classList.toggle('lit', r.top + r.height / 2 < mid); }
  };
  const request = () => { if (near && !queued) { queued = true; requestAnimationFrame(tick); } };
  new IntersectionObserver((entries) => { near = entries.some((e) => e.isIntersecting); request(); }, { rootMargin: '50% 0px' }).observe(items[0].parentElement!);
  window.addEventListener('scroll', request, { passive: true });
  if (stamp) onView(stamp, () => stamp.classList.add('landed'), 0.7);
}

/* ---------- 9 · Privacy: choosing sync sends a copy of the letter to your own account ---------- */

export function privacy() {
  const sec = document.getElementById('privacy');
  if (!sec) return;
  for (const r of sec.querySelectorAll<HTMLInputElement>('input[name="where"]')) {
    r.addEventListener('change', () => sec.classList.toggle('sync', r.checked && r.value === 'sync'));
  }
}

/* ---------- 12 · The closing slot carries today's real date ---------- */

export function closeDay() {
  const label = document.getElementById('close-day');
  const slips = document.querySelector('.close-slips');
  if (!label) return;
  label.textContent = 'Today · ';
  label.append(el('span', 'date', shortDay(dayAt(0))));
  if (!slips) return;
  // "Your list is waiting": today's slips from the top of the page, and the line you added there,
  // copied fresh each time the closing frame comes into view.
  new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    const mine = document.querySelector('#frame .slip.fresh');
    const today = [...document.querySelectorAll('#frame [data-slot="today"] .slip')].filter((n) => n !== mine);
    slips.replaceChildren(...[mine, ...today].filter(Boolean).slice(0, 3).map((n) => {
      const copy = n!.cloneNode(true) as HTMLElement;
      copy.classList.remove('fresh');
      return copy;
    }));
  }, { threshold: 0.2 }).observe(slips.parentElement!);
}
