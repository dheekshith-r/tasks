import { type FormEvent, useRef, useState } from 'react';
import { parseISO, todayISO } from '../dates';
import { useDialog } from '../hooks';
import type { List, Priority, Task } from '../types';
import { CloseIcon, TrashIcon } from './icons';

interface Props {
  task: Task;
  lists: List[];
  onClose: () => void;
  onUpdate: (patch: Partial<Omit<Task, 'id'>>) => void;
  onAddSub: (text: string) => void;
  onToggleSub: (subId: string) => void;
  onDeleteSub: (subId: string) => void;
  onDelete: () => void;
  onMove: (dir: -1 | 1) => void; // a tap alternative to dragging (WCAG 2.5.7)
}

const CLOSE_MS = 180; // matches the .closing animation in index.css
const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'med', label: 'Medium' },
  { value: 'low', label: 'Low' },
];
const dayFromToday = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return todayISO(d); };

// The details of one task, as a slip pulled out of its slot: the title large, then when, how
// important, which list, repeats, notes, subtasks, its place, and delete at the very end.
export default function Drawer({ task, lists, onClose, onUpdate, onAddSub, onToggleSub, onDeleteSub, onDelete, onMove }: Props) {
  const [title, setTitle] = useState(task.text);
  const [sub, setSub] = useState('');
  const [closing, setClosing] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // Saves the title field. An empty title is not allowed, so it snaps back instead.
  function commitTitle() {
    const next = title.trim();
    if (!next) setTitle(task.text);
    else if (next !== task.text) onUpdate({ text: next });
  }

  // Every way of closing (Escape, overlay, button) saves the title first, then plays the
  // slide-out (a fade with reduced motion) before unmounting.
  function close() {
    if (closing) return;
    commitTitle();
    setClosing(true);
    setTimeout(onClose, CLOSE_MS);
  }

  useDialog(ref, true, close);

  function addSub(e: FormEvent) {
    e.preventDefault();
    if (!sub.trim()) return;
    onAddSub(sub);
    setSub('');
  }

  const subs = task.subtasks ?? [];
  const closingClass = closing ? ' closing' : '';
  // One tap sets the most common dates; the date field takes any other day.
  const quick = [
    { label: 'Today', due: dayFromToday(0) },
    { label: 'Tomorrow', due: dayFromToday(1) },
    { label: 'In a week', due: dayFromToday(7) },
    { label: 'No date', due: undefined },
  ];
  const dueText = task.dueDate ? parseISO(task.dueDate)?.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' }) : 'No date';

  return (
    <>
      <div className={`overlay${closingClass}`} onClick={close} />
      <aside ref={ref} className={`drawer${closingClass}`} role="dialog" aria-modal="true" aria-labelledby="drawer-title" tabIndex={-1}>
        <div className="drawer-head">
          <h2 id="drawer-title"><span className="label">Task details</span></h2>
          <button className="icon-btn" type="button" onClick={close} aria-label="Close details"><CloseIcon /></button>
        </div>

        <label className="sr-only" htmlFor="d-title">Title</label>
        <textarea id="d-title" className="d-title" dir="auto" rows={2} maxLength={120} value={title}
          onChange={(e) => setTitle(e.target.value.replace(/\n/g, ' '))}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commitTitle(); } }}
          onBlur={commitTitle} />

        <section className="d-sec" aria-labelledby="d-when">
          <h3 id="d-when">When <span className="d-now">{dueText}</span></h3>
          <div className="chips">
            {quick.map((q) => (
              <button key={q.label} type="button" className="chip" aria-pressed={(task.dueDate ?? undefined) === q.due}
                onClick={() => onUpdate(q.due ? { dueDate: q.due } : { dueDate: undefined, repeat: undefined })}>{q.label}</button>
            ))}
          </div>
          <label htmlFor="d-due">Due date</label>
          <input id="d-due" type="date" value={task.dueDate ?? ''} onChange={(e) => onUpdate({ dueDate: e.target.value || undefined })} />
        </section>

        <section className="d-sec">
          <fieldset className="seg">
            <legend>Priority</legend>
            <div className="seg-row">
              {PRIORITIES.map((p) => (
                <label key={p.value} className={`seg-opt prio-${p.value}`}>
                  <input type="radio" name="d-prio" value={p.value} checked={task.priority === p.value} onChange={() => onUpdate({ priority: p.value })} />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <section className="d-sec grid2">
          <div>
            <label htmlFor="d-list">List</label>
            <select id="d-list" value={task.listId ?? ''} onChange={(e) => onUpdate({ listId: e.target.value || undefined })}>
              <option value="">No list</option>
              {lists.map((l) => <option key={l.id} value={l.id}>#{l.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="d-repeat">Repeat</label>
            <select id="d-repeat" value={task.repeat ?? ''} disabled={!task.dueDate} aria-describedby={task.dueDate ? undefined : 'd-repeat-hint'}
              onChange={(e) => onUpdate({ repeat: (e.target.value || undefined) as Task['repeat'] })}>
              <option value="">Does not repeat</option>
              <option value="daily">Every day</option>
              <option value="weekly">Every week</option>
              <option value="monthly">Every month</option>
            </select>
          </div>
        </section>
        {!task.dueDate && <p className="hint" id="d-repeat-hint">Set a date first. Repeats count from it.</p>}

        <section className="d-sec">
          <label htmlFor="d-notes">Notes</label>
          <textarea id="d-notes" rows={4} placeholder="Details, links, anything" value={task.notes ?? ''} onChange={(e) => onUpdate({ notes: e.target.value })} />
        </section>

        <section className="d-sec">
          <h3 id="d-subs">Subtasks {subs.length > 0 && <span className="d-now">{subs.filter((s) => s.done).length} of {subs.length} done</span>}</h3>
          <ul className="subs" aria-labelledby="d-subs">
            {subs.map((s) => (
              <li key={s.id} className={s.done ? 'done' : ''}>
                <input className="check small" type="checkbox" checked={s.done} onChange={() => onToggleSub(s.id)} aria-label={`Done: ${s.text}`} />
                <span dir="auto">{s.text}</span>
                <button type="button" className="x" aria-label={`Delete subtask "${s.text}"`} onClick={() => onDeleteSub(s.id)}><CloseIcon size={15} /></button>
              </li>
            ))}
          </ul>
          <form onSubmit={addSub} className="sub-form">
            <label className="sr-only" htmlFor="d-sub">New subtask</label>
            <input id="d-sub" type="text" placeholder="Add a subtask, then Enter" maxLength={100} value={sub} onChange={(e) => setSub(e.target.value)} />
          </form>
        </section>

        <section className="d-sec">
          <h3 id="d-order">Place in its section</h3>
          <div className="order" role="group" aria-labelledby="d-order">
            <button type="button" className="move" onClick={() => onMove(-1)}>Move up</button>
            <button type="button" className="move" onClick={() => onMove(1)}>Move down</button>
          </div>
        </section>

        <button type="button" className="danger" onClick={onDelete}><TrashIcon size={16} />Delete task</button>
        <p className="hint d-undo">You can undo a delete for a few seconds.</p>
      </aside>
    </>
  );
}
