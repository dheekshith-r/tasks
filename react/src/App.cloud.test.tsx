// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CloudSnapshot, CloudUser } from './cloud';
import type { List, Task } from './types';

// A fake Firebase, so the whole guest ⇄ account flow runs without a network.
const h = vi.hoisted(() => {
  const s = {
    user: null as CloudUser | null,
    userCb: null as ((u: CloudUser | null) => void) | null,
    dataCb: null as ((snap: CloudSnapshot) => void) | null,
    pushes: [] as { uid: string; tasks: string[]; lists: string[] }[],
    deleted: [] as string[],
    signedOut: 0,
    signInError: null as unknown,
  };
  const asha: CloudUser = { uid: 'u1', name: 'Asha', email: 'asha@example.com' };
  const api = {
    onUser(cb: (u: CloudUser | null) => void) { s.userCb = cb; queueMicrotask(() => cb(s.user)); return () => { s.userCb = null; }; },
    async signIn() { if (s.signInError) throw s.signInError; s.user = asha; return asha; },
    async signOut() { s.signedOut++; s.user = null; s.userCb?.(null); },
    async hasData() { return false; },
    watch(_uid: string, onData: (snap: CloudSnapshot) => void) { s.dataCb = onData; return () => { s.dataCb = null; }; },
    async push(uid: string, tasks: Task[], lists: List[]) { s.pushes.push({ uid, tasks: tasks.map((t) => t.text), lists: lists.map((l) => l.name) }); },
    async deleteEverything(uid: string) { s.deleted.push(uid); s.user = null; s.userCb?.(null); },
  };
  return { s, api, asha };
});

vi.mock('./firebaseConfig', () => ({ readConfig: () => ({ apiKey: 'k', authDomain: 'tasks-demo.firebaseapp.com', projectId: 'tasks-demo', appId: 'a' }) }));
vi.mock('./cloud', () => ({ createCloud: () => h.api }));

const { default: App } = await import('./App');

const noop = () => {};
const titles = () => [...document.querySelectorAll('.list .text')].map((n) => n.textContent);
const guestSaved = () => (JSON.parse(localStorage.getItem('todo-app:v1') ?? '[]') as Task[]).map((t) => t.text);
const cloudTask = (text: string, id = text): Task => ({ id, text, priority: 'med', done: false });
const sendSnapshot = (tasks: Task[], lists: List[] = []) => act(() => { h.s.dataCb?.({ tasks, lists, offline: false }); });
const addTask = (text: string) => {
  fireEvent.change(screen.getByLabelText('New task'), { target: { value: text } });
  fireEvent.click(screen.getByRole('button', { name: 'Add task' }));
};

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), addEventListener: noop, removeEventListener: noop }));
  Object.assign(h.s, { user: null, userCb: null, dataCb: null, pushes: [], deleted: [], signedOut: 0, signInError: null });
  localStorage.setItem('todo-app:v1', JSON.stringify([{ id: 'g1', text: 'Guest task', priority: 'med', done: false }]));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

async function signIn(copy: boolean) {
  vi.spyOn(window, 'confirm').mockReturnValue(copy);
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Sign in with Google' })); });
  await waitFor(() => expect(h.s.dataCb).not.toBeNull());
}

describe('guest mode', () => {
  it('is the default: device-only text, a sign-in offer, and saving to this device', () => {
    render(<App />);
    expect(screen.getByText(/Guest mode: your tasks are saved in this browser only/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Sign in with Google' })).toBeTruthy();
    addTask('Another guest task');
    expect(guestSaved()).toContain('Another guest task');
    expect(h.s.pushes).toHaveLength(0);
  });
});

describe('signing in', () => {
  it('copies guest tasks when asked, then shows the account list without touching the guest list', async () => {
    render(<App />);
    await signIn(true);
    expect(h.s.pushes[0]).toMatchObject({ uid: 'u1', tasks: ['Guest task'] });
    sendSnapshot([cloudTask('Guest task', 'g1'), cloudTask('From my phone')]);
    expect(titles()).toEqual(['Guest task', 'From my phone']);
    expect(screen.getByText(/Signed in as Asha\. Synced\./)).toBeTruthy();
    expect(guestSaved()).toEqual(['Guest task']);
  });

  it('does not copy when declined', async () => {
    render(<App />);
    await signIn(false);
    expect(h.s.pushes).toHaveLength(0);
  });

  it('sends new tasks to the account, never to guest storage', async () => {
    render(<App />);
    await signIn(false);
    sendSnapshot([cloudTask('From my phone')]);
    addTask('Buy curd');
    await waitFor(() => expect(h.s.pushes[h.s.pushes.length - 1]?.tasks).toEqual(['Buy curd', 'From my phone']));
    expect(guestSaved()).toEqual(['Guest task']);
  });

  it('does nothing when the person closes the Google window', async () => {
    h.s.signInError = { code: 'auth/popup-closed-by-user' };
    render(<App />);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Sign in with Google' })); });
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByRole('button', { name: 'Sign in with Google' })).toBeTruthy();
  });

  it('explains a blocked pop-up', async () => {
    h.s.signInError = { code: 'auth/popup-blocked' };
    render(<App />);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Sign in with Google' })); });
    expect(screen.getByRole('alert').textContent).toMatch(/Allow pop-ups/);
  });
});

describe('leaving the account', () => {
  it('signs out and brings back this device list, with guest storage never overwritten', async () => {
    render(<App />);
    await signIn(false);
    sendSnapshot([cloudTask('Account only')]);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Sign out' })); });
    expect(h.s.signedOut).toBe(1);
    expect(titles()).toEqual(['Guest task']);
    expect(guestSaved()).toEqual(['Guest task']);
    expect(localStorage.getItem('todo-cloud:v1')).toBeNull();
  });

  it('deletes cloud data only after a confirmation', async () => {
    render(<App />);
    await signIn(false);
    sendSnapshot([cloudTask('Account only')]);
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    fireEvent.click(screen.getByRole('button', { name: 'Delete my cloud data' }));
    expect(h.s.deleted).toEqual([]);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Delete my cloud data' })); });
    expect(h.s.deleted).toEqual(['u1']);
    expect(titles()).toEqual(['Guest task']);
    expect(guestSaved()).toEqual(['Guest task']);
  });
});

describe('coming back', () => {
  it('restores a signed-in session on the next visit', async () => {
    localStorage.setItem('todo-cloud:v1', 'on');
    h.s.user = h.asha;
    render(<App />);
    await waitFor(() => expect(h.s.dataCb).not.toBeNull());
    sendSnapshot([cloudTask('Synced task')]);
    expect(titles()).toEqual(['Synced task']);
  });

  it('falls back to guest mode when the session has ended elsewhere', async () => {
    localStorage.setItem('todo-cloud:v1', 'on');
    render(<App />);
    await waitFor(() => expect(localStorage.getItem('todo-cloud:v1')).toBeNull());
    expect(titles()).toEqual(['Guest task']);
    expect(screen.getByRole('button', { name: 'Sign in with Google' })).toBeTruthy();
  });
});
