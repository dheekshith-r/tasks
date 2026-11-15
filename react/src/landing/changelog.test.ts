import { describe, expect, it } from 'vitest';
import { changelogItems } from './changelog';

describe('changelogItems', () => {
  it('turns date<TAB>subject lines into list items', () => {
    expect(changelogItems('2026-11-15\tStart page checkpoint 2\n')).toBe(
      '<li><time datetime="2026-11-15">2026-11-15</time><span class="msg">Start page checkpoint 2</span></li>',
    );
  });

  it('escapes markup in a subject, so a commit can never add HTML to the page', () => {
    const html = changelogItems('2026-11-15\tFix <script>alert(1)</script> & "quotes" in <b>tags</b>');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<b>');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt; &amp; &quot;quotes&quot; in &lt;b&gt;tags&lt;/b&gt;');
  });

  it('keeps a very long subject whole (the page wraps it) and a tab inside the subject', () => {
    const subject = `Refactor ${'the-really-long-module-name/'.repeat(12)}\tand more`;
    expect(changelogItems(`2026-11-15\t${subject}`)).toContain(subject);
  });

  it('drops lines that are not a date, a tab and a subject', () => {
    const log = ['not a date\tsubject', '2026-11-15\t   ', 'no tab at all', '\tno date', '2026-13-99x\tbad date', ''].join('\n');
    expect(changelogItems(log)).toBe('');
  });

  it('lists at most six changes', () => {
    const log = Array.from({ length: 9 }, (_, i) => `2026-11-0${i + 1}\tChange ${i + 1}`).join('\n');
    expect(changelogItems(log).match(/<li>/g)).toHaveLength(6);
  });
});
