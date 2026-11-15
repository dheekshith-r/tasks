import { type FormEvent, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { parseLine } from '../landing/parseLine';
import type { Priority } from '../types';
import { AlertIcon } from './icons';

interface Props {
  onAdd: (text: string, priority: Priority, dueDate?: string, listName?: string) => void;
  landed?: string; // "Added to Today", shown for a few seconds under the line
}

const KIND = { due: 'm-due', priority: 'm-pr', list: 'm-list' } as const;

// One line, the way the start page reads it: the words it understands are marked while you type
// (the day in yellow, the priority in red, the list boxed). The same parser decides what is saved,
// so what is marked is exactly what happens.
export default function TaskForm({ onAdd, landed }: Props) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const mirrorRef = useRef<HTMLSpanElement>(null);
  const parsed = useMemo(() => parseLine(text), [text]);

  // The marks sit in a copy of the text behind the (transparent) input; it follows the input's scroll.
  // Reading scrollLeft forces a layout, so an empty field (the first render) never reads it.
  const sync = () => {
    const input = inputRef.current, mirror = mirrorRef.current;
    if (!input || !mirror) return;
    mirror.style.transform = input.value ? `translateX(${-input.scrollLeft}px)` : '';
  };
  useLayoutEffect(() => { if (text) sync(); }, [text]); // eslint-disable-line react-hooks/exhaustive-deps

  const pieces: { text: string; cls?: string }[] = [];
  let at = 0;
  for (const t of parsed.tokens) {
    if (t.start > at) pieces.push({ text: text.slice(at, t.start) });
    pieces.push({ text: text.slice(t.start, t.end), cls: KIND[t.kind] });
    at = t.end;
  }
  if (at < text.length) pieces.push({ text: text.slice(at) });

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) {
      setError('Enter a task before adding it.');
      inputRef.current?.focus(); // straight back to the field, so the fix is one keystroke away
      return;
    }
    onAdd(parsed.title, parsed.priority, parsed.dueDate, parsed.listName);
    setText('');
  }

  return (
    <form className="composer" onSubmit={submit} autoComplete="off">
      <div className="line">
        <div className="line-field">
          <div className="line-mirror" aria-hidden="true"><span ref={mirrorRef}>{pieces.map((p, i) => (p.cls ? <span key={i} className={p.cls}>{p.text}</span> : p.text))}</span></div>
          <label className="sr-only" htmlFor="new-task">New task</label>
          <input
            id="new-task"
            ref={inputRef}
            dir="auto"
            type="text"
            enterKeyHint="done"
            placeholder="Pay rent friday !high #home"
            maxLength={120}
            value={text}
            aria-required="true"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'new-task-error' : 'new-task-hint'}
            data-focus-fallback
            onChange={(e) => { setText(e.target.value); setError(''); }}
            onScroll={sync}
            onKeyUp={sync}
            onSelect={sync}
          />
        </div>
        <button type="submit" className="primary">Add <span className="wide-only">task</span></button>
      </div>
      <p className="sr-only" id="new-task-hint">A day name sets the date, !high sets the priority, and #name files it in a list.</p>
      {error && <p className="error" id="new-task-error" role="alert"><AlertIcon size={16} />{error}</p>}
      <p className="landed" aria-hidden="true">{landed}</p>
    </form>
  );
}
