import { loadLists, loadTasks, saveLists, saveTasks } from './storage';
import type { List, Priority, Task } from './types';
import { uid } from './uid';

// Moves a task typed on the start page into the app.
// Guest mode: saved straight into this device's list, so it is kept even if the app is never
// opened. Signed in: parked under PENDING_KEY, and the app adds it once the account's list has
// loaded, so it syncs like any other task and never lands in the guest list by mistake.

export const PENDING_KEY = 'todo-pending:v1';
const CLOUD_KEY = 'todo-cloud:v1';
const LIST_COLORS = ['#D62839', '#FFC53D', '#8A8A8A'];

export interface NewTask { text: string; priority: Priority; dueDate?: string; listName?: string }

const isPriority = (v: unknown): v is Priority => v === 'low' || v === 'med' || v === 'high';
// Same limits as the app's own inputs (task 120, list name 24), counted in characters, not
// UTF-16 units, so an emoji or a Hindi letter is never cut in half.
const clip = (s: string, max: number) => [...s].slice(0, max).join('').trim();
const cleanName = (v: unknown) => (typeof v === 'string' ? clip(v.trim(), 24) : '');

function valid(raw: unknown): NewTask | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const text = typeof r.text === 'string' ? clip(r.text.trim(), 120) : '';
  if (!text || !isPriority(r.priority)) return null;
  const task: NewTask = { text, priority: r.priority };
  if (typeof r.dueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(r.dueDate)) task.dueDate = r.dueDate;
  if (cleanName(r.listName)) task.listName = cleanName(r.listName);
  return task;
}

// Finds the list by name (any letter case) or adds it. Returns the lists and the id to use.
export function resolveList(lists: List[], name?: string): { lists: List[]; listId?: string } {
  if (!name) return { lists };
  const found = lists.find((l) => l.name.toLowerCase() === name.toLowerCase());
  if (found) return { lists, listId: found.id };
  const list = { id: uid(), name: name.charAt(0).toUpperCase() + name.slice(1), color: LIST_COLORS[lists.length % LIST_COLORS.length] };
  return { lists: [...lists, list], listId: list.id };
}

export function toTask(t: NewTask, listId?: string): Task {
  const task: Task = { id: uid(), text: t.text, priority: t.priority, done: false };
  if (t.dueDate) task.dueDate = t.dueDate;
  if (listId) task.listId = listId;
  return task;
}

function signedIn(): boolean {
  try { return localStorage.getItem(CLOUD_KEY) === 'on'; } catch { return false; }
}

// Returns where the task went, so the page can say so truthfully.
export function addFromStartPage(input: NewTask): 'saved' | 'pending' | 'failed' {
  const t = valid(input);
  if (!t) return 'failed';
  try {
    if (signedIn()) {
      localStorage.setItem(PENDING_KEY, JSON.stringify(t));
      return 'pending';
    }
    const { lists, listId } = resolveList(loadLists(), t.listName);
    saveLists(lists);
    saveTasks([toTask(t, listId), ...loadTasks(lists)]);
    return localStorage.getItem('todo-app:v1') ? 'saved' : 'failed';
  } catch {
    return 'failed';
  }
}

// Called by the app: returns a parked task once, then forgets it. Invalid data is dropped.
export function takePending(): NewTask | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (raw === null) return null;
    localStorage.removeItem(PENDING_KEY);
    return valid(JSON.parse(raw));
  } catch {
    return null;
  }
}
