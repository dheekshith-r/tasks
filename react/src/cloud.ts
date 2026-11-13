import { deleteApp, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  GoogleAuthProvider, deleteUser, getAuth, onAuthStateChanged, reauthenticateWithPopup,
  signInWithPopup, signOut as fbSignOut, type Auth, type User,
} from 'firebase/auth';
import {
  clearIndexedDbPersistence, collection, doc, getDocs, initializeFirestore, limit, onSnapshot,
  persistentLocalCache, persistentMultipleTabManager, query, terminate, writeBatch, type Firestore,
} from 'firebase/firestore';
import { chunk, diff, docsToLists, docsToTasks, listToDoc, stableJson, taskToDoc } from './cloudSync';
import type { FirebaseWebConfig } from './firebaseConfig';
import type { List, Task } from './types';

// Everything that touches Firebase. This module is loaded with import() only when someone signs
// in (or is already signed in), so guests never download the SDK.

export interface CloudUser { uid: string; name: string; email: string }
export interface CloudSnapshot { tasks: Task[]; lists: List[]; offline: boolean }

export interface CloudApi {
  onUser(cb: (user: CloudUser | null) => void): () => void;
  signIn(): Promise<CloudUser>;
  signOut(): Promise<void>;
  hasData(uid: string): Promise<boolean>;
  watch(uid: string, onData: (s: CloudSnapshot) => void, onError: (e: unknown) => void): () => void;
  push(uid: string, tasks: Task[], lists: List[]): Promise<void>;
  deleteEverything(uid: string): Promise<void>;
}

const toUser = (u: User): CloudUser => ({ uid: u.uid, name: u.displayName ?? '', email: u.email ?? '' });

export function createCloud(config: FirebaseWebConfig): CloudApi {
  const app: FirebaseApp = initializeApp(config, `tasks-${Date.now()}`);
  const auth: Auth = getAuth(app);
  // The offline cache keeps the list usable without a connection and saves daily reads.
  const db: Firestore = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  });
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  // What the cloud holds right now, as stable JSON per id: the base for every diff.
  const known = { tasks: new Map<string, string>(), lists: new Map<string, string>() };
  const tasksCol = (uid: string) => collection(db, 'users', uid, 'tasks');
  const listsCol = (uid: string) => collection(db, 'users', uid, 'lists');

  async function clearDevice() {
    await terminate(db).catch(() => {});
    await clearIndexedDbPersistence(db).catch(() => {}); // the account's tasks leave this device
    await deleteApp(app).catch(() => {});
  }

  return {
    onUser(cb) {
      return onAuthStateChanged(auth, (u) => cb(u ? toUser(u) : null));
    },

    async signIn() {
      // A popup, not a redirect: the app is not hosted on the Firebase auth domain, and redirects
      // break in browsers that partition storage (Safari, Chrome with third-party cookies off).
      const result = await signInWithPopup(auth, provider);
      return toUser(result.user);
    },

    async signOut() {
      await fbSignOut(auth);
      await clearDevice();
    },

    async hasData(uid) {
      const snap = await getDocs(query(tasksCol(uid), limit(1)));
      return !snap.empty;
    },

    watch(uid, onData, onError) {
      let tasks: Record<string, unknown>[] | null = null;
      let lists: Record<string, unknown>[] | null = null;
      let offline = false;
      const emit = () => {
        if (!tasks || !lists) return; // wait until both collections have arrived once
        const l = docsToLists(lists);
        onData({ tasks: docsToTasks(tasks, l), lists: l, offline });
      };
      const stopTasks = onSnapshot(tasksCol(uid), { includeMetadataChanges: true }, (snap) => {
        tasks = snap.docs.map((d) => d.data());
        known.tasks = new Map(snap.docs.map((d) => [d.id, stableJson(d.data())]));
        offline = snap.metadata.fromCache;
        emit();
      }, onError);
      const stopLists = onSnapshot(listsCol(uid), { includeMetadataChanges: true }, (snap) => {
        lists = snap.docs.map((d) => d.data());
        known.lists = new Map(snap.docs.map((d) => [d.id, stableJson(d.data())]));
        emit();
      }, onError);
      return () => { stopTasks(); stopLists(); };
    },

    async push(uid, tasks, lists) {
      const listChange = diff(known.lists, lists.map(listToDoc));
      const taskChange = diff(known.tasks, tasks.map(taskToDoc));
      const ops = [
        ...listChange.set.map((d) => ({ ref: doc(listsCol(uid), d.id), data: d })),
        ...taskChange.set.map((d) => ({ ref: doc(tasksCol(uid), d.id), data: d })),
        ...taskChange.remove.map((id) => ({ ref: doc(tasksCol(uid), id), data: null })),
        ...listChange.remove.map((id) => ({ ref: doc(listsCol(uid), id), data: null })),
      ];
      for (const part of chunk(ops)) {
        const batch = writeBatch(db);
        part.forEach((op) => (op.data ? batch.set(op.ref, op.data) : batch.delete(op.ref)));
        // Count the write as known now, so a second change before the snapshot does not repeat it.
        part.forEach((op) => {
          const map = op.ref.parent.id === 'lists' ? known.lists : known.tasks;
          if (op.data) map.set(op.ref.id, stableJson(op.data)); else map.delete(op.ref.id);
        });
        await batch.commit();
      }
    },

    async deleteEverything(uid) {
      for (const col of [tasksCol(uid), listsCol(uid)]) {
        const snap = await getDocs(col);
        for (const part of chunk(snap.docs)) {
          const batch = writeBatch(db);
          part.forEach((d) => batch.delete(d.ref));
          await batch.commit();
        }
      }
      const user = auth.currentUser;
      if (user) {
        try {
          await deleteUser(user);
        } catch (e) {
          // Deleting an account needs a recent sign-in: confirm once, then try again.
          if ((e as { code?: string }).code !== 'auth/requires-recent-login') throw e;
          await reauthenticateWithPopup(user, provider);
          await deleteUser(user);
        }
      }
      await clearDevice();
    },
  };
}
