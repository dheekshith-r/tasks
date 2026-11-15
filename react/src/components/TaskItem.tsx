import { type DragEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { dueInfo, parseISO } from '../dates';
import type { List, Task } from '../types';
import { AlertIcon, MoreIcon, RepeatIcon, TrashIcon } from './icons';

interface Props {
  task: Task;
  list?: List;
  query?: string;
  draggable: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onOpen: (id: string) => void;
  onMove: (from: string, to: string) => void;
  onNudge: (id: string, dir: -1 | 1) => void;
  stamped?: string; // the newest task of this visit carries a postmark with this date (no animation)
  // Where the row sits on the day line: its section already says the day, so the row does not repeat it.
  hideDue?: boolean; // in Today, Tomorrow and the day groups of Upcoming
  weekday?: boolean; // in This week: "Thu 19" instead of "19 Nov"
}

const WEEKDAY = new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric' });
// A private drag type, so dropped files, links or selected text are never mistaken for a task.
const DRAG_TYPE = 'application/x-task';
const isTaskDrag = (e: DragEvent) => [...e.dataTransfer.types].includes(DRAG_TYPE);
// On touch screens a long press should select text, not start a drag; the drawer has Move up/down.
const COARSE = typeof window !== 'undefined' && (window.matchMedia?.('(pointer: coarse)').matches ?? false);

// Wraps every case-insensitive match of the search query in <mark>.
function Highlight({ text, query }: { text: string; query?: string }) {
  const q = query?.trim();
  if (!q) return <>{text}</>;
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return <>{parts.map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part))}</>;
}

export default function TaskItem({ task, list, query, draggable, onToggle, onDelete, onEdit, onOpen, onMove, onNudge, stamped, hideDue, weekday }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);
  const [over, setOver] = useState(false);
  const [dragging, setDragging] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const refocus = useRef(false);
  const open = useRef(false);
  const dragDepth = useRef(0);
  const due = task.dueDate ? dueInfo(task.dueDate, task.done) : null;
  const subs = task.subtasks ?? [];

  // After an inline edit, hand focus back to the title so keyboard users keep their place.
  useEffect(() => {
    if (!editing && refocus.current) {
      refocus.current = false;
      textRef.current?.focus();
    }
  }, [editing]);

  function startEdit() {
    setDraft(task.text);
    setEditing(true);
    open.current = true;
  }
  // Enter or Escape is followed by a blur in some browsers: the `open` flag makes sure an edit
  // is finished exactly once, and that Escape can never be turned into a save by that blur.
  function finish(save: boolean, viaKeyboard = false) {
    if (!open.current) return;
    open.current = false;
    if (save && draft.trim() && draft.trim() !== task.text) onEdit(task.id, draft);
    refocus.current = viaKeyboard;
    setEditing(false);
  }

  function endHover() {
    dragDepth.current = 0;
    setOver(false);
  }

  // Row-level shortcuts, so they work from the checkbox and buttons too.
  function onRowKey(e: KeyboardEvent<HTMLLIElement>) {
    if (editing) return;
    if (e.key === 'F2') { e.preventDefault(); startEdit(); }
    if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      onNudge(task.id, e.key === 'ArrowUp' ? -1 : 1);
    }
  }

  return (
    <li
      data-id={task.id}
      className={`item${task.done ? ' done' : ''}${over ? ' over' : ''}${draggable ? ' drag' : ''}${dragging ? ' dragging' : ''}`}
      draggable={draggable && !editing && !COARSE}
      onKeyDown={onRowKey}
      onDragStart={(e) => {
        e.dataTransfer.setData(DRAG_TYPE, task.id);
        e.dataTransfer.effectAllowed = 'move';
        setDragging(true);
      }}
      onDragEnd={() => { setDragging(false); endHover(); }}
      // dragenter/dragleave also fire for every child the pointer crosses (enter the child first,
      // then leave the parent). Counting them keeps the highlight steady until the row is really left.
      onDragEnter={(e) => {
        if (!draggable || !isTaskDrag(e)) return;
        dragDepth.current += 1;
        setOver(true);
      }}
      onDragOver={(e) => {
        if (!draggable || !isTaskDrag(e)) return;
        e.preventDefault(); // marks the row as a valid drop target
        e.dataTransfer.dropEffect = 'move';
      }}
      onDragLeave={() => {
        dragDepth.current = Math.max(0, dragDepth.current - 1);
        if (dragDepth.current === 0) setOver(false);
      }}
      onDrop={(e) => {
        endHover();
        if (!draggable || !isTaskDrag(e)) return;
        e.preventDefault();
        const from = e.dataTransfer.getData(DRAG_TYPE);
        if (from && from !== task.id) onMove(from, task.id);
      }}
    >
      <input
        className={`check${task.priority === 'high' && !task.done ? ' high' : ''}`}
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
        aria-label={`Done: ${task.text}`}
      />
      <div className="body">
        {editing ? (
          <input className="edit" type="text" dir="auto" autoFocus maxLength={120} value={draft} aria-label="Edit task"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') finish(true, true);
              if (e.key === 'Escape') finish(false, true);
            }}
            onBlur={() => finish(true)} />
        ) : (
          <span ref={textRef} className="text" dir="auto" tabIndex={0} title="Double-click or press F2 to rename" aria-keyshortcuts="F2" aria-describedby="rename-hint" onDoubleClick={startEdit}>
            <Highlight text={task.text} query={query} />
          </span>
        )}
        <div className="meta">
          {/* Marks only for exceptions: high priority says so; medium and low show nothing. */}
          {task.priority === 'high' && <span className="pill prio-high"><span className="sr-only">Priority: High</span><span aria-hidden="true">!high</span></span>}
          {due?.tone === 'today' && <span className={`pill due-today${hideDue ? ' sr-only' : ''}`}><span className="sr-only">Due </span>Today</span>}
          {due?.tone === 'overdue' && <span className="tag overdue"><AlertIcon size={14} />{due.label}</span>}
          {due?.tone === 'later' && !(hideDue && !task.done) && <span className="tag">{weekday && !task.done ? WEEKDAY.format(parseISO(task.dueDate!)!) : due.label}</span>}
          {list && <span className="tag list-tag">#{list.name}</span>}
          {subs.length > 0 && <span className="tag">{subs.filter((s) => s.done).length}/{subs.length} steps</span>}
          {task.notes && <span className="tag">note</span>}
          {task.repeat && task.dueDate && <span className="tag"><RepeatIcon size={13} />repeats {task.repeat}</span>}
        </div>
      </div>
      <button className="act" type="button" onClick={() => onOpen(task.id)} aria-label={`Open details for "${task.text}"`}>
        <MoreIcon />
      </button>
      {stamped && (
        <svg className="postmark" viewBox="0 0 124 64" aria-hidden="true">
          <filter id={`ink-${task.id}`}><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves={2} seed={7} /><feDisplacementMap in="SourceGraphic" scale={2.2} /></filter>
          <g filter={`url(#ink-${task.id})`} fill="none" stroke="currentColor">
            <circle cx="32" cy="32" r="28" strokeWidth="2.2" /><circle cx="32" cy="32" r="21" strokeWidth="1.2" />
            {[20, 29, 38, 47].map((y) => <path key={y} d={`M64 ${y} q7 -6 14 0 t14 0 t14 0 t14 0`} strokeWidth="2" />)}
          </g>
          <text x="32" y="30" textAnchor="middle" fontSize="9">{stamped}</text>
          <text x="32" y="41" textAnchor="middle" fontSize="7">TASKS</text>
        </svg>
      )}
      <button className="act del" type="button" onClick={() => onDelete(task.id)} aria-label={`Delete "${task.text}"`}>
        <TrashIcon />
      </button>
    </li>
  );
}
