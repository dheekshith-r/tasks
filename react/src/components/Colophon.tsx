import { useRef } from 'react';
import type { CloudUser } from '../cloud';
import { storageMessage, type PersistState } from '../safety';
import type { SyncState } from '../useCloud';

export interface AccountProps {
  available: boolean;
  user: CloudUser | null;
  sync: SyncState;
  error: string;
  onSignIn: () => void;
  onSignOut: () => void;
  onDelete: () => void;
}

const SYNC_TEXT: Record<SyncState, string> = {
  guest: '',
  connecting: 'Connecting…',
  synced: 'Synced.',
  offline: 'Offline. Changes sync when you are back online.',
  error: 'Sync paused. Reload the page to try again.',
};

// `null` is the brand red from the stylesheet.
const ACCENTS: { name: string; value: string | null; swatch: string }[] = [
  { name: 'Red (default)', value: null, swatch: '#D62839' },
  { name: 'Tangerine', value: '#E8590C', swatch: '#E8590C' },
  { name: 'Green', value: '#2B8A3E', swatch: '#2B8A3E' },
  { name: 'Blue', value: '#1C7ED6', swatch: '#1C7ED6' },
  { name: 'Violet', value: '#7048E8', swatch: '#7048E8' },
  { name: 'Pink', value: '#D6409F', swatch: '#D6409F' },
];

interface Props {
  accent: string | null;
  onAccent: (c: string | null) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  modKey: string;
  inert?: boolean; // set while the mobile menu is open
  persist?: PersistState;
  lastBackup?: string | null; // already formatted for display
  account?: AccountProps;
}

export function KeyList({ modKey }: { modKey: string }) {
  return (
    <dl>
      <dt><kbd>N</kbd></dt><dd>New task</dd>
      <dt><kbd>/</kbd></dt><dd>Search</dd>
      <dt><kbd>{modKey}</kbd> <kbd>K</kbd></dt><dd>Commands</dd>
      <dt><kbd>Alt</kbd> <kbd>↑↓</kbd></dt><dd>Reorder</dd>
      <dt><kbd>F2</kbd></dt><dd>Rename</dd>
      <dt><kbd>{modKey}</kbd> <kbd>Z</kbd></dt><dd>Undo a delete</dd>
    </dl>
  );
}

// The page's closing block, like the colophon of a printed poster: settings, backup and shortcuts.
export default function Colophon({ accent, onAccent, onExport, onImport, modKey, inert, persist = 'unknown', lastBackup = null, account }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const user = account?.user;
  return (
    <footer className="colophon" inert={inert}>
      <div className="col-about">
        <p className="col-name">Tasks</p>
        {user
          ? <p>Your tasks sync to your account and are stored by Google Firebase. Only you can read them.</p>
          : <p>Guest mode: your tasks are saved in this browser only. Nothing is uploaded unless you sign in.</p>}
      </div>

      {account?.available && (
        <div className="col-block">
          <p className="col-title">Account</p>
          {user ? (
            <>
              <p className="col-storage">Signed in as {user.name || user.email}. {SYNC_TEXT[account.sync]}</p>
              {account.error && <p className="col-storage" role="alert">{account.error}</p>}
              <div className="data">
                <button type="button" className="link" onClick={account.onSignOut}>Sign out</button>
                <button type="button" className="link" onClick={account.onDelete}>Delete my account and cloud data</button>
              </div>
            </>
          ) : (
            <>
              <p className="col-storage">Optional. Sign in to use the same list on your phone and laptop.</p>
              {account.error && <p className="col-storage" role="alert">{account.error}</p>}
              <button type="button" className="link" onClick={account.onSignIn}>Sign in with Google</button>
            </>
          )}
        </div>
      )}

      <div className="col-block">
        <p className="col-title" id="accent-title">Accent colour</p>
        <div className="swatches" role="group" aria-labelledby="accent-title">
          {ACCENTS.map((a) => (
            <button key={a.name} type="button" className="swatch" style={{ background: a.swatch }}
              title={a.name} aria-label={a.name} aria-pressed={accent === a.value} onClick={() => onAccent(a.value)} />
          ))}
        </div>
      </div>

      <div className="col-block">
        <p className="col-title">Backup</p>
        <p className="col-storage">{storageMessage(persist)}</p>
        <p className="col-storage">Last backup: {lastBackup ?? 'never'}</p>
        <div className="data">
          <button type="button" className="link" onClick={onExport}>Export backup</button>
          <button type="button" className="link" onClick={() => fileRef.current?.click()}>Import backup</button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImport(f);
              e.target.value = '';
            }} />
        </div>
      </div>

      <div className="col-block keys col-keys">
        <p className="col-title">Keys</p>
        <KeyList modKey={modKey} />
      </div>
    </footer>
  );
}
