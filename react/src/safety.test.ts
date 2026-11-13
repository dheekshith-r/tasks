// @vitest-environment jsdom
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beforeEach, describe, expect, it } from 'vitest';
import { loadBackupDate, loadPersist, requestPersist, saveBackupDate, storageMessage } from './safety';

const fakeStorage = (opts: { persisted?: boolean; persist?: boolean | Error }) => ({
  persisted: async () => opts.persisted ?? false,
  persist: async () => {
    if (opts.persist instanceof Error) throw opts.persist;
    return opts.persist ?? false;
  },
}) as unknown as StorageManager;

beforeEach(() => localStorage.clear());

describe('persistent storage request', () => {
  it('starts as unknown', () => {
    expect(loadPersist()).toBe('unknown');
  });

  it('records a granted request and remembers it', async () => {
    expect(await requestPersist(fakeStorage({ persist: true }))).toBe('granted');
    expect(loadPersist()).toBe('granted');
  });

  it('does not ask again when the data is already persisted', async () => {
    let asked = false;
    const storage = { persisted: async () => true, persist: async () => { asked = true; return true; } } as unknown as StorageManager;
    expect(await requestPersist(storage)).toBe('granted');
    expect(asked).toBe(false);
  });

  it('records a refusal', async () => {
    expect(await requestPersist(fakeStorage({ persist: false }))).toBe('denied');
    expect(loadPersist()).toBe('denied');
  });

  it('treats a throwing browser as a refusal, not a crash', async () => {
    expect(await requestPersist(fakeStorage({ persist: new Error('blocked') }))).toBe('denied');
  });

  it('reports browsers without the Storage API as unsupported', async () => {
    expect(await requestPersist(undefined)).toBe('unsupported');
    expect(loadPersist()).toBe('unsupported');
  });

  it('ignores a corrupted stored answer', () => {
    localStorage.setItem('todo-persist:v1', '<script>');
    expect(loadPersist()).toBe('unknown');
  });

  it('has a plain message for every state', () => {
    expect(storageMessage('granted')).toMatch(/Protected/);
    expect(storageMessage('denied')).toMatch(/Install Tasks or export a backup/);
    expect(storageMessage('unknown')).toMatch(/Not protected yet/);
    expect(storageMessage('unsupported')).toMatch(/cannot protect/);
  });
});

describe('last backup date', () => {
  it('is null before the first export', () => {
    expect(loadBackupDate()).toBeNull();
  });

  it('round-trips a valid date', () => {
    saveBackupDate('2026-11-12');
    expect(loadBackupDate()).toBe('2026-11-12');
  });

  it('never stores or returns an invalid date', () => {
    saveBackupDate('yesterday');
    expect(loadBackupDate()).toBeNull();
    localStorage.setItem('todo-backup:v1', '2026-02-31');
    expect(loadBackupDate()).toBeNull();
  });
});

describe('installable app files', () => {
  const file = (path: string) => fileURLToPath(new URL(path, import.meta.url));
  const manifest = JSON.parse(readFileSync(file('../public/manifest.webmanifest'), 'utf8'));

  it('links the manifest from the start page and from the app', () => {
    expect(readFileSync(file('../index.html'), 'utf8')).toMatch(/<link rel="manifest" href="manifest.webmanifest">/);
    expect(readFileSync(file('../app/index.html'), 'utf8')).toMatch(/<link rel="manifest" href="..\/manifest.webmanifest">/);
  });

  it('describes a standalone app that opens on the list, inside the site scope', () => {
    expect(manifest.name).toBe('Tasks');
    expect(manifest.display).toBe('standalone');
    expect(manifest.start_url).toBe('./app/');
    expect(manifest.scope).toBe('./');
  });

  it('ships every icon it lists, including a maskable one', () => {
    for (const icon of manifest.icons) expect(existsSync(file(`../public/${icon.src}`))).toBe(true);
    expect(manifest.icons.some((i: { purpose?: string }) => i.purpose === 'maskable')).toBe(true);
    expect(manifest.icons.map((i: { sizes: string }) => i.sizes)).toEqual(expect.arrayContaining(['192x192', '512x512']));
  });

  it('ships a service worker that never handles other sites except fonts, and caches both pages', () => {
    const sw = readFileSync(file('../public/sw.js'), 'utf8');
    expect(sw).toMatch(/fonts\.gstatic\.com/);
    expect(sw).toMatch(/method !== 'GET'/);
    expect(sw).toMatch(/'\.\/app\/'/);
  });
});
