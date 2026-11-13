// Verifies the built page: every inline script must be allowed by a hash in the CSP meta tag.
// Hashes the text the way a browser does (the HTML parser turns CRLF into LF first).
// Usage: npm run build && npm run csp   (exits 1 on a mismatch or a missing policy)
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const html = readFileSync(fileURLToPath(new URL('../dist/index.html', import.meta.url)), 'utf8');
const policy = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1];
if (!policy) { console.error('No Content-Security-Policy meta tag in dist/index.html'); process.exit(1); }
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(([, body]) => body.replace(/\r\n?/g, '\n'));
let failed = 0;
for (const body of scripts) {
  const hash = `'sha256-${createHash('sha256').update(body).digest('base64')}'`;
  const ok = policy.includes(hash);
  if (!ok) failed++;
  console.log(`${ok ? 'pass' : 'FAIL'}  inline script ${hash}`);
}
// The offline worker and the install manifest must come from this site only.
for (const directive of ["worker-src 'self'", "manifest-src 'self'"]) {
  const ok = policy.split(';').some((part) => part.trim() === directive);
  if (!ok) failed++;
  console.log(`${ok ? 'pass' : 'FAIL'}  ${directive}`);
}
if (!html.includes('<link rel="manifest" href="manifest.webmanifest">')) { failed++; console.log('FAIL  manifest link missing'); }
console.log(failed ? `${failed} CSP check(s) failed.` : `All ${scripts.length} inline script(s) allowed by the CSP; worker and manifest restricted to this site.`);
process.exit(failed ? 1 : 0);
