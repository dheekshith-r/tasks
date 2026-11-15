import { type ReactNode, useRef, useState } from 'react';
import { useDialog } from '../hooks';
import type { List, View } from '../types';
import { CloseIcon, PlusIcon } from './icons';

const SMART: { id: View; label: string }[] = [
  { id: 'all', label: 'All tasks' },
  { id: 'today', label: 'Today' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'overdue', label: 'Carried over' },
];

interface Props {
  view: View;
  onView: (v: View) => void;
  counts: Record<string, number>;
  lists: List[];
  onAddList: (name: string) => void;
  onDeleteList: (id: string) => void;
  open: boolean; // only matters on narrow screens, where the rail is an off-canvas menu
  onClose: () => void;
  footer?: ReactNode; // commands and theme, at the foot of the rail
}

// The brand mark of the start page: a sorting frame with the red slot.
export function BrandMark() {
  return (
    <svg className="brand-mark" width="22" height="22" viewBox="0 0 26 26" aria-hidden="true">
      <rect x="1.5" y="1.5" width="23" height="23" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M13 2v22M2 13h22" stroke="currentColor" strokeWidth="2" />
      <rect x="15.5" y="4.5" width="6" height="6" fill="#D62839" />
    </svg>
  );
}

// The rail on a laptop, the menu on a phone: views, then the lists written as #name (the way
// you type them), then a new list, then commands and the theme.
export default function Sidebar({ view, onView, counts, lists, onAddList, onDeleteList, open, onClose, footer }: Props) {
  const [name, setName] = useState('');
  const ref = useRef<HTMLElement>(null);
  useDialog(ref, open, onClose); // focus trap, Escape and focus restore while it is a drawer

  function go(v: View) {
    onView(v);
    onClose();
  }

  return (
    <>
      {/* Always rendered, so it can fade out with the panel */}
      <div className={`scrim${open ? ' open' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside ref={ref} id="sidebar" className={`side${open ? ' open' : ''}`} aria-label="Views and lists"
        role={open ? 'dialog' : undefined} aria-modal={open ? true : undefined}>
        <div className="side-head">
          <p className="brand"><BrandMark />Tasks</p>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close menu"><CloseIcon /></button>
        </div>

        <nav className="views" aria-label="Views">
          {SMART.map((v) => {
            const n = counts[v.id] ?? 0;
            return (
              <button key={v.id} type="button" className={view === v.id ? 'on' : ''} aria-current={view === v.id ? 'page' : undefined} onClick={() => go(v.id)}>
                <span className="label">{v.label}</span>
                <span className={`n${v.id === 'today' && n > 0 ? ' sun' : ''}`}>{n}</span>
              </button>
            );
          })}
        </nav>

        <p className="side-title" id="lists-title">Lists</p>
        <nav className="views lists" aria-labelledby="lists-title">
          {lists.map((l) => {
            const id = `list:${l.id}` as View;
            return (
              <div key={l.id} className="list-row">
                <button type="button" className={view === id ? 'on' : ''} aria-current={view === id ? 'page' : undefined} onClick={() => go(id)}>
                  <span className="label" title={l.name}><span className="hash" aria-hidden="true">#</span>{l.name}</span>
                  <span className="n">{counts[id] ?? 0}</span>
                </button>
                <button type="button" className="x" aria-label={`Delete list ${l.name}`} onClick={() => onDeleteList(l.id)}><CloseIcon size={16} /></button>
              </div>
            );
          })}
        </nav>

        <form className="new-list" onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          onAddList(name.trim());
          setName('');
        }}>
          <label className="sr-only" htmlFor="new-list">New list name</label>
          <input id="new-list" type="text" placeholder="New list" maxLength={24} value={name} onChange={(e) => setName(e.target.value)} />
          <button type="submit" aria-label="Add list"><PlusIcon size={16} /></button>
        </form>

        {footer && <div className="side-foot">{footer}</div>}
      </aside>
    </>
  );
}
