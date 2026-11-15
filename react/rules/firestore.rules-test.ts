import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { assertFails, assertSucceeds, initializeTestEnvironment, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { deleteDoc, doc, getDoc, getDocs, collection, setDoc } from 'firebase/firestore';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';

let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-tasks',
    firestore: { rules: readFileSync(fileURLToPath(new URL('../firestore.rules', import.meta.url)), 'utf8') },
  });
});
afterAll(async () => { await env?.cleanup(); });
beforeEach(async () => { await env.clearFirestore(); });

const alice = () => env.authenticatedContext('alice').firestore();
const bob = () => env.authenticatedContext('bob').firestore();
const guest = () => env.unauthenticatedContext().firestore();

const task = (over: Record<string, unknown> = {}) => ({ id: 't1', text: 'Pay rent', priority: 'high', done: false, order: 0, ...over });
const list = (over: Record<string, unknown> = {}) => ({ id: 'home', name: 'Home', color: '#D62839', order: 0, ...over });

async function seedAliceTask() {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), 'users/alice/tasks/t1'), task());
  });
}

describe('owner access', () => {
  it('lets a user create, read, update and delete their own task', async () => {
    const db = alice();
    await assertSucceeds(setDoc(doc(db, 'users/alice/tasks/t1'), task({ dueDate: '2026-11-14', listId: 'home', notes: 'Online', repeat: 'monthly', repeatDay: 14 })));
    await assertSucceeds(getDoc(doc(db, 'users/alice/tasks/t1')));
    await assertSucceeds(getDocs(collection(db, 'users/alice/tasks')));
    await assertSucceeds(setDoc(doc(db, 'users/alice/tasks/t1'), task({ done: true })));
    await assertSucceeds(deleteDoc(doc(db, 'users/alice/tasks/t1')));
  });

  it('lets a user write their own lists', async () => {
    await assertSucceeds(setDoc(doc(alice(), 'users/alice/lists/home'), list()));
    await assertSucceeds(setDoc(doc(alice(), 'users/alice/lists/work'), list({ id: 'work', color: '#FC3' })));
  });
});

describe('no access to other people', () => {
  it('stops another user from reading, writing or deleting', async () => {
    await seedAliceTask();
    await assertFails(getDoc(doc(bob(), 'users/alice/tasks/t1')));
    await assertFails(getDocs(collection(bob(), 'users/alice/tasks')));
    await assertFails(setDoc(doc(bob(), 'users/alice/tasks/t2'), task({ id: 't2' })));
    await assertFails(deleteDoc(doc(bob(), 'users/alice/tasks/t1')));
  });

  it('stops signed-out visitors entirely', async () => {
    await seedAliceTask();
    await assertFails(getDoc(doc(guest(), 'users/alice/tasks/t1')));
    await assertFails(setDoc(doc(guest(), 'users/alice/tasks/t2'), task({ id: 't2' })));
  });

  it('denies every path outside tasks and lists', async () => {
    await assertFails(setDoc(doc(alice(), 'users/alice/secrets/x'), { a: 1 }));
    await assertFails(setDoc(doc(alice(), 'users/alice'), { a: 1 }));
    await assertFails(getDoc(doc(alice(), 'config/app')));
  });
});

describe('only valid data is stored', () => {
  const rejects = (name: string, data: Record<string, unknown>, path = 'users/alice/tasks/t1') =>
    it(`rejects ${name}`, async () => { await assertFails(setDoc(doc(alice(), path), data)); });

  rejects('a task without text', task({ text: '' }));
  rejects('text over 1000 characters', task({ text: 'x'.repeat(1001) }));
  rejects('an unknown field', task({ admin: true }));
  rejects('a wrong priority', task({ priority: 'urgent' }));
  rejects('a document id that differs from the task id', task({ id: 'other' }));
  rejects('a malformed due date', task({ dueDate: 'tomorrow' }));
  rejects('a repeat day out of range', task({ repeat: 'monthly', repeatDay: 32 }));
  rejects('a done flag that is not a boolean', task({ done: 'yes' }));
  rejects('a task with no order', (({ order: _o, ...rest }) => rest)(task()));
  rejects('more than 100 subtasks', task({ subtasks: Array.from({ length: 101 }, (_, i) => ({ id: `s${i}`, text: 's', done: false })) }));
  rejects('a list colour that is not hex', list({ color: 'red' }), 'users/alice/lists/home');
  rejects('a list with an extra field', list({ owner: 'bob' }), 'users/alice/lists/home');
});
