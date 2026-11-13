// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import type { Task } from './types';

const noop = () => {};
const seed = (tasks: Partial<Task>[]) =>
  localStorage.setItem('todo-app:v1', JSON.stringify(tasks.map((t, i) => ({ id: `t${i + 1}`, priority: 'med', done: false, ...t }))));
const titles = () => [...document.querySelectorAll('.list .text')].map((n) => n.textContent);
const status = () => document.querySelector('[role=status].sr-only')?.textContent ?? '';
const viewButton = (name: RegExp) => within(screen.getByRole('navigation', { name: 'Views' })).getByRole('button', { name });
const addTask = (text: string) => {
  fireEvent.change(screen.getByLabelText('New task'), { target: { value: text } });
  fireEvent.click(screen.getByRole('button', { name: 'Add task' }));
};

describe('quick-add lists and the start page', () => {
  it('files a #list task under a new list and keeps it in sight', () => {
    render(<App />);
    addTask('Buy curd friday #groceries');
    expect(titles()).toContain('Buy curd');
    const stored = JSON.parse(localStorage.getItem('todo-lists:v1') ?? '[]') as { id: string; name: string }[];
    const groceries = stored.find((l) => l.name === 'Groceries');
    expect(groceries).toBeTruthy();
    const task = (JSON.parse(localStorage.getItem('todo-app:v1') ?? '[]') as Task[]).find((t) => t.text === 'Buy curd');
    expect(task).toMatchObject({ listId: groceries!.id, dueDate: '2026-11-13' });
  });

  it('adds a task handed over from the start page once, then forgets it', () => {
    localStorage.setItem('todo-pending:v1', JSON.stringify({ text: 'From the start page', priority: 'high', listName: 'work' }));
    render(<App />);
    expect(titles()).toContain('From the start page');
    expect(localStorage.getItem('todo-pending:v1')).toBeNull();
    expect(status()).toMatch(/from the start page/);
  });
});

describe('storage safety', () => {
  it('shows the storage state and an unset backup date, then records an export', async () => {
    URL.createObjectURL = vi.fn(() => 'blob:x');
    URL.revokeObjectURL = vi.fn();
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    render(<App />);
    expect(screen.getByText('Last backup: never')).toBeTruthy();
    expect(screen.getByText(/Not protected yet/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Export backup' }));
    expect(screen.queryByText('Last backup: never')).toBeNull();
    expect(localStorage.getItem('todo-backup:v1')).toBe('2026-11-10');
  });

  it('asks for persistent storage once, after the first saved task', async () => {
    const persist = vi.fn(async () => true);
    vi.stubGlobal('navigator', Object.assign(Object.create(navigator), { storage: { persisted: async () => false, persist } }));
    render(<App />);
    addTask('First task');
    addTask('Second task');
    await act(async () => {});
    expect(persist).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('todo-persist:v1')).toBe('granted');
    expect(screen.getByText(/Protected: this browser will keep your tasks/)).toBeTruthy();
  });
});

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('style');
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), addEventListener: noop, removeEventListener: noop }));
  vi.useFakeTimers({ toFake: ['Date', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'] });
  vi.setSystemTime(new Date(2026, 10, 10, 9, 0)); // Tue 10 Nov 2026, 09:00
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('App: stored data', () => {
  it('starts cleanly when localStorage holds junk instead of crashing', () => {
    localStorage.setItem('todo-app:v1', JSON.stringify([null, { id: 1 }, { id: 'ok', text: 'Survivor', dueDate: 12, subtasks: 'x' }]));
    localStorage.setItem('todo-lists:v1', JSON.stringify([null, { id: 'l' }]));
    expect(() => render(<App />)).not.toThrow();
    expect(titles()).toEqual(['Survivor']);
  });

  it('ignores a stored accent that is not a plain hex colour', () => {
    localStorage.setItem('todo-accent', 'red; background: url(https://evil.example/x)');
    render(<App />);
    expect(document.documentElement.style.getPropertyValue('--accent')).toBe('');
  });
});

describe('App: accent colour', () => {
  it('derives readable ink for a custom accent and restores the default red', () => {
    render(<App />);
    const root = document.documentElement.style;
    fireEvent.click(screen.getByRole('button', { name: 'Tangerine' }));
    expect(root.getPropertyValue('--accent')).toBe('#E8590C');
    expect(root.getPropertyValue('--accent-ink')).toBe('#000000'); // white would be 3.6:1 on this orange
    fireEvent.click(screen.getByRole('button', { name: 'Violet' }));
    expect(root.getPropertyValue('--accent-ink')).toBe('#FFFFFF');
    fireEvent.click(screen.getByRole('button', { name: 'Red (default)' }));
    expect(root.getPropertyValue('--accent')).toBe('');
    expect(root.getPropertyValue('--accent-ink')).toBe('');
    expect(localStorage.getItem('todo-accent')).toBeNull();
  });
});

describe('App: adding tasks', () => {
  it('shows a task added from the Today view in that view', () => {
    render(<App />);
    fireEvent.click(viewButton(/^Today/));
    addTask('Call the bank');
    expect(titles()).toEqual(['Call the bank']);
    expect(JSON.parse(localStorage.getItem('todo-app:v1')!)[0].dueDate).toBe('2026-11-10');
  });

  it('jumps to All tasks when a new task would be invisible in the current view', () => {
    render(<App />);
    fireEvent.click(viewButton(/^Overdue/));
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Overdue');
    addTask('No date on this one');
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('All tasks');
    expect(titles()).toEqual(['No date on this one']);
  });

  it('links the validation error to the field and clears it on typing', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Add task' }));
    const input = screen.getByLabelText('New task');
    const alert = screen.getByRole('alert');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(alert.id);
    fireEvent.change(input, { target: { value: 'x' } });
    expect(screen.queryByRole('alert')).toBeNull();
    expect(input.getAttribute('aria-invalid')).not.toBe('true');
  });
});

describe('App: undo', () => {
  it('lets "Clear completed" be undone, restoring tasks to their old places', () => {
    seed([{ text: 'One', done: true }, { text: 'Two' }, { text: 'Three', done: true }]);
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Clear completed' }));
    expect(titles()).toEqual(['Two']);
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(titles()).toEqual(['One', 'Two', 'Three']);
  });

  it('keeps the undo toast while it is hovered, then dismisses it', () => {
    seed([{ text: 'One' }]);
    render(<App />);
    fireEvent.click(screen.getByLabelText('Delete "One"'));
    const toast = screen.getByText('Task deleted').parentElement!;
    fireEvent.mouseEnter(toast);
    act(() => { vi.advanceTimersByTime(30_000); });
    expect(screen.queryByText('Task deleted')).not.toBeNull();
    fireEvent.mouseLeave(toast);
    act(() => { vi.advanceTimersByTime(7_000); });
    expect(screen.queryByText('Task deleted')).toBeNull();
  });
});

describe('App: keyboard', () => {
  it('ignores the "n" and "/" shortcuts while a dialog is open', () => {
    seed([{ text: 'One' }]);
    render(<App />);
    fireEvent.click(screen.getByLabelText('Open details for "One"'));
    const dialog = screen.getByRole('dialog');
    const close = screen.getByLabelText('Close details');
    close.focus();
    fireEvent.keyDown(close, { key: 'n' });
    expect(dialog.contains(document.activeElement)).toBe(true);
    fireEvent.keyDown(close, { key: '/' });
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('toggles the command palette with Ctrl+K', () => {
    render(<App />);
    fireEvent.keyDown(document.body, { key: 'k', ctrlKey: true });
    expect(screen.queryByRole('combobox', { name: 'Command' })).not.toBeNull();
    fireEvent.keyDown(document.body, { key: 'k', ctrlKey: true });
    expect(screen.queryByRole('combobox', { name: 'Command' })).toBeNull();
  });

  it('moves a task from the drawer without dragging, and keeps focus in the drawer', () => {
    seed([{ text: 'One' }, { text: 'Two' }, { text: 'Three' }]);
    render(<App />);
    fireEvent.click(screen.getByLabelText('Open details for "One"'));
    const down = screen.getByRole('button', { name: 'Move down' });
    down.focus();
    fireEvent.click(down);
    expect(titles()).toEqual(['Two', 'One', 'Three']);
    expect(status()).toBe('Moved "One" to position 2 of 3');
    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Move up' }));
    expect(titles()).toEqual(['One', 'Two', 'Three']);
  });

  it('keeps focus on a task while Alt+Arrow moves it, and announces the move', () => {
    seed([{ text: 'One' }, { text: 'Two' }, { text: 'Three' }]);
    render(<App />);
    const one = screen.getByText('One');
    one.focus();
    fireEvent.keyDown(one, { key: 'ArrowDown', altKey: true });
    expect(titles()).toEqual(['Two', 'One', 'Three']);
    expect(document.activeElement?.textContent).toBe('One');
    expect(status()).toBe('Moved "One" to position 2 of 3');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown', altKey: true });
    expect(titles()).toEqual(['Two', 'Three', 'One']);
    expect(document.activeElement?.textContent).toBe('One');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp', altKey: true });
    expect(titles()).toEqual(['Two', 'One', 'Three']);
    expect(document.activeElement?.textContent).toBe('One');
  });

  it('says why reordering does nothing while the list is sorted', () => {
    seed([{ text: 'One' }, { text: 'Two' }]);
    render(<App />);
    fireEvent.change(screen.getByLabelText('Sort tasks'), { target: { value: 'priority' } });
    fireEvent.keyDown(screen.getByText('One'), { key: 'ArrowDown', altKey: true });
    expect(titles()).toEqual(['One', 'Two']);
    expect(status()).toMatch(/reorder/i);
  });

  it('reorders by drag and drop and by keyboard through the same path', () => {
    seed([{ text: 'One' }, { text: 'Two' }, { text: 'Three' }]);
    render(<App />);
    const rows = () => [...document.querySelectorAll<HTMLElement>('.list .item')];
    const data: Record<string, string> = {};
    const dataTransfer = { types: ['application/x-task'], setData: (t: string, v: string) => { data[t] = v; }, getData: (t: string) => data[t] ?? '', effectAllowed: '', dropEffect: '' };
    fireEvent.dragStart(rows()[2], { dataTransfer });
    fireEvent.dragEnter(rows()[0], { dataTransfer });
    expect(rows()[0].classList.contains('over')).toBe(true);
    expect(rows()[2].classList.contains('dragging')).toBe(true);
    fireEvent.dragOver(rows()[0], { dataTransfer });
    fireEvent.drop(rows()[0], { dataTransfer });
    fireEvent.dragEnd(rows()[0], { dataTransfer });
    expect(titles()).toEqual(['Three', 'One', 'Two']);
    expect(document.querySelector('.item.over, .item.dragging')).toBeNull();
    fireEvent.keyDown(screen.getByText('Three'), { key: 'ArrowDown', altKey: true });
    expect(titles()).toEqual(['One', 'Three', 'Two']);
    expect(JSON.parse(localStorage.getItem('todo-app:v1')!).map((t: Task) => t.text)).toEqual(['One', 'Three', 'Two']);
  });
});

describe('App: recurring tasks', () => {
  it('creates the next occurrence on completion and removes it again on undo', () => {
    seed([{ text: 'Water plants', dueDate: '2026-11-10', repeat: 'weekly' }]);
    render(<App />);
    fireEvent.click(screen.getByLabelText('Mark "Water plants" as done'));
    expect(titles()).toEqual(['Water plants', 'Water plants']);
    fireEvent.click(screen.getByLabelText('Mark "Water plants" as not done'));
    expect(titles()).toEqual(['Water plants']);
  });
});

describe('App: date rollover', () => {
  it('moves a task from Today to overdue when midnight passes with the tab open', () => {
    vi.setSystemTime(new Date(2026, 10, 10, 23, 59, 30));
    seed([{ text: 'Due tonight', dueDate: '2026-11-10' }]);
    render(<App />);
    expect(document.querySelector('.item .due-today')).not.toBeNull();
    expect(viewButton(/^Overdue/).textContent).toBe('Overdue0');
    act(() => { vi.advanceTimersByTime(60_000); });
    expect(document.querySelector('.item .overdue')?.textContent).toBe('Due yesterday');
    expect(viewButton(/^Overdue/).textContent).toBe('Overdue1');
  });
});

describe('App: mobile menu', () => {
  it('opens the sidebar as a dialog, traps focus, and returns focus to the menu button on Escape', () => {
    render(<App />);
    const menu = screen.getByRole('button', { name: 'Open menu' });
    menu.focus();
    fireEvent.click(menu);
    const side = document.querySelector('.side')!;
    expect(side.classList.contains('open')).toBe(true);
    expect(side.contains(document.activeElement)).toBe(true);
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    expect(side.classList.contains('open')).toBe(false);
    expect(document.activeElement).toBe(menu);
  });

  it('names its controls the way they look, and links the menu button to the sidebar', () => {
    seed([{ text: 'One', done: true }]);
    render(<App />);
    const menu = screen.getByRole('button', { name: 'Open menu' });
    expect(document.getElementById(menu.getAttribute('aria-controls')!)).toBe(document.querySelector('.side'));
    // The visible word must be part of the accessible name (WCAG 2.5.3 label in name)
    const commands = screen.getByRole('button', { name: /^Commands/ });
    fireEvent.click(commands);
    expect(screen.queryByRole('combobox', { name: 'Command' })).not.toBeNull();
    expect(screen.getByRole('img', { name: 'All 1 task done' })).not.toBeNull();
  });

  it('closes the menu after picking a view', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    fireEvent.click(viewButton(/^Today/));
    expect(document.querySelector('.side')!.classList.contains('open')).toBe(false);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Today');
  });
});

describe('App: lists', () => {
  it('marks each list with a monogram and highlights only the active one', () => {
    render(<App />);
    const marks = () => [...document.querySelectorAll('.side .mark')];
    expect(marks().map((m) => m.textContent)).toEqual(['PE', 'WO']);
    expect(marks().every((m) => m.getAttribute('aria-hidden') === 'true')).toBe(true);
    expect(document.querySelectorAll('.side button.on .mark')).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: /^Work/ }));
    expect([...document.querySelectorAll('.side button.on .mark')].map((m) => m.textContent)).toEqual(['WO']);
    expect(JSON.parse(localStorage.getItem('todo-lists:v1')!)[1]).toEqual({ id: 'work', name: 'Work', color: '#FFC53D' });
  });

  it('does not create a second list with the same name', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('New list name'), { target: { value: ' work ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add list' }));
    expect(screen.getAllByRole('button', { name: /^Delete list/ })).toHaveLength(2);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Work');
  });
});
