import { defineConfig } from 'vitest/config';

// Security-rules tests. They need the Firestore emulator, so they run through `npm run test:rules`
// (firebase emulators:exec), never as part of the plain `npm test`.
export default defineConfig({
  test: {
    include: ['rules/**/*.rules-test.ts'],
    environment: 'node',
    testTimeout: 20000,
    fileParallelism: false,
  },
});
