import { describe, expect, it } from 'vitest';
import { chunk, diff, docsToLists, docsToTasks, listToDoc, stableJson, taskToDoc } from './cloudSync';
import type { List, Task } from './types';

const task = (over: Partial<Task> = {}): Task => ({ id: 't1', text: 'Pay rent', priority: 'high', done: false, ...over });
const home: List = { id: 'home', name: 'Home', color: '#D62839' };

describe('documents', () => {
  it('turns a task into a document with its order and no undefined fields', () => {
    const d = taskToDoc(task({ notes: undefined, dueDate: '2026-11-14' }), 3);
    expect(d).toEqual({ id: 't1', text: 'Pay rent', priority: 'high', done: false, dueDate: '2026-11-14', order: 3 });
    expect('notes' in d).toBe(false);
  });

  it('turns a list into a document with only the stored fields', () => {
    expect(listToDoc(home, 1)).toEqual({ id: 'home', name: 'Home', color: '#D62839', order: 1 });
  });

  it('reads documents back in their saved order and drops the order field', () => {
    const tasks = docsToTasks([
      { ...taskToDoc(task({ id: 'b', text: 'Second' }), 1) },
      { ...taskToDoc(task({ id: 'a', text: 'First' }), 0) },
    ], []);
    expect(tasks.map((t) => t.text)).toEqual(['First', 'Second']);
    expect(tasks[0]).not.toHaveProperty('order');
  });

  it('treats server documents as untrusted: invalid ones are dropped, unknown lists unassigned', () => {
    const tasks = docsToTasks([
      { id: 'ok', text: 'Valid', priority: 'low', done: false, order: 0, listId: 'gone' },
      { id: 'bad', order: 1 },
      { id: 'x', text: 'Odd priority', priority: 'urgent', done: false, order: 2 },
    ], [home]);
    expect(tasks.map((t) => t.id)).toEqual(['ok', 'x']);
    expect(tasks[0].listId).toBeUndefined();
    expect(tasks[1].priority).toBe('med');
  });

  it('reads lists in order', () => {
    expect(docsToLists([{ ...listToDoc({ ...home, id: 'w', name: 'Work' }, 1) }, { ...listToDoc(home, 0) }]).map((l) => l.name)).toEqual(['Home', 'Work']);
  });
});

describe('diff', () => {
  const known = (docs: ReturnType<typeof taskToDoc>[]) => new Map(docs.map((d) => [d.id, stableJson(d)]));

  it('writes nothing when the cloud already matches (no echo loop)', () => {
    const docs = [taskToDoc(task(), 0)];
    expect(diff(known(docs), docs)).toEqual({ set: [], remove: [] });
  });

  it('writes only changed and new documents, and removes deleted ones', () => {
    const before = [taskToDoc(task(), 0), taskToDoc(task({ id: 't2', text: 'Old' }), 1)];
    const after = [taskToDoc(task({ done: true }), 0), taskToDoc(task({ id: 't3', text: 'New' }), 1)];
    const change = diff(known(before), after);
    expect(change.set.map((d) => d.id)).toEqual(['t1', 't3']);
    expect(change.remove).toEqual(['t2']);
  });

  it('counts a reorder as a change', () => {
    const before = [taskToDoc(task(), 0), taskToDoc(task({ id: 't2' }), 1)];
    const after = [taskToDoc(task({ id: 't2' }), 0), taskToDoc(task(), 1)];
    expect(diff(known(before), after).set).toHaveLength(2);
  });
});

describe('helpers', () => {
  it('ignores key order and undefined values in stable JSON', () => {
    expect(stableJson({ b: 1, a: [{ y: 2, x: 1 }], c: undefined })).toBe(stableJson({ a: [{ x: 1, y: 2 }], b: 1 }));
  });

  it('splits writes below the 500-per-batch limit', () => {
    const parts = chunk(Array.from({ length: 1000 }, (_, i) => i));
    expect(parts.map((p) => p.length)).toEqual([450, 450, 100]);
    expect(chunk([])).toEqual([]);
  });
});
