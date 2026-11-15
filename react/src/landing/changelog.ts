// "Every change is public" on the start page: list items built at build time from
// `git log --format=%cs%x09%s`. Commit subjects are written by people and have no length limit,
// so every subject is escaped here, once, and lines that are not "date<TAB>subject" are dropped.

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (c) => ESCAPES[c]);

export function changelogItems(log: string, max = 6): string {
  return log
    .split('\n')
    .map((line) => {
      const tab = line.indexOf('\t');
      const date = line.slice(0, tab);
      const subject = line.slice(tab + 1).trim();
      if (tab <= 0 || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !subject) return '';
      return `<li><time datetime="${date}">${date}</time><span class="msg">${escapeHtml(subject)}</span></li>`;
    })
    .filter(Boolean)
    .slice(0, max)
    .join('');
}
