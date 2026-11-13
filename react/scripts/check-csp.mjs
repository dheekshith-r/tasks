// Verifies both built pages (the start page and the app): every inline script must be allowed by
// a hash in the CSP meta tag, the worker and manifest must come from this site, there are no
// wildcard sources, and frames come only from a Firebase auth domain (or none at all).
// Hashes the text the way a browser does (the HTML parser turns CRLF into LF first).
// Usage: npm run build && npm run csp   (exits 1 on any failure)
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const PAGES = [
  { file: '../dist/index.html', manifest: '<link rel="manifest" href="manifest.webmanifest">' },
  { file: '../dist/app/index.html', manifest: '<link rel="manifest" href="../manifest.webmanifest">' },
];

let failed = 0;
const check = (ok, label) => { if (!ok) failed++; console.log(`${ok ? 'pass' : 'FAIL'}  ${label}`); };

for (const page of PAGES) {
  console.log(`\n${page.file.replace('../', '')}`);
  const html = readFileSync(fileURLToPath(new URL(page.file, import.meta.url)), 'utf8');
  const policy = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1];
  if (!policy) { check(false, 'Content-Security-Policy meta tag'); continue; }
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(([, body]) => body.replace(/\r\n?/g, '\n'));
  for (const body of scripts) {
    const hash = `'sha256-${createHash('sha256').update(body).digest('base64')}'`;
    check(policy.includes(hash), `inline script ${hash}`);
  }
  for (const directive of ["worker-src 'self'", "manifest-src 'self'"]) {
    check(policy.split(';').some((part) => part.trim() === directive), directive);
  }
  check(html.includes(page.manifest), 'manifest link');
  check(!policy.split(/\s|;/).some((src) => src.includes('*')), 'no wildcard sources');
  const frame = policy.split(';').map((p) => p.trim()).find((p) => p.startsWith('frame-src'));
  check(frame === "frame-src 'none'" || /^frame-src https:\/\/[a-z0-9-]+\.(firebaseapp\.com|web\.app)$/.test(frame ?? ''), frame ?? 'frame-src missing');
}
console.log(failed ? `\n${failed} CSP check(s) failed.` : '\nBoth pages pass: inline scripts hashed, worker and manifest restricted to this site, no wildcards, frames locked.');
process.exit(failed ? 1 : 0);
