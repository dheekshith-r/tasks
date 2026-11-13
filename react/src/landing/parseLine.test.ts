import { describe, expect, it } from 'vitest';
import { parseLine } from './parseLine';

const thu = new Date(2026, 10, 12, 9, 0); // Thursday 12 Nov 2026

describe('parseLine', () => {
  it('reads the title, date, priority and list, and where each word sits', () => {
    const line = 'Pay rent friday !high #home';
    const p = parseLine(line, thu);
    expect(p).toMatchObject({ title: 'Pay rent', dueDate: '2026-11-13', dueLabel: 'Tomorrow', priority: 'high', listName: 'home' });
    expect(p.tokens.map((t) => [t.kind, line.slice(t.start, t.end)])).toEqual([['due', 'friday'], ['priority', '!high'], ['list', '#home']]);
  });

  it('counts today as today for a weekday name, and goes forward up to six days', () => {
    expect(parseLine('Bin day thursday', thu).dueDate).toBe('2026-11-12');
    expect(parseLine('Bin day wed', thu).dueDate).toBe('2026-11-18');
    expect(parseLine('Bin day mon', thu).dueLabel).not.toBe('Tomorrow');
  });

  it('reads a Hindi list name whole, and ignores a list word over 24 characters', () => {
    expect(parseLine('Pay rent #मकान', thu)).toMatchObject({ title: 'Pay rent', listName: 'मकान' });
    expect(parseLine('Pay rent #' + 'a'.repeat(25), thu).listName).toBeUndefined();
  });

  it('defaults to medium priority with no date and no list', () => {
    const p = parseLine('Buy curd', thu);
    expect(p).toMatchObject({ title: 'Buy curd', priority: 'med', dueLabel: '', tokens: [] });
    expect(p.dueDate).toBeUndefined();
    expect(p.listName).toBeUndefined();
  });

  it('lets the last word of a kind win, keeping earlier ones in the title', () => {
    const p = parseLine('Plan today tomorrow !low !high', thu);
    expect(p.title).toBe('Plan today !low');
    expect(p.dueDate).toBe('2026-11-13');
    expect(p.priority).toBe('high');
  });

  it('ignores look-alikes inside other words', () => {
    const p = parseLine("Friday's report wow!high #", thu);
    expect(p.title).toBe("Friday's report wow!high #");
    expect(p.tokens).toEqual([]);
  });

  it('keeps a line that is only a keyword as its own title', () => {
    expect(parseLine('today', thu)).toMatchObject({ title: 'today', tokens: [], dueLabel: '' });
  });

  it('accepts lists in any script', () => {
    expect(parseLine('Call Amma #घर', thu).listName).toBe('घर');
  });
});
