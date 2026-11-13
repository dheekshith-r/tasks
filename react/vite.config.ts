import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages cannot send HTTP headers, so the Content Security Policy goes in a meta tag.
// It is added at build time only (dev mode injects its own inline scripts), and every inline
// script in the final HTML is allowed by its hash, so editing the theme script never breaks it.
// Optional Google sign-in (Firebase) needs a few Google hosts. They are added only when the build
// has a Firebase config, and the auth domain must look like a Firebase domain, so a bad variable
// can never widen the policy.
function firebaseSources(authDomain: string | undefined) {
  if (!authDomain) return { script: '', connect: '', frame: '' };
  if (!/^[a-z0-9-]+\.(firebaseapp\.com|web\.app)$/.test(authDomain)) {
    throw new Error(`VITE_FIREBASE_AUTH_DOMAIN "${authDomain}" is not a Firebase auth domain.`);
  }
  return {
    script: 'https://apis.google.com',
    connect: 'https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com',
    frame: `https://${authDomain}`,
  };
}

function csp(authDomain?: string): Plugin {
  const fb = firebaseSources(authDomain);
  return {
    name: 'csp-meta',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(raw) {
        // Normalise line endings first: a CRLF checkout (Windows) must hash the same bytes that ship.
        const html = raw.replace(/\r\n?/g, '\n');
        const hashes = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
          .map(([, body]) => `'sha256-${createHash('sha256').update(body).digest('base64')}'`);
        const policy = [
          "default-src 'self'",
          `script-src 'self' ${hashes.join(' ')} ${fb.script}`.trim(),
          "style-src 'self'",
          "font-src 'self'",
          "img-src 'self' data:",
          `connect-src 'self' ${fb.connect}`.trim(),
          `frame-src ${fb.frame || "'none'"}`,
          "worker-src 'self'",
          "manifest-src 'self'",
          "object-src 'none'",
          "base-uri 'none'",
          "form-action 'none'",
        ].join('; ');
        return html.replace('<meta charset="UTF-8">', `<meta charset="UTF-8">\n  <meta http-equiv="Content-Security-Policy" content="${policy}">`);
      },
    },
  };
}

const root = fileURLToPath(new URL('.', import.meta.url));

// base './' lets the build work on GitHub Pages under any repo name
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_FIREBASE_');
  return {
    base: './',
    plugins: [react(), csp(env.VITE_FIREBASE_AUTH_DOMAIN?.trim() || undefined)],
    // Budget: the page itself loads one ~265 kB chunk. The Firebase chunk (~650 kB) is fetched
    // only after someone chooses to sign in, so its size never reaches guests.
    build: {
      chunkSizeWarningLimit: 700,
      // Fonts stay files: inlined as data: URLs they would break font-src 'self' and the cache.
      assetsInlineLimit: (file) => (/\.woff2?$/.test(file) ? false : undefined),
      // Two pages: the start page at the site root, the app at /app/.
      rollupOptions: { input: { start: resolve(root, 'index.html'), app: resolve(root, 'app/index.html') } },
    },
  };
});
