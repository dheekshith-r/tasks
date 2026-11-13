// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { PENDING_KEY, addFromStartPage, resolveList, takePending } from './handoff';
import { DEFAULT_LISTS, loadLists, loadTasks } from './storage';

beforeEach(() => localStorage.clear());

describe('start page hand-off, guest mode', () => {
  it('saves the task straight into this device list, first in line', () => {
    localStorage.setItem('todo-app:v1', JSON.stringify([{ id: 'old', text: 'Older task', priority: 'low', done: false }]));
    expect(addFromStartPage({ text: 'Pay rent', priority: 'high', dueDate: '2026-11-13' })).toBe('saved');
    const tasks = loadTasks(loadLists());
    expect(tasks.map((t) => t.text)).toEqual(['Pay rent', 'Older task']);
    expect(tasks[0]).toMatchObject({ priority: 'high', dueDate: '2026-11-13', done: false });
    expect(localStorage.getItem(PENDING_KEY)).toBeNull();
  });

  it('files the task under an existing list in any letter case, or creates the list', () => {
    addFromStartPage({ text: 'Call Asha', priority: 'med', listName: 'WORK' });
    expect(loadLists()).toHaveLength(DEFAULT_LISTS.length);
    expect(loadTasks(loadLists())[0].listId).toBe('work');
    addFromStartPage({ text: 'Buy curd', priority: 'med', listName: 'home' });
    const home = loadLists().find((l) => l.name === 'Home');
    expect(home).toBeTruthy();
    expect(loadTasks(loadLists())[0].listId).toBe(home!.id);
  });

  it('refuses empty or malformed input without touching storage', () => {
    expect(addFromStartPage({ text: '   ', priority: 'med' })).toBe('failed');
    expect(addFromStartPage({ text: 'x', priority: 'urgent' as never })).toBe('failed');
    expect(localStorage.getItem('todo-app:v1')).toBeNull();
  });
});

describe('start page hand-off, signed in', () => {
  beforeEach(() => localStorage.setItem('todo-cloud:v1', 'on'));

  it('parks the task for the app instead of writing the guest list', () => {
    expect(addFromStartPage({ text: 'Pay rent', priority: 'high', listName: 'home' })).toBe('pending');
    expect(localStorage.getItem('todo-app:v1')).toBeNull();
    expect(takePending()).toEqual({ text: 'Pay rent', priority: 'high', listName: 'home' });
    expect(takePending()).toBeNull(); // taken once only
  });

  it('drops a tampered parked task', () => {
    localStorage.setItem(PENDING_KEY, JSON.stringify({ text: 'Hi', priority: 'urgent', dueDate: 'soon' }));
    expect(takePending()).toBeNull();
    localStorage.setItem(PENDING_KEY, '{not json');
    expect(takePending()).toBeNull();
    expect(localStorage.getItem(PENDING_KEY)).toBeNull();
  });
});

describe('resolveList', () => {
  it('returns no list id when no name is given', () => {
    expect(resolveList(DEFAULT_LISTS)).toEqual({ lists: DEFAULT_LISTS });
  });
});
