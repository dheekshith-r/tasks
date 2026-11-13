import { useEffect, useRef, useState } from 'react';
import type { CloudApi, CloudSnapshot, CloudUser } from './cloud';
import { readConfig } from './firebaseConfig';
import type { List, Task } from './types';

// Optional Google sign-in with cloud sync. Guest mode (this device only) is the default and
// needs no network. `todo-cloud:v1` remembers that someone signed in, so the Firebase SDK is
// loaded on the next visit only for them.

const FLAG_KEY = 'todo-cloud:v1';
export type SyncState = 'guest' | 'connecting' | 'synced' | 'offline' | 'error';

const config = readConfig();
export const cloudAvailable = config !== null;

const flagOn = () => { try { return localStorage.getItem(FLAG_KEY) === 'on'; } catch { return false; } };
const setFlag = (on: boolean) => {
  try { if (on) localStorage.setItem(FLAG_KEY, 'on'); else localStorage.removeItem(FLAG_KEY); } catch { /* ignore */ }
};

interface Options {
  current: () => { tasks: Task[]; lists: List[] }; // the guest list on screen when sign-in starts
  onSnapshot: (s: CloudSnapshot) => void;
  onSignedOut: () => void;
  confirmCopy: (count: number) => boolean;
  announce: (message: string) => void;
}

export function useCloud(options: Options) {
  const [active, setActive] = useState(() => cloudAvailable && flagOn());
  const [user, setUser] = useState<CloudUser | null>(null);
  const [sync, setSync] = useState<SyncState>('guest');
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false); // true after the first cloud snapshot is on screen
  const api = useRef<CloudApi | null>(null);
  const leaving = useRef(false); // set while signing out or deleting: see the onUser handler
  const opts = useRef(options);
  opts.current = options;

  async function load(): Promise<CloudApi> {
    if (!api.current) api.current = (await import('./cloud')).createCloud(config!);
    return api.current;
  }

  // Follow the signed-in user while cloud mode is active.
  useEffect(() => {
    if (!active) return;
    let stop: (() => void) | undefined;
    let cancelled = false;
    load().then((cloud) => {
      if (!cancelled) stop = cloud.onUser((u) => {
        setUser(u);
        // A session that expired on another device: go back to guest mode. Never while
        // leave() runs, or guest saving would restart while the account's tasks are on screen.
        if (!u && !leaving.current) {
          setFlag(false);
          setActive(false);
          setSync('guest');
          opts.current.onSignedOut();
        }
      });
    }).catch(() => { setSync('error'); setError('Could not load sync. Your list on this device still works.'); });
    return () => { cancelled = true; stop?.(); };
  }, [active]);

  // Live tasks for the signed-in user. Firestore's cache answers first, then the server.
  const uid = user?.uid;
  useEffect(() => {
    if (!uid || !api.current) return;
    setSync('connecting');
    setReady(false);
    return api.current.watch(uid, (snapshot) => {
      opts.current.onSnapshot(snapshot);
      setReady(true);
      setSync(snapshot.offline ? 'offline' : 'synced');
      setError('');
    }, (e) => {
      setSync('error');
      setError(errorMessage(e));
    });
  }, [uid]);

  async function signIn() {
    try {
      const cloud = await load();
      const signedIn = await cloud.signIn();
      const guest = opts.current.current();
      // Offer once to bring this device's tasks into the account.
      if (guest.tasks.length && opts.current.confirmCopy(guest.tasks.length)) {
        await cloud.push(signedIn.uid, guest.tasks, guest.lists);
      }
      setFlag(true);
      setActive(true);
      setUser(signedIn);
      opts.current.announce(`Signed in as ${signedIn.name || signedIn.email}. Your tasks now sync.`);
    } catch (e) {
      const code = (e as { code?: string }).code ?? '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return;
      setError(errorMessage(e));
      opts.current.announce(`Sign-in did not finish. ${errorMessage(e)}`);
    }
  }

  async function leave(action: 'signOut' | 'delete') {
    const cloud = api.current;
    const id = user?.uid;
    leaving.current = true;
    setUser(null); // stops the live listener before anything is removed
    setReady(false);
    try {
      if (cloud && action === 'signOut') await cloud.signOut();
      if (cloud && action === 'delete' && id) await cloud.deleteEverything(id);
    } catch (e) {
      setError(errorMessage(e));
      opts.current.announce(`That did not finish. ${errorMessage(e)}`);
      if (action === 'delete') { // stay in cloud mode, signed in, so the person can try again
        leaving.current = false;
        setUser(id ? user : null);
        return;
      }
    }
    leaving.current = false;
    api.current = null;
    setFlag(false);
    setActive(false);
    setSync('guest');
    opts.current.onSignedOut();
    opts.current.announce(action === 'delete'
      ? 'Your cloud data and account are deleted. This device shows its own list again.'
      : 'Signed out. This device shows its own list again.');
  }

  function push(tasks: Task[], lists: List[]) {
    if (!uid || !ready || !api.current) return;
    api.current.push(uid, tasks, lists).catch((e) => { setSync('error'); setError(errorMessage(e)); });
  }

  return {
    available: cloudAvailable,
    // 'cloud' from the moment sign-in is confirmed until sign-out has finished. Guest data is
    // written to this device only in 'guest' mode.
    mode: (active ? 'cloud' : 'guest') as 'cloud' | 'guest',
    user,
    sync,
    error,
    ready,
    signIn,
    signOut: () => leave('signOut'),
    deleteCloudData: () => leave('delete'),
    push,
  };
}

function errorMessage(e: unknown): string {
  const code = (e as { code?: string }).code ?? '';
  if (code === 'resource-exhausted') return "Today's free sync quota is used up. Sync resumes after midnight Pacific time. Export a backup to keep today's changes.";
  if (code === 'auth/popup-blocked') return 'The browser blocked the sign-in window. Allow pop-ups for this site and try again.';
  if (code === 'auth/network-request-failed' || code === 'unavailable') return 'No connection. Your changes wait on this device and sync when you are back online.';
  if (code === 'permission-denied') return 'The server refused this change. Export a backup to keep it.';
  return 'Something went wrong with sync. Export a backup to be safe.';
}
