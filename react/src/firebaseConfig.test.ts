import { describe, expect, it } from 'vitest';
import { readConfig } from './firebaseConfig';

const full = {
  VITE_FIREBASE_API_KEY: 'key',
  VITE_FIREBASE_AUTH_DOMAIN: 'tasks-demo.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'tasks-demo',
  VITE_FIREBASE_APP_ID: '1:2:web:3',
};

describe('Firebase config', () => {
  it('reads a complete config', () => {
    expect(readConfig(full)).toEqual({ apiKey: 'key', authDomain: 'tasks-demo.firebaseapp.com', projectId: 'tasks-demo', appId: '1:2:web:3' });
  });

  it('is null when any value is missing, so the app stays guest-only', () => {
    for (const key of Object.keys(full)) {
      expect(readConfig({ ...full, [key]: undefined })).toBeNull();
      expect(readConfig({ ...full, [key]: '  ' })).toBeNull();
    }
  });

  it('trims stray spaces from build variables', () => {
    expect(readConfig({ ...full, VITE_FIREBASE_PROJECT_ID: ' tasks-demo ' })?.projectId).toBe('tasks-demo');
  });

  it('is null in this test build, which has no Firebase variables', () => {
    expect(readConfig()).toBeNull();
  });
});
