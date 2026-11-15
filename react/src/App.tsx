import { useDeferredValue, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import Colophon from './components/Colophon';
import Drawer from './components/Drawer';
import EmptyState, { type EmptyKind } from './components/EmptyState';
import Filters from './components/Filters';
import Palette from './components/Palette';
import Sidebar from './components/Sidebar';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import Toast from './components/Toast';
import { MenuIcon, MoonIcon, SunIcon } from './components/icons';
import { accentVars, parseHex } from './color';
import { parseISO } from './dates';
import { isDialogOpen, useClock } from './hooks';
import { tasksReducer } from './reducer';
import { loadBackupDate, loadPersist, requestPersist, saveBackupDate, type PersistState } from './safety';
import { DEFAULT_LISTS, loadLists, loadTasks, parseBackup, saveLists, saveTasks } from './storage';
import { useCloud } from './useCloud';
import { resolveList, takePending } from './handoff';
import type { Filter, List, Sort, Task, View } from './types';
import { uid } from './uid';
import { bySlot, count, dueForNewTask, inView, slotOf } from './views';

type Theme = 'light' | 'dark';
interface Undo { id: string; message: string; items: { task: Task; index: number }[] }

const THEME_KEY = 'todo-theme';
const ACCENT_KEY = 'todo-accent';
const RANK = { high: 0, med: 1, low: 2 } as const;
const LIST_COLORS = ['#D62839', '#FFC53D', '#8A8A8A'];
const DATE_LONG: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
const VIEW_TITLES: Record<string, string> = { all: 'All tasks', today: 'Today', upcoming: 'Upcoming', overdue: 'Carried over' };
const MOD_KEY = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl';

const formatDay = (iso: string) => parseISO(iso)?.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) ?? iso;

function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* storage blocked */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const [lists, setLists] = useState<List[]>(loadLists);
  const [tasks, dispatch] = useReducer(tasksReducer, lists, loadTasks);
  const [view, setView] = useState<View>('all');
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('manual');
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [openId, setOpenId] = useState<string | null>(null);
  const [undo, setUndo] = useState<Undo | null>(null);
  const [palette, setPalette] = useState(false);
  const [menu, setMenu] = useState(false);
  const [status, setStatus] = useState(''); // read out by screen readers
  const [stampId, setStampId] = useState<string | null>(null); // the newest task wears the postmark
  // A message equal to the last one gets a no-break space, so screen readers announce it again.
  const announce = (m: string) => setStatus((s) => (s === m ? `${m} ` : m));
  const [persist, setPersist] = useState<PersistState>(loadPersist);
  const [backupDate, setBackupDate] = useState<string | null>(loadBackupDate);
  const persistAsked = useRef(false);
  const [accent, setAccent] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(ACCENT_KEY);
      return parseHex(saved) ? saved : null; // never trust stored strings as CSS
    } catch { return null; }
  });
  const searchRef = useRef<HTMLInputElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const focusAfterMove = useRef<string | null>(null);
  // After a tick or a delete the row leaves its slot and focus would fall to <body>: where it goes instead.
  const focusAfter = useRef<{ id: string | null; sel: string } | null>(null);
  const undoAction = useRef<(() => void) | null>(null);
  const [landed, setLanded] = useState(''); // visible "Added to Today" line under the IN slot
  const { today, hello } = useClock(); // stays correct when the tab is left open past midnight
  const lastCount = useRef<number | null>(null); // the poster numeral rolls only when its value changes

  // Optional Google sign-in. Guest mode keeps everything on this device; signed in, the tasks
  // on screen are the account's, and this device's guest list stays untouched until sign-out.
  const latest = useRef({ tasks, lists });
  latest.current = { tasks, lists };
  const cloud = useCloud({
    current: () => latest.current,
    onSnapshot: (s) => {
      dispatch({ type: 'replaceAll', tasks: s.tasks });
      setLists(s.tasks.length === 0 && s.lists.length === 0 ? DEFAULT_LISTS : s.lists); // a new account
    },
    onSignedOut: () => {
      const guestLists = loadLists();
      setLists(guestLists);
      dispatch({ type: 'replaceAll', tasks: loadTasks(guestLists) });
      setView('all');
      setOpenId(null);
      setUndo(null);
    },
    confirmCopy: (n) => window.confirm(`Copy ${count(n, 'task')} from this device into your account? They also stay on this device for guest mode.`),
    announce: setStatus,
  });

  useEffect(() => { if (cloud.mode === 'guest') saveTasks(tasks); }, [tasks, cloud.mode]);
  useEffect(() => { if (cloud.mode === 'guest') saveLists(lists); }, [lists, cloud.mode]);
  // Signed in: send what changed. A no-op in guest mode and until the first snapshot is on screen.
  useEffect(() => { cloud.push(tasks, lists); }, [tasks, lists, cloud.ready]); // eslint-disable-line react-hooks/exhaustive-deps

  // A task typed on the start page while signed in waits until the account's list is on screen,
  // so it syncs like any other task. (Guest tasks are already saved by the start page itself.)
  useEffect(() => {
    if (cloud.mode === 'cloud' && !cloud.ready) return;
    const pending = takePending();
    if (!pending) return;
    handleAdd(pending.text, pending.priority, pending.dueDate, pending.listName);
    announce(`Added "${pending.text}" from the start page`);
  }, [cloud.mode, cloud.ready]); // eslint-disable-line react-hooks/exhaustive-deps

  function deleteCloudData() {
    if (!window.confirm('Delete every task and list in your account, and the account itself? Tasks on this device in guest mode stay. This cannot be undone.')) return;
    cloud.deleteCloudData();
  }

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* ignore */ }
  }, [theme]);

  useEffect(() => {
    // A custom accent gets its ink from its own luminance, and a text-safe variant for this theme.
    const root = document.documentElement;
    ['--accent', '--accent-ink', '--accent-text'].forEach((name) => root.style.removeProperty(name));
    const css = getComputedStyle(root);
    const surfaces = [css.getPropertyValue('--bg'), css.getPropertyValue('--surface')];
    const vars = accent ? accentVars(accent, surfaces, theme === 'dark') : null;
    if (vars) Object.entries(vars).forEach(([name, value]) => root.style.setProperty(name, value));
    // The browser bar takes the page colour, so the frame starts at the top edge on phones.
    const bg = getComputedStyle(root).getPropertyValue('--bg').trim() || '#FFFFFF';
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', bg));
    try {
      if (accent) localStorage.setItem(ACCENT_KEY, accent);
      else localStorage.removeItem(ACCENT_KEY);
    } catch { /* ignore */ }
  }, [accent, theme]);

  // Global shortcuts: Ctrl/Cmd+K palette, "/" search, "n" new task
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPalette((open) => !open);
        return;
      }
      const el = e.target as HTMLElement;
      const typing = ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName) || el.isContentEditable;
      // Ctrl/Cmd+Z undoes the last delete while its toast is up (fields keep their own undo).
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === 'z' && !typing && !isDialogOpen() && undoAction.current) {
        e.preventDefault();
        undoAction.current();
        return;
      }
      // Single-key shortcuts must not reach behind an open dialog
      if (typing || isDialogOpen() || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === '/') { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === 'n') { e.preventDefault(); document.getElementById('new-task')?.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // The off-canvas menu only exists on narrow screens: close it if the window grows.
  useEffect(() => {
    const wide = window.matchMedia?.('(min-width: 821px)');
    const onChange = () => { if (wide?.matches) setMenu(false); };
    wide?.addEventListener('change', onChange);
    return () => wide?.removeEventListener('change', onChange);
  }, []);

  // After a keyboard reorder the moved row is re-inserted in the DOM, which drops focus: restore it.
  useEffect(() => {
    const rowOf = (id: string) => [...(frameRef.current?.querySelectorAll('li.item') ?? [])].find((li) => (li as HTMLElement).dataset.id === id);
    const after = focusAfter.current;
    focusAfter.current = null;
    if (after) {
      const target = after.id ? rowOf(after.id)?.querySelector<HTMLElement>(after.sel) : null;
      (target ?? document.getElementById('new-task'))?.focus();
    }
    const id = focusAfterMove.current;
    if (!id) return;
    focusAfterMove.current = null;
    rowOf(id)?.querySelector<HTMLElement>('.text')?.focus();
  }, [tasks]);

  // The visible "Added to …" line fades from view after a few seconds.
  useEffect(() => {
    if (!landed) return;
    const t = setTimeout(() => setLanded(''), 4000);
    return () => clearTimeout(t);
  }, [landed]);

  const scoped = useMemo(() => tasks.filter((t) => inView(t, view, today)), [tasks, view, today]);

  // The list filters on a deferred copy of the query, so the search field paints each keystroke first.
  // A search looks in every view and list at once (as the start page promises), and matches the
  // title, the notes and the list name ("home" or "#home" finds the tasks in Home).
  const deferredQuery = useDeferredValue(query);
  const searching = deferredQuery.trim().length > 0;
  const base = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    if (!q) return scoped;
    const listQ = q.replace(/^#/, '');
    const listNames = new Map(lists.map((l) => [l.id, l.name.toLowerCase()]));
    return tasks.filter((t) => t.text.toLowerCase().includes(q)
      || (t.notes ?? '').toLowerCase().includes(q)
      || (!!t.listId && !!listQ && (listNames.get(t.listId) ?? '').includes(listQ)));
  }, [tasks, scoped, lists, deferredQuery]);

  const counts: Record<Filter, number> = {
    all: base.length,
    active: base.filter((t) => !t.done).length,
    done: base.filter((t) => t.done).length,
  };

  const viewCounts: Record<string, number> = {};
  (['all', 'today', 'upcoming', 'overdue'] as View[]).forEach((v) => {
    viewCounts[v] = tasks.filter((t) => !t.done && inView(t, v, today)).length;
  });
  lists.forEach((l) => { viewCounts[`list:${l.id}`] = tasks.filter((t) => !t.done && t.listId === l.id).length; });

  const visible = useMemo(() => {
    let list = base.filter((t) => {
      if (filter === 'active' && t.done) return false;
      if (filter === 'done' && !t.done) return false;
      return true;
    });
    if (sort === 'due') list = [...list].sort((a, b) => (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999'));
    if (sort === 'priority') list = [...list].sort((a, b) => RANK[a.priority] - RANK[b.priority]);
    return bySlot(list, today); // the sorting frame: slots in order, the chosen order inside each slot
  }, [base, filter, sort, today]);

  const overdue = viewCounts.overdue;
  const allActive = viewCounts.all;
  const totalDone = tasks.filter((t) => t.done).length;

  const currentListId = view.startsWith('list:') ? view.slice(5) : undefined;
  const viewTitle = searching ? 'Search, every list' : VIEW_TITLES[view] ?? lists.find((l) => l.id === currentListId)?.name ?? 'List';
  // Which empty state fits: a search miss, a filter that hides everything, or a truly empty view.
  const emptyKind: EmptyKind =
    query.trim() ? 'search'
    : scoped.length > 0 ? (filter === 'done' ? 'noneDone' : 'allDone')
    : currentListId ? 'list'
    : (view as EmptyKind);
  const canDrag = sort === 'manual' && !query.trim();
  const openTask = tasks.find((t) => t.id === openId);

  function handleAdd(text: string, priority: Task['priority'], explicitDue?: string, listName?: string) {
    // A typed #list files the task there, creating the list if it is new.
    const resolved = resolveList(lists, listName);
    if (resolved.lists !== lists) setLists(resolved.lists);
    const task: Task = { id: uid(), text, priority, done: false, dueDate: dueForNewTask(view, today, explicitDue), listId: resolved.listId ?? currentListId };
    dispatch({ type: 'add', ...task });
    setStampId(task.id);
    if (!inView(task, view, today) || (resolved.listId && resolved.listId !== currentListId)) setView('all'); // keep the new task in sight
    setQuery('');                                   // so the new task is never hidden by a leftover search
    if (filter === 'done') setFilter('all');
    const where = slotOf(task, today);
    announce(`Added "${text}" to ${where}`);
    setLanded(`Added to ${where}`);
    // Ask once, after the first saved task: now there is something worth protecting.
    // The ref stops a second quick add from asking again before the first answer arrives.
    if (persist === 'unknown' && !persistAsked.current) {
      persistAsked.current = true;
      requestPersist().then(setPersist);
    }
  }

  function handleToggle(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    if (document.activeElement?.closest(`li[data-id="${id}"]`)) focusAfter.current = { id, sel: '.check' };
    dispatch({ type: 'toggle', id, nextId: uid(), today });
    announce(`"${task.text}" ${task.done ? 'marked as not done' : 'completed'}`);
  }

  function removeWithUndo(items: Undo['items'], message: string) {
    if (!items.length) return;
    setUndo({ id: uid(), message, items }); // the toast is itself a status region, so it is announced once
  }

  function handleDelete(id: string) {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return;
    if (document.activeElement?.closest(`li[data-id="${id}"]`)) {
      const i = visible.findIndex((t) => t.id === id);
      focusAfter.current = { id: (visible[i + 1] ?? visible[i - 1])?.id ?? null, sel: '.text' };
    }
    removeWithUndo([{ task: tasks[index], index }], 'Task deleted');
    if (openId === id) setOpenId(null);
    dispatch({ type: 'delete', id });
  }

  function clearCompleted() {
    const items = tasks.map((task, index) => ({ task, index })).filter((x) => x.task.done);
    removeWithUndo(items, `${count(items.length, 'completed task')} cleared`);
    dispatch({ type: 'clearDone' });
  }

  function handleUndo() {
    if (!undo) return;
    // Restoring in ascending index order puts every task back in its old slot.
    undo.items.forEach(({ task, index }) => dispatch({ type: 'restore', task, index }));
    setUndo(null);
    announce('Restored');
  }

  // `refocus` is false when the move comes from the drawer: focus must stay inside the dialog.
  function nudge(id: string, dir: -1 | 1, refocus = true) {
    if (!canDrag) {
      announce('Reordering is off while the list is sorted or searched. Switch to "My order" and clear the search to move tasks.');
      return;
    }
    const i = visible.findIndex((t) => t.id === id);
    const other = visible[i + dir];
    if (i < 0) return;
    // A task moves inside its own slot; its date decides the slot.
    const slot = slotOf(visible[i], today);
    if (!other || slotOf(other, today) !== slot) {
      announce(`"${visible[i].text}" is already ${dir < 0 ? 'first' : 'last'} in ${slot}`);
      return;
    }
    const inSlot = visible.filter((t) => slotOf(t, today) === slot);
    if (refocus) focusAfterMove.current = id;
    dispatch({ type: 'move', from: id, to: other.id });
    announce(`Moved "${visible[i].text}" to position ${inSlot.indexOf(visible[i]) + dir + 1} of ${inSlot.length} in ${slot}`);
  }

  const paletteItems = [
    { id: 'new', label: 'New task', run: () => { setTimeout(() => document.getElementById('new-task')?.focus(), 0); } },
    { id: 'search', label: 'Search tasks', run: () => { setTimeout(() => searchRef.current?.focus(), 0); } },
    { id: 'v-all', label: 'Go to All tasks', run: () => goView('all') },
    { id: 'v-today', label: 'Go to Today', run: () => goView('today') },
    { id: 'v-up', label: 'Go to Upcoming', run: () => goView('upcoming') },
    { id: 'v-over', label: 'Go to Carried over', run: () => goView('overdue') },
    ...lists.map((l) => ({ id: `l-${l.id}`, label: `Go to list: ${l.name}`, run: () => goView(`list:${l.id}` as View) })),
    { id: 'theme', label: `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`, run: () => setTheme(theme === 'dark' ? 'light' : 'dark') },
    { id: 'export', label: `Export backup (last: ${backupDate ? formatDay(backupDate) : 'never'})`, run: () => exportData() },
    ...(cloud.available && !cloud.user ? [{ id: 'sign-in', label: 'Sign in with Google to sync', run: () => { cloud.signIn(); } }] : []),
    ...(cloud.user ? [{ id: 'sign-out', label: 'Sign out', run: () => { cloud.signOut(); } }] : []),
    ...(totalDone > 0 ? [{ id: 'clear', label: 'Clear completed tasks', run: clearCompleted }] : []),
    ...tasks.map((t) => ({ id: `t-${t.id}`, label: `Open task: ${t.text}`, run: () => setOpenId(t.id) })),
  ];

  // Going to a view from the menu or the palette says where you are and how much is there.
  function goView(v: View) {
    setView(v);
    const title = VIEW_TITLES[v] ?? lists.find((l) => `list:${l.id}` === v)?.name ?? 'List';
    announce(`${title}: ${count(viewCounts[v] ?? 0, 'task')} to do`);
  }

  function addList(name: string) {
    const existing = lists.find((l) => l.name.toLowerCase() === name.toLowerCase());
    const list = existing ?? { id: uid(), name, color: LIST_COLORS[lists.length % LIST_COLORS.length] };
    if (!existing) setLists([...lists, list]);
    setView(`list:${list.id}`); // a duplicate name just takes you to the list that already exists
    announce(existing ? `The list "${existing.name}" already exists. It is open now.` : `List "${name}" created`);
  }

  function deleteList(id: string) {
    const list = lists.find((l) => l.id === id);
    if (!list || !window.confirm(`Delete the list "${list.name}"? Its tasks will be kept without a list.`)) return;
    dispatch({ type: 'unassignList', listId: id });
    setLists(lists.filter((l) => l.id !== id));
    if (currentListId === id) setView('all');
  }

  function exportData() {
    const blob = new Blob([JSON.stringify({ version: 1, tasks, lists }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-backup-${today}.json`;
    a.click();
    URL.revokeObjectURL(url);
    saveBackupDate(today);
    setBackupDate(today);
    announce('Backup exported');
  }

  async function importData(file: File) {
    const parsed = parseBackup(await file.text().catch(() => ''));
    if (!parsed) { window.alert('That file is not a valid backup. Nothing was changed. Choose a file exported from Tasks.'); return; }
    if (!window.confirm(`Replace the tasks on this device with ${count(parsed.tasks.length, 'imported task')}? Export a backup first to keep the current ones.`)) return;
    dispatch({ type: 'replaceAll', tasks: parsed.tasks });
    setLists(parsed.lists);
    setView('all');
    setOpenId(null);
    setUndo(null);
    announce(`Imported ${count(parsed.tasks.length, 'task')}`);
  }

  undoAction.current = undo ? handleUndo : null;
  // A search says how many tasks it found (only while there is a search).
  useEffect(() => {
    if (deferredQuery.trim()) announce(`${count(visible.length, 'task')} found`);
  }, [deferredQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const remaining = viewCounts[view] ?? 0;
  const rolled = lastCount.current !== null && lastCount.current !== remaining;
  // Updated after paint, so the next render can tell whether the numeral changed.
  useEffect(() => { lastCount.current = remaining; });
  const allDone = tasks.length > 0 && allActive === 0;
  const dateLong = parseISO(today)?.toLocaleDateString(undefined, DATE_LONG) ?? '';
  // The sorting frame: one section per slot that holds a task, in frame order.
  const frame = useMemo(() => {
    const groups: { name: string; tasks: Task[] }[] = [];
    visible.forEach((t) => {
      const name = slotOf(t, today);
      const last = groups[groups.length - 1];
      if (last?.name === name) last.tasks.push(t); else groups.push({ name, tasks: [t] });
    });
    return groups;
  }, [visible, today]);
  const stampDate = parseISO(today)?.toLocaleDateString(undefined, { day: '2-digit', month: 'short' }).toUpperCase() ?? '';

  return (
    <div className="poster">
      <a className="skip" href="#new-task">Skip to new task</a>
      <header className="field">
        <div className="bar">
          <button className="icon-btn menu-btn" type="button" onClick={() => setMenu(true)} aria-label="Open menu" aria-expanded={menu} aria-controls="sidebar">
            <MenuIcon />
          </button>
          <span className="brand-sm" aria-hidden="true">Tasks</span>
          <Sidebar
            view={view} onView={goView} counts={viewCounts} lists={lists}
            onAddList={addList} onDeleteList={deleteList} open={menu} onClose={() => setMenu(false)}
          />
          {/* No aria-label: the visible word "Commands" must be part of the accessible name (WCAG 2.5.3). */}
          <button className="cmd" type="button" onClick={() => setPalette(true)} aria-haspopup="dialog" aria-keyshortcuts="Control+K Meta+K">
            Commands <kbd aria-hidden="true">{MOD_KEY} K</kbd>
          </button>
          <button className="icon-btn" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        <div className="masthead" inert={menu}>
          <p className={`count${allDone ? ' complete' : ''}`} role="img" data-len={String(remaining).length}
            aria-label={allDone ? `All ${count(tasks.length, 'task')} done` : `${count(remaining, 'task')} to do in ${viewTitle}`}>
            <span key={remaining} className={rolled ? 'roll' : undefined}>{remaining}</span>
          </p>
          <div className="head">
            <h1><span className="sr-only">Tasks, </span>{dateLong}</h1>
            <p className="sub">
              {hello}.{' '}
              {tasks.length === 0 ? 'Add a task to get started.'
                : allActive === 0 ? 'Everything is done.'
                : <>{count(allActive, 'task')} to do{overdue > 0 && <>, <strong>{overdue} carried over</strong></>}.</>}
            </p>
            <TaskForm onAdd={handleAdd} />
            <p className="landed" aria-hidden="true">{landed}</p>
          </div>
        </div>
      </header>

      <main className="sheet" inert={menu}>
        <section className="panel" aria-labelledby="view-title">
          <div className="panel-head">
            <h2 className="view-title" id="view-title">{viewTitle}</h2>
            <span className={`badge${view === 'today' && viewCounts.today > 0 ? ' sun' : ''}`}>
              {remaining}<span className="sr-only"> to do</span>
            </span>
          </div>
          <Filters filter={filter} counts={counts} onFilter={setFilter} query={query} onQuery={setQuery}
            sort={sort} onSort={setSort} searchRef={searchRef} />
          {frame.length > 0 && (
            <div className="frame" ref={frameRef}>
              {frame.map((g, gi) => (
                <section key={g.name} className={`slot slot-${g.name.toLowerCase().replace(/\s+/g, '-')}`} aria-labelledby={`slot-${gi}`}>
                  <h3 className="slot-label" id={`slot-${gi}`}>{g.name} <span className="slot-n" aria-hidden="true">{g.tasks.length}</span><span className="sr-only">, {count(g.tasks.length, 'task')}</span></h3>
                  <ul className="list">
                    {g.tasks.map((t) => (
                      <TaskItem
                        key={t.id}
                        task={t}
                        stamped={t.id === stampId ? stampDate : undefined}
                        list={currentListId ? undefined : lists.find((l) => l.id === t.listId)}
                        query={deferredQuery}
                        draggable={canDrag}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                        onEdit={(id, text) => dispatch({ type: 'edit', id, text })}
                        onOpen={setOpenId}
                        onMove={(from, to) => dispatch({ type: 'move', from, to })}
                        onNudge={nudge}
                      />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
          {visible.length === 0 && (
            <EmptyState kind={emptyKind} listName={currentListId ? viewTitle : undefined}
              query={query.trim()} onClearSearch={() => setQuery('')} />
          )}
          {totalDone > 0 && (
            <div className="foot">
              <button className="link" type="button" onClick={clearCompleted}>Clear completed</button>
            </div>
          )}
        </section>
        <p className="sr-only" role="status">{status}</p>
        <p className="sr-only" id="rename-hint">Press F2 to rename</p>
      </main>

      <Colophon accent={accent} onAccent={setAccent} onExport={exportData} onImport={importData} modKey={MOD_KEY} inert={menu}
        persist={persist} lastBackup={backupDate ? formatDay(backupDate) : null}
        account={{ available: cloud.available, user: cloud.user, sync: cloud.sync, error: cloud.error,
          onSignIn: () => { cloud.signIn(); }, onSignOut: () => { cloud.signOut(); }, onDelete: deleteCloudData }} />

      {openTask && (
        <Drawer
          key={openTask.id}
          task={openTask}
          lists={lists}
          onClose={() => setOpenId(null)}
          onUpdate={(patch) => dispatch({ type: 'update', id: openTask.id, patch })}
          onAddSub={(text) => dispatch({ type: 'addSub', taskId: openTask.id, id: uid(), text })}
          onToggleSub={(subId) => dispatch({ type: 'toggleSub', taskId: openTask.id, subId })}
          onDeleteSub={(subId) => dispatch({ type: 'deleteSub', taskId: openTask.id, subId })}
          onDelete={() => handleDelete(openTask.id)}
          onMove={(dir) => nudge(openTask.id, dir, false)}
        />
      )}
      {undo && <Toast key={undo.id} message={undo.message} onUndo={handleUndo} onDismiss={() => setUndo(null)} />}
      {palette && <Palette items={paletteItems} onClose={() => setPalette(false)} />}
    </div>
  );
}
