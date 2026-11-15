import type { ReactNode } from 'react';

export type EmptyKind = 'all' | 'today' | 'upcoming' | 'overdue' | 'list' | 'search' | 'allDone' | 'noneDone';

interface Props {
  kind: EmptyKind;
  listName?: string;
  query?: string;
  onClearSearch?: () => void;
}

// Drawn in ink like the start page: an empty slot with its yellow label, and one object that says
// what is (not) there. Each line is drawn twice, a little apart, like a pen going over it.
const slot = <><path className="e-fill" d="M14 30 H106 V82 H14 Z" /><path className="e-ink" d="M14 30 H106 V82 H14 Z" /><path className="e-sun" d="M14 30 H52 V40 H14 Z" /></>;
const ART: Record<EmptyKind, ReactNode> = {
  all: <>{slot}<g transform="rotate(-8 60 22)"><path className="e-paper" d="M40 8 H80 V30 H40 Z" /><path className="e-ink thin" d="M40 8 H80 V30 H40 Z M46 16 H72 M46 22 H64" /></g><path className="e-ink thin" d="M60 34 v8 m-4 -4 l4 4 l4 -4" /></>,
  list: <>{slot}<path className="e-ink" d="M50 48 l-4 22 M62 48 l-4 22 M42 56 H68 M40 64 H66" /></>,
  today: <><circle className="e-sun" cx="60" cy="40" r="15" /><circle className="e-ink" cx="60" cy="40" r="15" /><path className="e-ink thin" d="M60 14 V20 M60 60 V66 M34 40 H40 M80 40 H86 M42 22 l4 4 M74 54 l4 4 M42 58 l4 -4 M74 26 l4 -4" /><path className="e-ink" d="M10 80 H110" /></>,
  upcoming: <><path className="e-fill" d="M10 26 H38 V80 H10 Z M46 26 H74 V80 H46 Z M82 26 H110 V80 H82 Z" /><path className="e-ink" d="M10 26 H38 V80 H10 Z M46 26 H74 V80 H46 Z M82 26 H110 V80 H82 Z" /><text className="e-num" x="16" y="44">16</text><text className="e-num" x="52" y="44">17</text><text className="e-num" x="88" y="44">18</text></>,
  overdue: <><path className="e-fill" d="M18 22 H102 V80 H18 Z" /><path className="e-line" d="M18 22 H102 V80 H18 Z" /><path className="e-ink" d="M40 34 V12 a4 4 0 0 1 8 0 V30 a6 6 0 0 1 -12 0 V16" /></>,
  search: <>{slot}<circle className="e-ink" cx="72" cy="54" r="12" /><path className="e-ink" d="M81 63 l12 12" /></>,
  allDone: <>{slot}<path className="e-paper" d="M30 46 H90 V72 H30 Z" /><path className="e-ink thin" d="M30 46 H90 V72 H30 Z" /><path className="e-ink" d="M38 58 l6 6 l12 -12" /><circle className="e-mark" cx="80" cy="50" r="11" /></>,
  noneDone: <>{slot}<path className="e-ink" d="M50 48 H70 V68 H50 Z" /></>,
};

export default function EmptyState({ kind, listName, query, onClearSearch }: Props) {
  // [title, text, handwritten note]
  const copy: Record<EmptyKind, [string, string, string]> = {
    all: ['No tasks yet', 'Write one line in the box: "Call Sam friday !high" sets the day and the priority.', 'your first line'],
    today: ['Nothing due today', 'A clear day. Tasks you add in this view are due today.', 'a clear day'],
    upcoming: ['Nothing upcoming', 'Give a task a future day, like "Dentist thursday", and it waits here.', 'nothing planned yet'],
    overdue: ['Nothing carried over', 'No task is waiting from an earlier day.', 'a clean desk'],
    list: [`${listName ?? 'This list'} is empty`, `Write a line in the box and it goes straight into ${listName ? `#${listName}` : 'this list'}.`, 'empty for now'],
    search: ['No matches', `Nothing in any list matches "${query ?? ''}".`, 'try fewer words'],
    allDone: ['All done in this view', 'Every task here is complete.', 'well done'],
    noneDone: ['No completed tasks', 'Tick a task and it appears here.', 'nothing ticked yet'],
  };
  const [title, text, note] = copy[kind];

  return (
    <div className="empty">
      <svg viewBox="0 0 120 90" width="120" height="90" aria-hidden="true">{ART[kind]}</svg>
      <div className="empty-words">
        <h3>{title}</h3>
        <p>{text}</p>
        {kind === 'search' && onClearSearch && (
          <button type="button" className="link" onClick={onClearSearch}>Clear search</button>
        )}
      </div>
      <p className="empty-note" aria-hidden="true">{note}</p>
    </div>
  );
}
