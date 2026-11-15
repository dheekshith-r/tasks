import { sanitizeLists, sanitizeTask } from './storage';
import type { List, Task } from './types';

// Pure helpers for cloud sync: no Firebase here, so they are fully unit-tested.
// Each task and list is one Firestore document. `order` keeps the manual order across devices.

export type Doc = Record<string, unknown> & { id: string; order: number };
export interface Change { set: Doc[]; remove: string[] }

// Firestore rejects `undefined`, so optional fields are left out instead.
const clean = (o: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));

export const taskToDoc = (t: Task, order: number): Doc => ({ ...clean({ ...t }), id: t.id, order });
export const listToDoc = (l: List, order: number): Doc => ({ id: l.id, name: l.name, color: l.color, order });

const byOrder = (a: { order?: unknown }, b: { order?: unknown }) =>
  (typeof a.order === 'number' ? a.order : 0) - (typeof b.order === 'number' ? b.order : 0);

// Documents from the server are untrusted like any stored data: rebuilt from known fields only.
export function docsToTasks(docs: Record<string, unknown>[], lists: List[]): Task[] {
  const ids = new Set(lists.map((l) => l.id));
  return [...docs].sort(byOrder)
    .map((d) => { const { order: _o, ...rest } = d; return sanitizeTask(rest, ids); })
    .filter((t): t is Task => !!t);
}

export function docsToLists(docs: Record<string, unknown>[]): List[] {
  return sanitizeLists([...docs].sort(byOrder));
}

// The documents that must change for the cloud to match `next`. `known` maps each id to the
// JSON of what the cloud already holds; equal documents are not written again, which stops an
// echo loop when a snapshot comes back and saves the free daily write quota.
export function diff(known: Map<string, string>, next: Doc[]): Change {
  const set = next.filter((d) => known.get(d.id) !== stableJson(d));
  const keep = new Set(next.map((d) => d.id));
  const remove = [...known.keys()].filter((id) => !keep.has(id));
  return { set, remove };
}

// JSON with sorted keys, so field order never counts as a change.
export function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value && typeof value === 'object') {
    const o = value as Record<string, unknown>;
    return `{${Object.keys(o).filter((k) => o[k] !== undefined).sort().map((k) => `${JSON.stringify(k)}:${stableJson(o[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

// A Firestore batch holds at most 500 writes.
export function chunk<T>(items: T[], size = 450): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}
