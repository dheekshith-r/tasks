// The Firebase web config comes from build-time variables (GitHub Actions variables in CI,
// .env.local on a developer machine). These values identify the project; they are not secrets.
// Access is protected by the Firestore security rules. Without a full config the app is
// guest-only and never loads the Firebase SDK.

export interface FirebaseWebConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
}

type Env = Record<string, string | boolean | undefined>;

export function readConfig(env: Env = import.meta.env): FirebaseWebConfig | null {
  const get = (k: string) => (typeof env[k] === 'string' ? (env[k] as string).trim() : '');
  const config = {
    apiKey: get('VITE_FIREBASE_API_KEY'),
    authDomain: get('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: get('VITE_FIREBASE_PROJECT_ID'),
    appId: get('VITE_FIREBASE_APP_ID'),
  };
  return Object.values(config).every(Boolean) ? config : null;
}
