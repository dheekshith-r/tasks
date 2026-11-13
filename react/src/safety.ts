import { isISODate } from './dates';

// Keeps the list from being lost silently. Safari can clear a site's storage after 7 days of
// Safari use with no visit to that site, unless the app is on the Home Screen or the browser
// grants persistent storage (RESEARCH.md, risk 1). This module asks for that protection once
// and remembers when the last backup was exported.

const PERSIST_KEY = 'todo-persist:v1';
const BACKUP_KEY = 'todo-backup:v1';

export type PersistState = 'granted' | 'denied' | 'unsupported' | 'unknown';

function get(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

function set(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* storage blocked: the answer is only lost */ }
}

export function loadPersist(): PersistState {
  const v = get(PERSIST_KEY);
  return v === 'granted' || v === 'denied' || v === 'unsupported' ? v : 'unknown';
}

// Asks the browser to keep this site's data. Chromium and Safari decide silently; Firefox asks
// the user. Called once, after the first saved task, so the request has a reason behind it.
export async function requestPersist(storage: StorageManager | undefined = globalThis.navigator?.storage): Promise<PersistState> {
  let state: PersistState;
  try {
    if (!storage || typeof storage.persist !== 'function') state = 'unsupported';
    else if (typeof storage.persisted === 'function' && await storage.persisted()) state = 'granted';
    else state = (await storage.persist()) ? 'granted' : 'denied';
  } catch {
    state = 'denied';
  }
  set(PERSIST_KEY, state);
  return state;
}

export function loadBackupDate(): string | null {
  const v = get(BACKUP_KEY);
  return isISODate(v) ? v : null;
}

export function saveBackupDate(date: string): void {
  if (isISODate(date)) set(BACKUP_KEY, date);
}

export function storageMessage(state: PersistState): string {
  switch (state) {
    case 'granted': return 'Protected: this browser will keep your tasks.';
    case 'unsupported': return 'This browser cannot protect saved data. Export a backup now and then.';
    default: return 'Not protected yet. The browser may clear data it thinks is unused. Install Tasks or export a backup.';
  }
}
