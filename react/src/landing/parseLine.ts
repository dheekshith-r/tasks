import { todayISO } from '../dates';
import type { Priority } from '../types';

// Reads one typed line the way the start page shows it: which words are the date, the priority
// and the list, and where they sit in the line (the pencil marks those spans).
// "Pay rent friday !high #home" -> title "Pay rent", next Friday, high priority, list "home".

export type TokenKind = 'due' | 'priority' | 'list';
export interface LineToken { kind: TokenKind; start: number; end: number }
export interface ParsedLine {
  title: string;
  tokens: LineToken[];
  dueDate?: string; // YYYY-MM-DD
  dueLabel: string; // "Today", "Tomorrow" or a short date in the reader's locale
  priority: Priority;
  listName?: string;
}

const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DATE_WORD = /^(today|tomorrow|tmrw|monday|mon|tuesday|tues|tue|wednesday|wed|thursday|thurs|thu|friday|fri|saturday|sat|sunday|sun)$/i;
const PRIORITY_WORD = /^!(high|medium|med|low)$/i;
const LIST_WORD = /^#([\p{L}\p{M}\p{N}_-]{1,24})$/u;

function dateFor(word: string, now: Date): Date {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const w = word.toLowerCase();
  if (w === 'tomorrow' || w === 'tmrw') d.setDate(d.getDate() + 1);
  else if (w !== 'today') d.setDate(d.getDate() + ((DAYS.indexOf(w.slice(0, 3)) - d.getDay() + 7) % 7));
  return d;
}

export function dueLabel(date: Date, now = new Date()): string {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((date.getTime() - today.getTime()) / 86_400_000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
}

export function parseLine(line: string, now = new Date()): ParsedLine {
  const words = [...line.matchAll(/\S+/g)].map((m) => ({ text: m[0], start: m.index ?? 0 }));
  // The last word of each kind wins; earlier ones stay part of the title, as in the app's quick-add.
  const last = (re: RegExp) => [...words].reverse().find((w) => re.test(w.text));
  const due = last(DATE_WORD);
  const pr = last(PRIORITY_WORD);
  const list = last(LIST_WORD);
  const picked = [due, pr, list].filter((w): w is { text: string; start: number } => !!w);

  const titleWords = words.filter((w) => !picked.includes(w)).map((w) => w.text);
  const title = titleWords.join(' ') || line.trim(); // a line that is only "today" keeps it as its title

  const tokens: LineToken[] = [];
  const mark = (w: { text: string; start: number } | undefined, kind: TokenKind) => {
    if (w && titleWords.length) tokens.push({ kind, start: w.start, end: w.start + w.text.length });
  };
  mark(due, 'due');
  mark(pr, 'priority');
  mark(list, 'list');
  tokens.sort((a, b) => a.start - b.start);

  const parsed: ParsedLine = { title, tokens, dueLabel: '', priority: 'med' };
  if (due && titleWords.length) {
    const date = dateFor(due.text, now);
    parsed.dueDate = todayISO(date);
    parsed.dueLabel = dueLabel(date, now);
  }
  if (pr && titleWords.length) {
    const p = pr.text.slice(1).toLowerCase();
    parsed.priority = p === 'high' ? 'high' : p === 'low' ? 'low' : 'med';
  }
  if (list && titleWords.length) parsed.listName = list.text.slice(1);
  return parsed;
}
