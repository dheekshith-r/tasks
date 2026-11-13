import { todayISO } from './dates';
import type { Priority } from './types';

export interface Parsed {
  text: string;
  priority?: Priority;
  dueDate?: string;
  listName?: string;
}

// Tokens only count as whole, whitespace-separated words, so "tomorrow's" or "wow!high" stay text.
const PRIORITY = /(^|\s)!(high|medium|med|low)(?=\s|$)/gi;
const LIST = /(^|\s)#([\p{L}\p{N}_-]{1,40})(?=\s|$)/gu;
const DATE_WORD = /(^|\s)(today|tomorrow|tmrw|monday|mon|tuesday|tues|tue|wednesday|wed|thursday|thurs|thu|friday|fri|saturday|sat|sunday|sun)(?=\s|$)/gi;
const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const tidy = (s: string) => s.replace(/\s+/g, ' ').trim();

// Days ahead for a date word: today 0, tomorrow 1, a weekday name 0 to 6 (today counts as today).
function offset(word: string, now: Date): number {
  const w = word.toLowerCase();
  if (w === 'today') return 0;
  if (w === 'tomorrow' || w === 'tmrw') return 1;
  return (DAYS.indexOf(w.slice(0, 3)) - now.getDay() + 7) % 7;
}

// "Pay rent friday !high #home" -> text "Pay rent", due next Friday, high priority, list "home"
export function parseQuickAdd(input: string, now = new Date()): Parsed {
  let text = input;
  let priority: Priority | undefined;
  let dueDate: string | undefined;
  let listName: string | undefined;

  // Every priority token is removed; if several were typed, the last one wins.
  text = text.replace(PRIORITY, (_match, lead: string, word: string) => {
    const level = word.toLowerCase();
    priority = level === 'medium' ? 'med' : (level as Priority);
    return lead;
  });

  // Every #list token is removed; the last one names the list.
  text = text.replace(LIST, (_match, lead: string, name: string) => {
    listName = name;
    return lead;
  });

  // The last standalone date word is the due date. Earlier ones are part of the title.
  const last = [...text.matchAll(DATE_WORD)].pop();
  if (last) {
    const rest = tidy(text.slice(0, last.index) + ' ' + text.slice(last.index + last[0].length));
    if (rest) { // a task that is only the word "today" keeps it as its title
      dueDate = todayISO(new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset(last[2], now)));
      text = rest;
    }
  }
  const parsed: Parsed = { text: tidy(text), priority, dueDate };
  if (listName) parsed.listName = listName;
  return parsed;
}
