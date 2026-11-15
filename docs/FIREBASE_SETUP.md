# Firebase setup (optional Google sign-in)

Tasks works without any of this. Guest mode keeps tasks on the device. These steps turn on the optional "Sign in with Google" sync, on the free **Spark** plan. No credit card is needed.

**Status (2026-11-14):** done for project `tasks-dheekshith` (Firestore in `asia-south1`, production mode, rules deployed, Google sign-in on, GitHub Pages domain authorized, web app "Tasks web" created). `react/.firebaserc` links the CLI to this project. Still open: the GitHub variables and a live sign-in test.

Who does what: steps marked **(Ddk)** need your Google login in a browser. Claude does all the steps marked **(Claude)** with the Firebase CLI and `gh`.

## 1. Create the project
1. **(Ddk)** Open https://console.firebase.google.com and click **Create a project**. Name it, for example, `tasks-dheekshith`. Turn Google Analytics off; Tasks does not use it.
2. **(Ddk)** Keep the **Spark (no-cost)** plan. Do not add a billing account. Without one, Firebase cannot charge anything. If a daily quota runs out, sync pauses until the reset around midnight Pacific time.

## 2. Turn on Google sign-in
1. **(Ddk)** Go to **Build > Authentication > Get started > Sign-in method**, enable **Google**, pick a support email and save.
2. **(Ddk)** Go to **Authentication > Settings > Authorized domains** and add `dheekshithsnewjourney-crypto.github.io`. `localhost` is already there.

## 3. Create the database and lock it down
1. **(Ddk)** Go to **Build > Firestore Database > Create database**, choose **production mode** and a location near you (for example `asia-south1`, Mumbai). The location cannot change later.
2. **(Ddk)** In a terminal, run `npx firebase-tools@15.36.0 login` once, so Claude can deploy rules.
3. **(Claude)** Deploy the tested rules: `npx firebase-tools@15.36.0 deploy --only firestore:rules --project <project-id>` from `react/`.

## 4. Register the web app and connect the build
1. **(Claude)** Create the web app and read its config: `firebase apps:create web Tasks`, then `firebase apps:sdkconfig web <app-id>`.
2. **(Claude)** Store the four values as GitHub Actions **variables**, after Ddk confirms: `gh variable set VITE_FIREBASE_API_KEY ...` (also `_AUTH_DOMAIN`, `_PROJECT_ID`, `_APP_ID`).
3. **(Ddk, recommended)** Restrict the API key: Google Cloud console > **APIs & Services > Credentials** > the "Browser key". Under **Website restrictions** add `https://dheekshithsnewjourney-crypto.github.io/*` and `http://localhost:5173/*`.

## 5. Check
- Push to `main`. CI runs the rules tests, builds with the variables, checks the CSP and deploys.
- Open the live app, click **Sign in with Google**, add a task, and open the app on a second device. The task appears there.

## What is stored, and where
- **Guests:** this browser only (localStorage). Nothing is uploaded.
- **Signed in:** stored in Cloud Firestore at `users/<your uid>/tasks` and `users/<your uid>/lists`. Only you can read or write them: `react/firestore.rules`, tested in `react/rules/`.
- **Delete:** "Delete my cloud data" in the app removes every task, every list and the account.
