import { useEffect, useRef, useState } from 'react';
import type { CloudUser } from '../cloud';
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

const PersonIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
  </svg>
);

// The profile button beside the theme button, at the foot of the rail. It opens a small panel with
// everything about the account: sign in, or who is signed in, sync, sign out, delete.
export default function AccountMenu({ account }: { account: AccountProps }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const { user } = account;

  // Open: focus moves into the panel. Escape or a click outside closes it; Escape returns focus.
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>('button, [href], [tabindex]')?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); setOpen(false); button.current?.focus(); } };
    const onDown = (e: PointerEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('pointerdown', onDown);
    return () => { document.removeEventListener('keydown', onKey, true); document.removeEventListener('pointerdown', onDown); };
  }, [open]);

  const who = user ? (user.name || user.email) : '';
  return (
    <div className="account" ref={wrap}>
      <button ref={button} type="button" className="icon-btn account-btn" aria-label={user ? `Account, ${who}` : 'Account'}
        aria-expanded={open} aria-controls="account-panel" onClick={() => setOpen((o) => !o)}>
        {user ? <span className="initial" aria-hidden="true">{[...who][0]?.toUpperCase() ?? '?'}</span> : <PersonIcon />}
      </button>
      <div id="account-panel" ref={panel} className="account-panel" role="region" aria-label="Account" hidden={!open}>
        <p className="label">Account</p>
        {user ? (
          <>
            <p className="acc-text">Signed in as {who}. {SYNC_TEXT[account.sync]}</p>
            {account.error && <p className="acc-text" role="alert">{account.error}</p>}
            <div className="acc-actions">
              <button type="button" className="link" onClick={account.onSignOut}>Sign out</button>
              <button type="button" className="link danger-link" onClick={account.onDelete}>Delete my account and cloud data</button>
            </div>
          </>
        ) : (
          <>
            <p className="acc-text">You are in guest mode: your tasks stay on this device.</p>
            {account.available ? (
              <>
                <p className="acc-text">Optional. Sign in to use the same list on your phone and laptop.</p>
                {account.error && <p className="acc-text" role="alert">{account.error}</p>}
                <button type="button" className="acc-signin" onClick={account.onSignIn}>Sign in with Google</button>
              </>
            ) : (
              <p className="acc-text">Sign-in is not available on this copy of Tasks.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
